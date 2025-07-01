from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Budget
from extensions import db
from datetime import datetime

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    try:
        user_id = get_jwt_identity()
        
        # Get query parameters
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)
        
        # Build query
        query = Budget.query.filter_by(user_id=user_id)
        
        if month:
            query = query.filter_by(month=month)
        if year:
            query = query.filter_by(year=year)
        
        budgets = query.all()
        
        return jsonify({
            'budgets': [budget.to_dict() for budget in budgets]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get budgets'}), 500

@budget_bp.route('/budgets', methods=['POST'])
@jwt_required()
def create_budget():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        category = data.get('category', '').strip()
        amount = data.get('amount')
        month = data.get('month', datetime.now().month)
        year = data.get('year', datetime.now().year)
        
        # Validation
        if not category:
            return jsonify({'error': 'Category is required'}), 400
        
        if not amount or amount <= 0:
            return jsonify({'error': 'Amount must be greater than 0'}), 400
        
        if not (1 <= month <= 12):
            return jsonify({'error': 'Month must be between 1 and 12'}), 400
        
        if year < 2000 or year > 2100:
            return jsonify({'error': 'Year must be between 2000 and 2100'}), 400
        
        # Check if budget already exists for this category, month, year
        existing_budget = Budget.query.filter_by(
            user_id=user_id,
            category=category,
            month=month,
            year=year
        ).first()
        
        if existing_budget:
            # Update existing budget
            existing_budget.amount = amount
            db.session.commit()
            
            return jsonify({
                'message': 'Budget updated successfully',
                'budget': existing_budget.to_dict()
            }), 200
        else:
            # Create new budget
            budget = Budget(
                user_id=user_id,
                category=category,
                amount=amount,
                month=month,
                year=year
            )
            
            db.session.add(budget)
            db.session.commit()
            
            return jsonify({
                'message': 'Budget created successfully',
                'budget': budget.to_dict()
            }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create budget'}), 500

@budget_bp.route('/budgets/<int:budget_id>', methods=['PUT'])
@jwt_required()
def update_budget(budget_id):
    try:
        user_id = get_jwt_identity()
        budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
        
        if not budget:
            return jsonify({'error': 'Budget not found'}), 404
        
        data = request.get_json()
        
        if 'category' in data:
            category = data['category'].strip()
            if not category:
                return jsonify({'error': 'Category cannot be empty'}), 400
            budget.category = category
        
        if 'amount' in data:
            amount = data['amount']
            if not amount or amount <= 0:
                return jsonify({'error': 'Amount must be greater than 0'}), 400
            budget.amount = amount
        
        if 'month' in data:
            month = data['month']
            if not (1 <= month <= 12):
                return jsonify({'error': 'Month must be between 1 and 12'}), 400
            budget.month = month
        
        if 'year' in data:
            year = data['year']
            if year < 2000 or year > 2100:
                return jsonify({'error': 'Year must be between 2000 and 2100'}), 400
            budget.year = year
        
        db.session.commit()
        
        return jsonify({
            'message': 'Budget updated successfully',
            'budget': budget.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update budget'}), 500

@budget_bp.route('/budgets/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    try:
        user_id = get_jwt_identity()
        budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
        
        if not budget:
            return jsonify({'error': 'Budget not found'}), 404
        
        db.session.delete(budget)
        db.session.commit()
        
        return jsonify({'message': 'Budget deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete budget'}), 500
