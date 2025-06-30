from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Expense, Budget
from extensions import db
from datetime import datetime, date
from sqlalchemy import func, extract

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        month = request.args.get('month', type=int, default=date.today().month)
        year = request.args.get('year', type=int, default=date.today().year)
        
        # Get total expenses for the month
        total_expenses = db.session.query(func.sum(Expense.amount)).filter(
            Expense.user_id == current_user_id,
            extract('month', Expense.date) == month,
            extract('year', Expense.date) == year
        ).scalar() or 0
        
        # Get total budget for the month
        total_budget = db.session.query(func.sum(Budget.amount)).filter(
            Budget.user_id == current_user_id,
            Budget.month == month,
            Budget.year == year
        ).scalar() or 0
        
        # Get expenses by category
        expenses_by_category = db.session.query(
            Expense.category,
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.user_id == current_user_id,
            extract('month', Expense.date) == month,
            extract('year', Expense.date) == year
        ).group_by(Expense.category).all()
        
        # Get budget vs expenses by category
        budget_vs_expenses = []
        budgets = Budget.query.filter_by(
            user_id=current_user_id,
            month=month,
            year=year
        ).all()
        
        for budget in budgets:
            category_expenses = db.session.query(func.sum(Expense.amount)).filter(
                Expense.user_id == current_user_id,
                Expense.category == budget.category,
                extract('month', Expense.date) == month,
                extract('year', Expense.date) == year
            ).scalar() or 0
            
            budget_vs_expenses.append({
                'category': budget.category,
                'budget': budget.amount,
                'spent': category_expenses,
                'remaining': budget.amount - category_expenses
            })
        
        return jsonify({
            'summary': {
                'total_expenses': total_expenses,
                'total_budget': total_budget,
                'remaining_budget': total_budget - total_expenses,
                'month': month,
                'year': year
            },
            'expenses_by_category': [
                {'category': cat, 'amount': float(amount)} 
                for cat, amount in expenses_by_category
            ],
            'budget_vs_expenses': budget_vs_expenses
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/trends', methods=['GET'])
@jwt_required()
def get_trends():
    try:
        current_user_id = get_jwt_identity()
        
        # Get monthly expenses for the last 12 months
        monthly_expenses = db.session.query(
            extract('year', Expense.date).label('year'),
            extract('month', Expense.date).label('month'),
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.user_id == current_user_id
        ).group_by(
            extract('year', Expense.date),
            extract('month', Expense.date)
        ).order_by(
            extract('year', Expense.date),
            extract('month', Expense.date)
        ).limit(12).all()
        
        # Get category trends
        category_trends = db.session.query(
            Expense.category,
            extract('year', Expense.date).label('year'),
            extract('month', Expense.date).label('month'),
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.user_id == current_user_id
        ).group_by(
            Expense.category,
            extract('year', Expense.date),
            extract('month', Expense.date)
        ).order_by(
            extract('year', Expense.date),
            extract('month', Expense.date)
        ).all()
        
        return jsonify({
            'monthly_expenses': [
                {
                    'year': int(year),
                    'month': int(month),
                    'total': float(total)
                }
                for year, month, total in monthly_expenses
            ],
            'category_trends': [
                {
                    'category': category,
                    'year': int(year),
                    'month': int(month),
                    'total': float(total)
                }
                for category, year, month, total in category_trends
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500