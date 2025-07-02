from flask import Blueprint, request, jsonify
from extensions import db
from models.models import User, Budget, Category, Expense
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/', methods=['GET'])
def root():
    return {"message": "Welcome to the Budget Smart API"}

# User routes
@routes_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'username': u.username, 'email': u.email} for u in users])

@routes_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email})

@routes_bp.route('/users', methods=['POST'])
def create_user():
    import logging
    logging.basicConfig(level=logging.DEBUG)
    data = request.get_json()
    logging.debug(f"Received user creation data: {data}")

    # Validate required fields
    if not data.get('username') or not data.get('email') or not data.get('password'):
        logging.error("Validation failed: Missing username, email, or password")
        return jsonify({'error': 'Username, email, and password are required.'}), 400

    # Check if username or email already exists
    existing_user = User.query.filter(
        (User.username == data['username']) | (User.email == data['email'])
    ).first()
    if existing_user:
        logging.error("Validation failed: Username or email already exists")
        return jsonify({'error': 'Username or email already exists.'}), 400

    try:
        hashed_password = generate_password_hash(data['password'])
        user = User(username=data['username'], email=data['email'], password=hashed_password)
        db.session.add(user)
        db.session.commit()
        logging.debug(f"User created with id: {user.id}")
        return jsonify({'id': user.id, 'username': user.username, 'email': user.email}), 201
    except Exception as e:
        import traceback
        logging.error(f"Error creating user: {e}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'Failed to create user'}), 500

@routes_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.password = data.get('password', user.password)
    db.session.commit()
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email})

@routes_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

# Login route
@routes_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login successful', 'user': {'id': user.id, 'username': user.username, 'email': user.email}})
    else:
        return jsonify({'error': 'Invalid email or password.'}), 401

# Budget routes
@routes_bp.route('/budgets', methods=['GET'])
def get_budgets():
    budgets = Budget.query.all()
    return jsonify([{'id': b.id, 'user_id': b.user_id, 'amount': b.amount, 'month': b.month} for b in budgets])

@routes_bp.route('/budgets/<int:budget_id>', methods=['GET'])
def get_budget(budget_id):
    budget = Budget.query.get_or_404(budget_id)
    return jsonify({'id': budget.id, 'user_id': budget.user_id, 'amount': budget.amount, 'month': budget.month})

@routes_bp.route('/budgets', methods=['POST'])
def create_budget():
    data = request.get_json()
    budget = Budget(user_id=data['user_id'], amount=data['amount'], month=data['month'])
    db.session.add(budget)
    db.session.commit()
    return jsonify({'id': budget.id, 'user_id': budget.user_id, 'amount': budget.amount, 'month': budget.month}), 201

@routes_bp.route('/budgets/<int:budget_id>', methods=['PUT'])
def update_budget(budget_id):
    budget = Budget.query.get_or_404(budget_id)
    data = request.get_json()
    budget.user_id = data.get('user_id', budget.user_id)
    budget.amount = data.get('amount', budget.amount)
    budget.month = data.get('month', budget.month)
    db.session.commit()
    return jsonify({'id': budget.id, 'user_id': budget.user_id, 'amount': budget.amount, 'month': budget.month})

@routes_bp.route('/budgets/<int:budget_id>', methods=['DELETE'])
def delete_budget(budget_id):
    budget = Budget.query.get_or_404(budget_id)
    db.session.delete(budget)
    db.session.commit()
    return jsonify({'message': 'Budget deleted'})

# Category routes
@routes_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{'id': c.id, 'name': c.name} for c in categories])

@routes_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get_or_404(category_id)
    return jsonify({'id': category.id, 'name': category.name})

@routes_bp.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    category = Category(name=data['name'])
    db.session.add(category)
    db.session.commit()
    return jsonify({'id': category.id, 'name': category.name}), 201

@routes_bp.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    category.name = data.get('name', category.name)
    db.session.commit()
    return jsonify({'id': category.id, 'name': category.name})

@routes_bp.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted'})

# Expense routes
@routes_bp.route('/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([{
        'id': e.id,
        'user_id': e.user_id,
        'category_id': e.category_id,
        'amount': e.amount,
        'date': e.date.isoformat(),
        'description': e.description
    } for e in expenses])

@routes_bp.route('/expenses/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    return jsonify({
        'id': expense.id,
        'user_id': expense.user_id,
        'category_id': expense.category_id,
        'amount': expense.amount,
        'date': expense.date.isoformat(),
        'description': expense.description
    })

@routes_bp.route('/expenses', methods=['POST'])
def create_expense():
    data = request.get_json()
    date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date() if 'date' in data else datetime.utcnow().date()
    expense = Expense(
        user_id=data['user_id'],
        category_id=data['category_id'],
        amount=data['amount'],
        date=date_obj,
        description=data.get('description', '')
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify({
        'id': expense.id,
        'user_id': expense.user_id,
        'category_id': expense.category_id,
        'amount': expense.amount,
        'date': expense.date.isoformat(),
        'description': expense.description
    }), 201

@routes_bp.route('/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    data = request.get_json()
    expense.user_id = data.get('user_id', expense.user_id)
    expense.category_id = data.get('category_id', expense.category_id)
    expense.amount = data.get('amount', expense.amount)
    if 'date' in data:
        expense.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    expense.description = data.get('description', expense.description)
    db.session.commit()
    return jsonify({
        'id': expense.id,
        'user_id': expense.user_id,
        'category_id': expense.category_id,
        'amount': expense.amount,
        'date': expense.date.isoformat(),
        'description': expense.description
    })

@routes_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted'})

@routes_bp.route('/logout', methods=['POST'])
def logout():
    # For stateless JWT or token-based auth, logout is handled client-side by deleting token
    # For session-based auth, clear the session here
    # Assuming session-based auth for example:
    from flask import session
    session.clear()
    return jsonify({'message': 'Logged out successfully'})
