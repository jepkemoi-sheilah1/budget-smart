from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import json
import datetime

from extensions import db
from models.models import User, Budget, Expense
from routes.auth import token_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user_id):
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@user_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user_id):
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    user = User.query.get(current_user_id)
    
    if data.get('username'):
        # Check if username is already taken
        existing = User.query.filter(
            User.username == data['username'],
            User.id != current_user_id
        ).first()
        
        if existing:
            return jsonify({'error': 'Username already taken'}), 400
        
        user.username = data['username']
    
    if data.get('email'):
        # Check if email is already taken
        existing = User.query.filter(
            User.email == data['email'],
            User.id != current_user_id
        ).first()
        
        if existing:
            return jsonify({'error': 'Email already taken'}), 400
        
        user.email = data['email']
    
    try:
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500

@user_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user_id):
    data = request.get_json()
    
    if not data or not data.get('currentPassword') or not data.get('newPassword'):
        return jsonify({'error': 'Current and new passwords are required'}), 400
    
    current_password = data['currentPassword']
    new_password = data['newPassword']
    
    if len(new_password) < 6:
        return jsonify({'error': 'New password must be at least 6 characters long'}), 400
    
    user = User.query.get(current_user_id)
    
    if not check_password_hash(user.password, current_password):
        return jsonify({'error': 'Current password is incorrect'}), 400
    
    # Update password
    user.password = generate_password_hash(new_password)
    
    try:
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500

@user_bp.route('/export-data', methods=['GET'])
@token_required
def export_data(current_user_id):
    user = User.query.get(current_user_id)
    
    # Get user data
    user_data = user.to_dict()
    
    # Get expenses
    expenses = Expense.query.filter_by(user_id=current_user_id).all()
    expenses_data = [expense.to_dict() for expense in expenses]
    
    # Get budgets
    budgets = Budget.query.filter_by(user_id=current_user_id).all()
    budgets_data = [budget.to_dict() for budget in budgets]
    
    # Prepare export data
    export_data = {
        'user': user_data,
        'expenses': expenses_data,
        'budgets': budgets_data,
        'exported_at': datetime.datetime.utcnow().isoformat()
    }
    
    response = jsonify(export_data)
    response.headers['Content-Disposition'] = 'attachment; filename=budget-smart-data.json'
    return response, 200

@user_bp.route('/delete-account', methods=['DELETE'])
@token_required
def delete_account(current_user_id):
    user = User.query.get(current_user_id)
    
    try:
        # Delete user (cascading will handle related records)
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'Account deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500
