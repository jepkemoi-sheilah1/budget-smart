from flask import Blueprint, request, jsonify
from datetime import datetime

from extensions import db
from models.models import Expense
from routes.auth import token_required

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('', methods=['GET'])
@token_required
def get_expenses(current_user_id):
    category = request.args.get('category')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Expense.query.filter_by(user_id=current_user_id)
    
    if category and category != 'All':
        query = query.filter_by(category=category)
    
    if start_date:
        query = query.filter(Expense.date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    
    if end_date:
        query = query.filter(Expense.date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    expenses = query.order_by(Expense.date.desc()).all()
    
    return jsonify([expense.to_dict() for expense in expenses]), 200

@expense_bp.route('', methods=['POST'])
@token_required
def add_expense(current_user_id):
    data = request.get_json()
    
    if not data or not data.get('description') or not data.get('amount') or not data.get('category'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    description = data['description']
    amount = float(data['amount'])
    category = data['category']
    date_str = data.get('date', datetime.now().strftime('%Y-%m-%d'))
    
    try:
        expense_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400
    
    new_expense = Expense(
        user_id=current_user_id,
        description=description,
        amount=amount,
        category=category,
        date=expense_date
    )
    
    try:
        db.session.add(new_expense)
        db.session.commit()
        
        return jsonify(new_expense.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500

@expense_bp.route('/<int:expense_id>', methods=['PUT'])
@token_required
def update_expense(current_user_id, expense_id):
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    expense = Expense.query.filter_by(
        id=expense_id,
        user_id=current_user_id
    ).first()
    
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    
    # Update expense fields
    if data.get('description'):
        expense.description = data['description']
    
    if data.get('amount') is not None:
        expense.amount = float(data['amount'])
    
    if data.get('category'):
        expense.category = data['category']
    
    if data.get('date'):
        try:
            expense.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
    
    try:
        db.session.commit()
        return jsonify({'message': 'Expense updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500

@expense_bp.route('/<int:expense_id>', methods=['DELETE'])
@token_required
def delete_expense(current_user_id, expense_id):
    expense = Expense.query.filter_by(
        id=expense_id,
        user_id=current_user_id
    ).first()
    
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    
    try:
        db.session.delete(expense)
        db.session.commit()
        
        return jsonify({'message': 'Expense deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500
