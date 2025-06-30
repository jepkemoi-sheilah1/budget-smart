from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Expense
from extensions import db
from datetime import datetime, date

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('', methods=['GET'])
@jwt_required()
def get_expenses():
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        category = request.args.get('category')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        limit = request.args.get('limit', type=int)
        
        # Build query
        query = Expense.query.filter_by(user_id=current_user_id)
        
        if category:
            query = query.filter_by(category=category)
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            query = query.filter(Expense.date >= start_date)
        
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(Expense.date <= end_date)
        
        # Order by date descending
        query = query.order_by(Expense.date.desc())
        
        if limit:
            query = query.limit(limit)
        
        expenses = query.all()
        
        return jsonify({
            'expenses': [expense.to_dict() for expense in expenses]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('', methods=['POST'])
@jwt_required()
def create_expense():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        description = data.get('description')
        amount = data.get('amount')
        category = data.get('category')
        expense_date = data.get('date')
        
        if not all([description, amount, category]):
            return jsonify({'error': 'Description, amount, and category are required'}), 400
        
        # Parse date
        if expense_date:
            expense_date = datetime.strptime(expense_date, '%Y-%m-%d').date()
        else:
            expense_date = date.today()
        
        expense = Expense(
            user_id=current_user_id,
            description=description,
            amount=float(amount),
            category=category,
            date=expense_date
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify({
            'message': 'Expense created successfully',
            'expense': expense.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    try:
        current_user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=expense_id, user_id=current_user_id).first()
        
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        data = request.get_json()
        
        if 'description' in data:
            expense.description = data['description']
        if 'amount' in data:
            expense.amount = float(data['amount'])
        if 'category' in data:
            expense.category = data['category']
        if 'date' in data:
            expense.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Expense updated successfully',
            'expense': expense.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    try:
        current_user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=expense_id, user_id=current_user_id).first()
        
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        db.session.delete(expense)
        db.session.commit()
        
        return jsonify({'message': 'Expense deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
