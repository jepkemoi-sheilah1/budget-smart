from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Budget
from extensions import db
from datetime import datetime

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('', methods=['GET'])
@jwt_required()
def get_budgets():
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)
        
        # Build query
        query = Budget.query.filter_by(user_id=current_user_id)
        
        if month:
            query = query.filter_by(month=month)
        if year:
            query = query.filter_by(year=year)
        
        budgets = query.all()
        
        return jsonify({
            'budgets': [budget.to_dict() for budget in budgets]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('', methods=['POST'])
@jwt_required()
def create_budget():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        category = data.get('category')
        amount = data.get('amount')
        month = data.get('month')
        year = data.get('year')
        
        if not all([category, amount, month, year]):
            return jsonify({'error': 'Category, amount, month, and year are required'}), 400
        
        # Check if budget already exists for this category, month, and year
        existing_budget = Budget.query.filter_by(
            user_id=current_user_id,
            category=category,
            month=month,
            year=year
        ).first()
        
        if existing_budget:
            return jsonify({'error': 'Budget already exists for this category and period'}), 400
        
        budget = Budget(
            user_id=current_user_id,
            category=category,
            amount=float(amount),
            month=int(month),
            year=int(year)
        )
        
        db.session.add(budget)
        db.session.commit()
        
        return jsonify({
            'message': 'Budget created successfully',
            'budget': budget.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/<int:budget_id>', methods=['PUT'])
@jwt_required()
def update_budget(budget_id):
    try:
        current_user_id = get_jwt_identity()
        budget = Budget.query.filter_by(id=budget_id, user_id=current_user_id).first()
        
        if not budget:
            return jsonify({'error': 'Budget not found'}), 404
        
        data = request.get_json()
        
        if 'category' in data:
            budget.category = data['category']
        if 'amount' in data:
            budget.amount = float(data['amount'])
        if 'month' in data:
            budget.month = int(data['month'])
        if 'year' in data:
            budget.year = int(data['year'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Budget updated successfully',
            'budget': budget.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    try:
        current_user_id = get_jwt_identity()
        budget = Budget.query.filter_by(id=budget_id, user_id=current_user_id).first()
        
        if not budget:
            return jsonify({'error': 'Budget not found'}), 404
        
        db.session.delete(budget)
        db.session.commit()
        
        return jsonify({'message': 'Budget deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
