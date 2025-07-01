from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Expense, Budget
from extensions import db
from datetime import datetime, date
from sqlalchemy import func, extract

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/summary', methods=['GET'])
@jwt_required()
def get_summary():
    try:
        user_id = get_jwt_identity()
        
        # Get query parameters
        month = request.args.get('month', type=int, default=datetime.now().month)
        year = request.args.get('year', type=int, default=datetime.now().year)
        
        # Get total expenses for the month
        total_expenses = db.session.query(func.sum(Expense.amount)).filter(
            Expense.user_id == user_id,
            extract('month', Expense.date) == month,
            extract('year', Expense.date) == year
        ).scalar() or 0
        
        # Get total budget for the month
        total_budget = db.session.query(func.sum(Budget.amount)).filter(
            Budget.user_id == user_id,
            Budget.month == month,
            Budget.year == year
        ).scalar() or 0
        
        # Get expense count
        expense_count = db.session.query(func.count(Expense.id)).filter(
            Expense.user_id == user_id,
            extract('month', Expense.date) == month,
            extract('year', Expense.date) == year
        ).scalar() or 0
        
        # Get category breakdown
        category_expenses = db.session.query(
            Expense.category,
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.user_id == user_id,
            extract('month', Expense.date) == month,
            extract('year', Expense.date) == year
        ).group_by(Expense.category).all()
        
        category_breakdown = [
            {'category': category, 'amount': float(total)}
            for category, total in category_expenses
        ]
        
        # Calculate remaining budget
        remaining_budget = total_budget - total_expenses
        
        return jsonify({
            'month': month,
            'year': year,
            'total_expenses': float(total_expenses),
            'total_budget': float(total_budget),
            'remaining_budget': float(remaining_budget),
            'expense_count': expense_count,
            'category_breakdown': category_breakdown
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get analytics summary'}), 500

@analytics_bp.route('/analytics/monthly', methods=['GET'])
@jwt_required()
def get_monthly_analytics():
    try:
        user_id = get_jwt_identity()
        year = request.args.get('year', type=int, default=datetime.now().year)
        
        # Get monthly expenses for the year
        monthly_expenses = db.session.query(
            extract('month', Expense.date).label('month'),
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.user_id == user_id,
            extract('year', Expense.date) == year
        ).group_by(extract('month', Expense.date)).all()
        
        # Get monthly budgets for the year
        monthly_budgets = db.session.query(
            Budget.month,
            func.sum(Budget.amount).label('total')
        ).filter(
            Budget.user_id == user_id,
            Budget.year == year
        ).group_by(Budget.month).all()
        
        # Create monthly data
        monthly_data = []
        for month in range(1, 13):
            expense_total = 0
            budget_total = 0
            
            for exp_month, exp_total in monthly_expenses:
                if exp_month == month:
                    expense_total = float(exp_total)
                    break
            
            for bud_month, bud_total in monthly_budgets:
                if bud_month == month:
                    budget_total = float(bud_total)
                    break
            
            monthly_data.append({
                'month': month,
                'expenses': expense_total,
                'budget': budget_total,
                'remaining': budget_total - expense_total
            })
        
        return jsonify({
            'year': year,
            'monthly_data': monthly_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get monthly analytics'}), 500

@analytics_bp.route('/analytics/budget-vs-actual', methods=['GET'])
@jwt_required()
def get_budget_vs_actual():
    try:
        user_id = get_jwt_identity()
        
        # Get query parameters
        month = request.args.get('month', type=int, default=datetime.now().month)
        year = request.args.get('year', type=int, default=datetime.now().year)
        
        # Get budgets for the month
        budgets = Budget.query.filter_by(
            user_id=user_id,
            month=month,
            year=year
        ).all()
        
        # Get actual expenses by category for the month
        category_expenses = db.session.query(
            Expense.category,
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.user_id == user_id,
            extract('month', Expense.date) == month,
            extract('year', Expense.date) == year
        ).group_by(Expense.category).all()
        
        # Create expense dictionary
        expense_dict = {category: float(total) for category, total in category_expenses}
        
        # Create comparison data
        comparison_data = []
        for budget in budgets:
            actual_amount = expense_dict.get(budget.category, 0)
            comparison_data.append({
                'category': budget.category,
                'budget': float(budget.amount),
                'actual': actual_amount,
                'difference': float(budget.amount) - actual_amount,
                'percentage': (actual_amount / float(budget.amount) * 100) if budget.amount > 0 else 0
            })
        
        # Add categories with expenses but no budget
        for category, amount in expense_dict.items():
            if not any(item['category'] == category for item in comparison_data):
                comparison_data.append({
                    'category': category,
                    'budget': 0,
                    'actual': amount,
                    'difference': -amount,
                    'percentage': 0
                })
        
        return jsonify({
            'month': month,
            'year': year,
            'comparison': comparison_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get budget vs actual'}), 500
