from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.models import User, PasswordReset
from extensions import db
import secrets
from datetime import datetime, timedelta
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed. Please try again.'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not username or len(username) < 3:
            return jsonify({'error': 'Username must be at least 3 characters long'}), 400
        
        if not email or not validate_email(email):
            return jsonify({'error': 'Please provide a valid email address'}), 400
        
        if not password or len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed. Please try again.'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if user:
            # Generate reset token
            token = secrets.token_urlsafe(32)
            expires_at = datetime.utcnow() + timedelta(hours=1)
            
            # Delete any existing reset tokens for this user
            PasswordReset.query.filter_by(user_id=user.id).delete()
            
            # Create new reset token
            reset_token = PasswordReset(
                user_id=user.id,
                token=token,
                expires_at=expires_at
            )
            
            db.session.add(reset_token)
            db.session.commit()
            
            # In a real app, you would send an email here
            return jsonify({
                'message': 'Password reset token generated',
                'reset_token': token  # Don't return this in production
            }), 200
        else:
            # Don't reveal if email exists or not
            return jsonify({'message': 'If an account with that email exists, a password reset link has been sent.'}), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to process request'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('password')
        
        if not token or not new_password:
            return jsonify({'error': 'Token and new password are required'}), 400
        
        if len(new_password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Find valid reset token
        reset_token = PasswordReset.query.filter_by(token=token).first()
        
        if not reset_token or reset_token.expires_at < datetime.utcnow():
            return jsonify({'error': 'Invalid or expired reset token'}), 400
        
        # Update user password
        user = User.query.get(reset_token.user_id)
        user.set_password(new_password)
        
        # Delete the used reset token
        db.session.delete(reset_token)
        db.session.commit()
        
        return jsonify({'message': 'Password reset successful'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to reset password'}), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user:
            return jsonify({
                'valid': True,
                'user': user.to_dict()
            }), 200
        else:
            return jsonify({'valid': False}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get user information'}), 500
