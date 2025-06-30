from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import secrets

from extensions import db
from models.models import User, PasswordReset

auth_bp = Blueprint('auth', __name__)

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, 'your-secret-key-here', algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, 'your-secret-key-here', algorithms=['HS256'])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    username = data['username']
    email = data['email']
    password = data['password']
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
    
    # Check if user already exists
    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()
    
    if existing_user:
        return jsonify({'error': 'Username or email already exists'}), 400
    
    # Create new user
    password_hash = generate_password_hash(password)
    
    try:
        new_user = User(
            username=username,
            email=email,
            password=password_hash
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    email = data['email']
    password = data['password']
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = generate_token(user.id)
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400
    
    email = data['email']
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Don't reveal if email exists or not for security
        return jsonify({'message': 'If the email exists, reset instructions have been sent'}), 200
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    
    # Store reset token in database
    password_reset = PasswordReset(
        user_id=user.id,
        token=reset_token,
        expires_at=expires_at
    )
    
    # Remove any existing reset tokens for this user
    PasswordReset.query.filter_by(user_id=user.id).delete()
    
    db.session.add(password_reset)
    db.session.commit()
    
    # In production, send actual email here
    print(f"Password reset token for {email}: {reset_token}")
    print(f"Reset URL: http://localhost:3000/reset-password?token={reset_token}")
    
    return jsonify({'message': 'Password reset instructions sent'}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if not data or not data.get('token') or not data.get('password'):
        return jsonify({'error': 'Token and password are required'}), 400
    
    token = data['token']
    new_password = data['password']
    
    if len(new_password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
    
    # Find valid reset token
    reset_record = PasswordReset.query.filter(
        PasswordReset.token == token,
        PasswordReset.expires_at > datetime.datetime.utcnow()
    ).first()
    
    if not reset_record:
        return jsonify({'error': 'Invalid or expired reset token'}), 400
    
    # Update password
    user = User.query.get(reset_record.user_id)
    user.password = generate_password_hash(new_password)
    
    # Delete used reset token
    db.session.delete(reset_record)
    db.session.commit()
    
    return jsonify({'message': 'Password reset successfully'}), 200
