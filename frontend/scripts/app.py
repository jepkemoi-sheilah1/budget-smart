import os
from flask import Flask, jsonify
from extensions import db, bcrypt, jwt, cors
from models.models import User, Expense, Budget, PasswordReset
from routes.auth import auth_bp
from routes.user import user_bp
from routes.expense import expense_bp
from routes.budget import budget_bp
from routes.analytics import analytics_bp
from datetime import datetime

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
    app.config['JWT_SECRET_KEY'] = 'jwt-secret-string-change-in-production'
    
    # Database configuration - Create instance folder if it doesn't exist
    instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
    if not os.path.exists(instance_path):
        os.makedirs(instance_path)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(instance_path, "budget_smart.db")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(expense_bp, url_prefix='/api')
    app.register_blueprint(budget_bp, url_prefix='/api')
    app.register_blueprint(analytics_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Budget Smart API is running'
        })
    
    # Create tables and admin user
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("✅ Database tables created successfully")
            
            # Check if admin user exists
            admin_user = User.query.filter_by(email='admin@gmail.com').first()
            
            if not admin_user:
                # Create admin user
                admin_user = User(
                    username='admin',
                    email='admin@gmail.com'
                )
                admin_user.set_password('12345')
                
                db.session.add(admin_user)
                db.session.commit()
                print("✅ Admin user created: admin@gmail.com / 12345")
                
                # Add sample budgets
                current_date = datetime.now()
                sample_budgets = [
                    {'category': 'Housing', 'amount': 1500.00},
                    {'category': 'Food', 'amount': 600.00},
                    {'category': 'Transportation', 'amount': 400.00},
                    {'category': 'Entertainment', 'amount': 300.00},
                    {'category': 'Healthcare', 'amount': 200.00},
                    {'category': 'Shopping', 'amount': 250.00}
                ]
                
                for budget_data in sample_budgets:
                    budget = Budget(
                        user_id=admin_user.id,
                        category=budget_data['category'],
                        amount=budget_data['amount'],
                        month=current_date.month,
                        year=current_date.year
                    )
                    db.session.add(budget)
                
                # Add sample expenses
                sample_expenses = [
                    {'description': 'Monthly rent payment', 'amount': 1500.00, 'category': 'Housing', 'date': '2024-12-01'},
                    {'description': 'Grocery shopping at Walmart', 'amount': 120.50, 'category': 'Food', 'date': '2024-12-02'},
                    {'description': 'Gas station fill-up', 'amount': 55.00, 'category': 'Transportation', 'date': '2024-12-03'},
                    {'description': 'Netflix subscription', 'amount': 15.99, 'category': 'Entertainment', 'date': '2024-12-04'},
                    {'description': 'Dinner at Italian restaurant', 'amount': 85.00, 'category': 'Food', 'date': '2024-12-05'},
                    {'description': 'Uber ride to airport', 'amount': 35.00, 'category': 'Transportation', 'date': '2024-12-06'},
                    {'description': 'Movie tickets for two', 'amount': 28.00, 'category': 'Entertainment', 'date': '2024-12-07'},
                    {'description': 'Pharmacy prescription', 'amount': 45.00, 'category': 'Healthcare', 'date': '2024-12-08'},
                    {'description': 'Coffee shop', 'amount': 12.50, 'category': 'Food', 'date': '2024-12-09'},
                    {'description': 'Online shopping - clothes', 'amount': 89.99, 'category': 'Shopping', 'date': '2024-12-10'}
                ]
                
                for expense_data in sample_expenses:
                    expense = Expense(
                        user_id=admin_user.id,
                        description=expense_data['description'],
                        amount=expense_data['amount'],
                        category=expense_data['category'],
                        date=datetime.strptime(expense_data['date'], '%Y-%m-%d').date()
                    )
                    db.session.add(expense)
                
                db.session.commit()
                print("✅ Sample data created successfully")
            else:
                print("✅ Admin user already exists: admin@gmail.com / 12345")
                
        except Exception as e:
            print(f"❌ Database initialization error: {e}")
            db.session.rollback()
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting Budget Smart Backend Server")
    print(f"💾 Database: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print("🌐 Server running on: http://127.0.0.1:5000")
    print("📊 Health check: http://127.0.0.1:5000/api/health")
    print("🔐 Demo login: admin@gmail.com / 12345")
    app.run(debug=True, host='127.0.0.1', port=5000)
