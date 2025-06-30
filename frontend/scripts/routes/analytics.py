from flask import Blueprint, request, jsonify
import datetime
from sqlalchemy import func, extract

from extensions import db
from models.models import Budget, Expense
from routes.auth import token_required

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/summary', methods=['GET'])
@token_required
def get_summary(current_user_id):
    month = request.args.get('month', datetime.datetime.now().month)
    year = request.args.get('year', datetime.datetime.now().year)
    
    # Get total budget
    total_budget = db.session.query(func.sum(Budget.amount)).filter_by(
        user_id=current_user_id,
        month=int(month),
        year=int(year)
    ).scalar() or 0
    
    # Get total expenses for the month
    total_spent = db.session.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user_id,
        extract('month', Expense.date) == int(month),
        extract('year', Expense.date) == int(year)
    ).scalar() or 0
    
    # Get expenses by category
    category_expenses = db.session.query(
        Expense.category,
        func.sum(Expense.amount).label('total')
    ).filter(
        Expense.user_id == current_user_id,
        extract('month', Expense.date) == int(month),
        extract('year', Expense.date) == int(year)
    ).group_by(Expense.category).all()
    
    category_data = {}
    for category, total in category_expenses:
        category_data[category] = float(total)
    
    return jsonify({
        'total_budget': float(total_budget),
        'total_spent': float(total_spent),
        'remaining': float(total_budget - total_spent),
        'category_expenses': category_data
    }), 200
