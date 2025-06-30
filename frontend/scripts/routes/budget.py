from flask import Blueprint, request, jsonify
import datetime

from extensions import db
from models.models import Budget
from routes.auth import token_required

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('', methods=['GET'])
@token_required
def get_budgets(current_user_id):
    month = request.args.get('month', datetime.datetime.now().month)
    year = request.args.get('year', datetime.datetime.now().year)
    
    budgets = Budget.query.filter_by(
        user_id=current_user_id,
        month=int(month),
        year=int(year)
    ).all()
    
    budget_dict = {}
    for budget in budgets:
        budget_dict[budget.category] = budget.amount
    
    return jsonify(budget_dict), 200

@budget_bp.route('', methods=['POST'])
@token_required
def set_budget(current_user_id):
    data = request.get_json()
    
    if not data or not data.get('category') or not data.get('amount'):
        return jsonify({'error': 'Missing category or amount'}), 400
    
    category = data['category']
    amount = float(data['amount'])
    month = data.get('month', datetime.datetime.now().month)
    year = data.get('year', datetime.datetime.now().year)
    
    # Check if budget already exists
    existing_budget = Budget.query.filter_by(
        user_id=current_user_id,
        category=category,
        month=int(month),
        year=int(year)
    ).first()
    
    if existing_budget:
        existing_budget.amount = amount
    else:
        new_budget = Budget(
            user_id=current_user_id,
            category=category,
            amount=amount,
            month=int(month),
            year=int(year)
        )
        db.session.add(new_budget)
    
    try:
        db.session.commit()
        return jsonify({'message': 'Budget updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500
