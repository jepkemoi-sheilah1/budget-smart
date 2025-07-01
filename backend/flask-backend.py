from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import jwt
import datetime
from functools import wraps
import os
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production
DATABASE = 'budget_smart.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    
    # Create users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create budgets table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            month INTEGER NOT NULL,
            year INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, category, month, year)
        )
    ''')
    
    # Create expenses table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create password_resets table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, password_hash):
    return hashlib.sha256(password.encode()).hexdigest() == password_hash

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    username = data['username']
    email = data['email']
    password = data['password']
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
    
    conn = get_db_connection()
    
    # Check if user already exists
    existing_user = conn.execute(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        (username, email)
    ).fetchone()
    
    if existing_user:
        conn.close()
        return jsonify({'error': 'Username or email already exists'}), 400
    
    # Create new user
    password_hash = hash_password(password)
    
    try:
        conn.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            (username, email, password_hash)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'User created successfully'}), 201
    except sqlite3.Error as e:
        conn.close()
        return jsonify({'error': 'Database error'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    email = data['email']
    password = data['password']
    
    conn = get_db_connection()
    user = conn.execute(
        'SELECT id, username, password_hash FROM users WHERE email = ?',
        (email,)
    ).fetchone()
    conn.close()
    
    if not user or not verify_password(password, user['password_hash']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = generate_token(user['id'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': email
        }
    }), 200

# Password Reset Routes
@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400
    
    email = data['email']
    
    conn = get_db_connection()
    user = conn.execute(
        'SELECT id, username FROM users WHERE email = ?',
        (email,)
    ).fetchone()
    
    if not user:
        # Don't reveal if email exists or not for security
        return jsonify({'message': 'If the email exists, reset instructions have been sent'}), 200
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    
    # Store reset token in database
    conn.execute('''
        INSERT OR REPLACE INTO password_resets (user_id, token, expires_at)
        VALUES (?, ?, ?)
    ''', (user['id'], reset_token, expires_at))
    conn.commit()
    conn.close()
    
    # In production, send actual email here
    # For demo purposes, we'll just return success
    print(f"Password reset token for {email}: {reset_token}")
    print(f"Reset URL: http://localhost:3000/reset-password?token={reset_token}")
    
    return jsonify({'message': 'Password reset instructions sent'}), 200

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if not data or not data.get('token') or not data.get('password'):
        return jsonify({'error': 'Token and password are required'}), 400
    
    token = data['token']
    new_password = data['password']
    
    if len(new_password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
    
    conn = get_db_connection()
    
    # Find valid reset token
    reset_record = conn.execute('''
        SELECT pr.user_id, pr.expires_at 
        FROM password_resets pr
        WHERE pr.token = ? AND pr.expires_at > datetime('now')
    ''', (token,)).fetchone()
    
    if not reset_record:
        conn.close()
        return jsonify({'error': 'Invalid or expired reset token'}), 400
    
    # Update password
    password_hash = hash_password(new_password)
    conn.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        (password_hash, reset_record['user_id'])
    )
    
    # Delete used reset token
    conn.execute('DELETE FROM password_resets WHERE token = ?', (token,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Password reset successfully'}), 200

# User Profile Routes
@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_profile(current_user_id):
    conn = get_db_connection()
    user = conn.execute(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        (current_user_id,)
    ).fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'created_at': user['created_at']
    }), 200

@app.route('/api/user/profile', methods=['PUT'])
@token_required
def update_profile(current_user_id):
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    conn = get_db_connection()
    
    update_fields = []
    params = []
    
    if data.get('username'):
        # Check if username is already taken
        existing = conn.execute(
            'SELECT id FROM users WHERE username = ? AND id != ?',
            (data['username'], current_user_id)
        ).fetchone()
        
        if existing:
            conn.close()
            return jsonify({'error': 'Username already taken'}), 400
        
        update_fields.append('username = ?')
        params.append(data['username'])
    
    if data.get('email'):
        # Check if email is already taken
        existing = conn.execute(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            (data['email'], current_user_id)
        ).fetchone()
        
        if existing:
            conn.close()
            return jsonify({'error': 'Email already taken'}), 400
        
        update_fields.append('email = ?')
        params.append(data['email'])
    
    if update_fields:
        query = f'UPDATE users SET {", ".join(update_fields)} WHERE id = ?'
        params.append(current_user_id)
        
        conn.execute(query, params)
        conn.commit()
    
    conn.close()
    
    return jsonify({'message': 'Profile updated successfully'}), 200

@app.route('/api/user/change-password', methods=['POST'])
@token_required
def change_password(current_user_id):
    data = request.get_json()
    
    if not data or not data.get('currentPassword') or not data.get('newPassword'):
        return jsonify({'error': 'Current and new passwords are required'}), 400
    
    current_password = data['currentPassword']
    new_password = data['newPassword']
    
    if len(new_password) < 6:
        return jsonify({'error': 'New password must be at least 6 characters long'}), 400
    
    conn = get_db_connection()
    user = conn.execute(
        'SELECT password_hash FROM users WHERE id = ?',
        (current_user_id,)
    ).fetchone()
    
    if not user or not verify_password(current_password, user['password_hash']):
        conn.close()
        return jsonify({'error': 'Current password is incorrect'}), 400
    
    # Update password
    new_password_hash = hash_password(new_password)
    conn.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        (new_password_hash, current_user_id)
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Password changed successfully'}), 200

@app.route('/api/user/export-data', methods=['GET'])
@token_required
def export_data(current_user_id):
    conn = get_db_connection()
    
    # Get user data
    user = conn.execute(
        'SELECT username, email, created_at FROM users WHERE id = ?',
        (current_user_id,)
    ).fetchone()
    
    # Get expenses
    expenses = conn.execute(
        'SELECT description, amount, category, date, created_at FROM expenses WHERE user_id = ?',
        (current_user_id,)
    ).fetchall()
    
    # Get budgets
    budgets = conn.execute(
        'SELECT category, amount, month, year, created_at FROM budgets WHERE user_id = ?',
        (current_user_id,)
    ).fetchall()
    
    conn.close()
    
    # Prepare export data
    export_data = {
        'user': dict(user) if user else {},
        'expenses': [dict(expense) for expense in expenses],
        'budgets': [dict(budget) for budget in budgets],
        'exported_at': datetime.datetime.utcnow().isoformat()
    }
    
    return jsonify(export_data), 200

@app.route('/api/user/delete-account', methods=['DELETE'])
@token_required
def delete_account(current_user_id):
    conn = get_db_connection()
    
    # Delete all user data
    conn.execute('DELETE FROM expenses WHERE user_id = ?', (current_user_id,))
    conn.execute('DELETE FROM budgets WHERE user_id = ?', (current_user_id,))
    conn.execute('DELETE FROM password_resets WHERE user_id = ?', (current_user_id,))
    conn.execute('DELETE FROM users WHERE id = ?', (current_user_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Account deleted successfully'}), 200

# Budget Routes
@app.route('/api/budgets', methods=['GET'])
@token_required
def get_budgets(current_user_id):
    month = request.args.get('month', datetime.datetime.now().month)
    year = request.args.get('year', datetime.datetime.now().year)
    
    conn = get_db_connection()
    budgets = conn.execute(
        'SELECT category, amount FROM budgets WHERE user_id = ? AND month = ? AND year = ?',
        (current_user_id, month, year)
    ).fetchall()
    conn.close()
    
    budget_dict = {}
    for budget in budgets:
        budget_dict[budget['category']] = budget['amount']
    
    return jsonify(budget_dict), 200

@app.route('/api/budgets', methods=['POST'])
@token_required
def set_budget(current_user_id):
    data = request.get_json()
    
    if not data or not data.get('category') or not data.get('amount'):
        return jsonify({'error': 'Missing category or amount'}), 400
    
    category = data['category']
    amount = float(data['amount'])
    month = data.get('month', datetime.datetime.now().month)
    year = data.get('year', datetime.datetime.now().year)
    
    conn = get_db_connection()
    
    # Insert or update budget
    conn.execute('''
        INSERT OR REPLACE INTO budgets (user_id, category, amount, month, year)
        VALUES (?, ?, ?, ?, ?)
    ''', (current_user_id, category, amount, month, year))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Budget updated successfully'}), 200

# Expense Routes
@app.route('/api/expenses', methods=['GET'])
@token_required
def get_expenses(current_user_id):
    category = request.args.get('category')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = 'SELECT * FROM expenses WHERE user_id = ?'
    params = [current_user_id]
    
    if category and category != 'All':
        query += ' AND category = ?'
        params.append(category)
    
    if start_date:
        query += ' AND date >= ?'
        params.append(start_date)
    
    if end_date:
        query += ' AND date <= ?'
        params.append(end_date)
    
    query += ' ORDER BY date DESC'
    
    conn = get_db_connection()
    expenses = conn.execute(query, params).fetchall()
    conn.close()
    
    expense_list = []
    for expense in expenses:
        expense_list.append({
            'id': expense['id'],
            'description': expense['description'],
            'amount': expense['amount'],
            'category': expense['category'],
            'date': expense['date']
        })
    
    return jsonify(expense_list), 200

@app.route('/api/expenses', methods=['POST'])
@token_required
def add_expense(current_user_id):
    data = request.get_json()
    
    if not data or not data.get('description') or not data.get('amount') or not data.get('category'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    description = data['description']
    amount = float(data['amount'])
    category = data['category']
    date = data.get('date', datetime.datetime.now().strftime('%Y-%m-%d'))
    
    conn = get_db_connection()
    cursor = conn.execute(
        'INSERT INTO expenses (user_id, description, amount, category, date) VALUES (?, ?, ?, ?, ?)',
        (current_user_id, description, amount, category, date)
    )
    expense_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': expense_id,
        'description': description,
        'amount': amount,
        'category': category,
        'date': date
    }), 201

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
@token_required
def update_expense(current_user_id, expense_id):
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    conn = get_db_connection()
    
    # Check if expense belongs to user
    expense = conn.execute(
        'SELECT id FROM expenses WHERE id = ? AND user_id = ?',
        (expense_id, current_user_id)
    ).fetchone()
    
    if not expense:
        conn.close()
        return jsonify({'error': 'Expense not found'}), 404
    
    # Update expense
    description = data.get('description')
    amount = data.get('amount')
    category = data.get('category')
    date = data.get('date')
    
    update_fields = []
    params = []
    
    if description:
        update_fields.append('description = ?')
        params.append(description)
    
    if amount is not None:
        update_fields.append('amount = ?')
        params.append(float(amount))
    
    if category:
        update_fields.append('category = ?')
        params.append(category)
    
    if date:
        update_fields.append('date = ?')
        params.append(date)
    
    if update_fields:
        query = f'UPDATE expenses SET {", ".join(update_fields)} WHERE id = ? AND user_id = ?'
        params.extend([expense_id, current_user_id])
        
        conn.execute(query, params)
        conn.commit()
    
    conn.close()
    
    return jsonify({'message': 'Expense updated successfully'}), 200

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
@token_required
def delete_expense(current_user_id, expense_id):
    conn = get_db_connection()
    
    # Check if expense belongs to user and delete
    result = conn.execute(
        'DELETE FROM expenses WHERE id = ? AND user_id = ?',
        (expense_id, current_user_id)
    )
    
    conn.commit()
    conn.close()
    
    if result.rowcount == 0:
        return jsonify({'error': 'Expense not found'}), 404
    
    return jsonify({'message': 'Expense deleted successfully'}), 200

# Analytics Routes
@app.route('/api/analytics/summary', methods=['GET'])
@token_required
def get_summary(current_user_id):
    month = request.args.get('month', datetime.datetime.now().month)
    year = request.args.get('year', datetime.datetime.now().year)
    
    conn = get_db_connection()
    
    # Get total budget
    budgets = conn.execute(
        'SELECT SUM(amount) as total_budget FROM budgets WHERE user_id = ? AND month = ? AND year = ?',
        (current_user_id, month, year)
    ).fetchone()
    
    # Get total expenses for the month
    expenses = conn.execute(
        'SELECT SUM(amount) as total_spent FROM expenses WHERE user_id = ? AND strftime("%m", date) = ? AND strftime("%Y", date) = ?',
        (current_user_id, f"{month:02d}", str(year))
    ).fetchone()
    
    # Get expenses by category
    category_expenses = conn.execute(
        'SELECT category, SUM(amount) as total FROM expenses WHERE user_id = ? AND strftime("%m", date) = ? AND strftime("%Y", date) = ? GROUP BY category',
        (current_user_id, f"{month:02d}", str(year))
    ).fetchall()
    
    conn.close()
    
    total_budget = budgets['total_budget'] or 0
    total_spent = expenses['total_spent'] or 0
    
    category_data = {}
    for row in category_expenses:
        category_data[row['category']] = row['total']
    
    return jsonify({
        'total_budget': total_budget,
        'total_spent': total_spent,
        'remaining': total_budget - total_spent,
        'category_expenses': category_data
    }), 200

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
