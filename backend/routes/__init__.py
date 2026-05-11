
from flask import Blueprint, request, jsonify
from extensions import db
from models.models import User, Budget, Category, Expense
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return jsonify({}), 200

@routes_bp.route('/', methods=['OPTIONS'])
def handle_options_root():
    return jsonify({}), 200

@routes_bp.route('/', methods=['GET'])
def root():
    return jsonify({"message": "Welcome to the Budget Smart API"})

# ─── AUTH ────────────────────────────────────────────────────────────────────

@routes_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Username, email, and password are required.'}), 400

    existing_user = User.query.filter(
        (User.username == data['username']) | (User.email == data['email'])
    ).first()
    if existing_user:
        return jsonify({'error': 'Username or email already exists.'}), 400

    try:
        hashed_password = generate_password_hash(data['password'])
        user = User(username=data['username'], email=data['email'], password=hashed_password)
        db.session.add(user)
        db.session.commit()
        token = create_access_token(identity=str(user.id))
        return jsonify({
            'token': token,
            'user': {'id': user.id, 'username': user.username, 'email': user.email}
        }), 201
    except Exception as e:
        return jsonify({'error': 'Failed to create user'}), 500


@routes_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify({
            'token': token,
            'user': {'id': user.id, 'username': user.username, 'email': user.email}
        })
    return jsonify({'error': 'Invalid email or password.'}), 401


@routes_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'})


# ─── USERS ───────────────────────────────────────────────────────────────────

@routes_bp.route('/users/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email})


@routes_bp.route('/users/me', methods=['PUT'])
@jwt_required()
def update_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if data.get('password'):
        user.password = generate_password_hash(data['password'])
    db.session.commit()
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email})


@routes_bp.route('/users/me', methods=['DELETE'])
@jwt_required()
def delete_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})


# ─── BUDGETS ─────────────────────────────────────────────────────────────────

@routes_bp.route('/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    user_id = int(get_jwt_identity())
    budgets = Budget.query.filter_by(user_id=user_id).all()
    return jsonify([{'id': b.id, 'user_id': b.user_id, 'amount': b.amount, 'month': b.month} for b in budgets])


@routes_bp.route('/budgets/<int:budget_id>', methods=['GET'])
@jwt_required()
def get_budget(budget_id):
    user_id = int(get_jwt_identity())
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first_or_404()
    return jsonify({'id': budget.id, 'user_id': budget.user_id, 'amount': budget.amount, 'month': budget.month})


@routes_bp.route('/budgets', methods=['POST'])
@jwt_required()
def create_budget():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    budget = Budget(user_id=user_id, amount=data['amount'], month=data['month'])
    db.session.add(budget)
    db.session.commit()
    return jsonify({'id': budget.id, 'user_id': budget.user_id, 'amount': budget.amount, 'month': budget.month}), 201


@routes_bp.route('/budgets/<int:budget_id>', methods=['PUT'])
@jwt_required()
def update_budget(budget_id):
    user_id = int(get_jwt_identity())
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first_or_404()
    data = request.get_json()
    budget.amount = data.get('amount', budget.amount)
    budget.month = data.get('month', budget.month)
    db.session.commit()
    return jsonify({'id': budget.id, 'user_id': budget.user_id, 'amount': budget.amount, 'month': budget.month})


@routes_bp.route('/budgets/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    user_id = int(get_jwt_identity())
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first_or_404()
    db.session.delete(budget)
    db.session.commit()
    return jsonify({'message': 'Budget deleted'})


# ─── CATEGORIES ──────────────────────────────────────────────────────────────

@routes_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([{'id': c.id, 'name': c.name} for c in categories])


@routes_bp.route('/categories/<int:category_id>', methods=['GET'])
@jwt_required()
def get_category(category_id):
    category = Category.query.get_or_404(category_id)
    return jsonify({'id': category.id, 'name': category.name})


@routes_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    data = request.get_json()
    category = Category(name=data['name'])
    db.session.add(category)
    db.session.commit()
    return jsonify({'id': category.id, 'name': category.name}), 201


@routes_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    category.name = data.get('name', category.name)
    db.session.commit()
    return jsonify({'id': category.id, 'name': category.name})


@routes_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted'})


# ─── EXPENSES ────────────────────────────────────────────────────────────────

@routes_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = int(get_jwt_identity())
    month = request.args.get('month')  # optional filter e.g. ?month=2026-05
    query = Expense.query.filter_by(user_id=user_id)
    if month:
        query = query.filter(db.func.strftime('%Y-%m', Expense.date) == month)
    expenses = query.all()
    return jsonify([{
        'id': e.id,
        'user_id': e.user_id,
        'category_id': e.category_id,
        'amount': e.amount,
        'date': e.date.isoformat(),
        'description': e.description
    } for e in expenses])


@routes_bp.route('/expenses/<int:expense_id>', methods=['GET'])
@jwt_required()
def get_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first_or_404()
    return jsonify({
        'id': expense.id,
        'user_id': expense.user_id,
        'category_id': expense.category_id,
        'amount': expense.amount,
        'date': expense.date.isoformat(),
        'description': expense.description
    })


@routes_bp.route('/expenses', methods=['POST'])
@jwt_required()
def create_expense():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    required_fields = ['category_id', 'amount']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    date_str = data.get('date')
    date_obj = None
    if date_str:
        for fmt in ('%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y'):
            try:
                date_obj = datetime.strptime(date_str, fmt).date()
                break
            except ValueError:
                continue
        if not date_obj:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400
    else:
        date_obj = datetime.utcnow().date()

    expense = Expense(
        user_id=user_id,
        category_id=data['category_id'],
        amount=data['amount'],
        date=date_obj,
        description=data.get('description', '')
    )
    try:
        db.session.add(expense)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to save expense'}), 500

    return jsonify({
        'id': expense.id,
        'user_id': expense.user_id,
        'category_id': expense.category_id,
        'amount': expense.amount,
        'date': expense.date.isoformat(),
        'description': expense.description
    }), 201


@routes_bp.route('/expenses/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first_or_404()
    data = request.get_json()
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
@jwt_required()
def delete_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first_or_404()
    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted'})


# ─── DASHBOARD ───────────────────────────────────────────────────────────────

@routes_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = int(get_jwt_identity())
    month = request.args.get('month')  # e.g. ?month=2026-05

    budget_query = Budget.query.filter_by(user_id=user_id)
    expense_query = Expense.query.filter_by(user_id=user_id)

    if month:
        budget_query = budget_query.filter_by(month=month)
        expense_query = expense_query.filter(
            db.func.strftime('%Y-%m', Expense.date) == month
        )

    total_budget = sum(b.amount for b in budget_query.all())
    total_spent = sum(e.amount for e in expense_query.all())
    remaining = total_budget - total_spent

    return jsonify({
        'month': month or 'all',
        'total_budget': total_budget,
        'total_spent': total_spent,
        'remaining': remaining
    })