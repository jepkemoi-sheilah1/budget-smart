from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Expense
from extensions import db
from datetime import datetime, date

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    try:
        user_id = get_jwt_identity()
        
        # Get query parameters
        category = request.args.get('category')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        limit = request.args.get('limit', type=int)
        
        # Build query
        query = Expense.query.filter_by(user_id=user_id)
        
        if category:
            query = query.filter_by(category=category)
        
        if start_date:
            try:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                query = query.filter(Expense.date >= start_date_obj)
            except ValueError:
                return jsonify({'error': 'Invalid start_date format. Use YYYY-MM-DD'}), 400
        
        if end_date:
            try:
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
                query = query.filter(Expense.date <= end_date_obj)
            except ValueError:
                return jsonify({'error': 'Invalid end_date format. Use YYYY-MM-DD'}), 400
        
        # Order by date descending
        query = query.order_by(Expense.date.desc())
        
        if limit:
            query = query.limit(limit)
        
        expenses = query.all()
        
        return jsonify({
            'expenses': [expense.to_dict() for expense in expenses]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get expenses'}), 500

@expense_bp.route('/expenses', methods=['POST'])
@jwt_required()
def create_expense():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        description = data.get('description', '').strip()
        amount = data.get('amount')
        category = data.get('category', '').strip()
        expense_date = data.get('date')
        
        # Validation
        if not description:
            return jsonify({'error': 'Description is required'}), 400
        
        if not amount or amount <= 0:
            return jsonify({'error': 'Amount must be greater than 0'}), 400
        
        if not category:
            return jsonify({'error': 'Category is required'}), 400
        
        # Parse date
        if expense_date:
            try:
                expense_date_obj = datetime.strptime(expense_date, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        else:
            expense_date_obj = date.today()
        
        # Create expense
        expense = Expense(
            user_id=user_id,
            description=description,
            amount=amount,
            category=category,
            date=expense_date_obj
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify({
            'message': 'Expense created successfully',
            'expense': expense.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create expense'}), 500

@expense_bp.route('/expenses/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    try:
        user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
        
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        data = request.get_json()
        
        if 'description' in data:
            description = data['description'].strip()
            if not description:
                return jsonify({'error': 'Description cannot be empty'}), 400
            expense.description = description
        
        if 'amount' in data:
            amount = data['amount']
            if not amount or amount <= 0:
                return jsonify({'error': 'Amount must be greater than 0'}), 400
            expense.amount = amount
        
        if 'category' in data:
            category = data['category'].strip()
            if not category:
                return jsonify({'error': 'Category cannot be empty'}), 400
            expense.category = category
        
        if 'date' in data:
            try:
                expense_date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()
                expense.date = expense_date_obj
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        db.session.commit()
        
        return jsonify({
            'message': 'Expense updated successfully',
            'expense': expense.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update expense'}), 500

@expense_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    try:
        user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
        
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        db.session.delete(expense)
        db.session.commit()
        
        return jsonify({'message': 'Expense deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete expense'}), 500

@expense_bp.route('/expenses/categories', methods=['GET'])
@jwt_required()
def get_categories():
    try:
        user_id = get_jwt_identity()
        
        # Get unique categories for the user
        categories = db.session.query(Expense.category).filter_by(user_id=user_id).distinct().all()
        category_list = [category[0] for category in categories]
        
        # Add common categories if not present
        common_categories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Education', 'Travel', 'Other']
        
        for category in common_categories:
            if category not in category_list:
                category_list.append(category)
        
        return jsonify({'categories': sorted(category_list)}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get categories'}), 500
