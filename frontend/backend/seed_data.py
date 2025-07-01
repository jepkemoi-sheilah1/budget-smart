from app import create_app
from extensions import db
from models.models import User, Budget, Category, Expense
from werkzeug.security import generate_password_hash
from datetime import date
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def seed_data():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create categories
        categories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping']
        for cat_name in categories:
            category = Category(name=cat_name)
            db.session.add(category)
        
        db.session.commit()
        
        # Create admin user
        admin_user = User(
            username='admin',
            email='admin@gmail.com',
            password=generate_password_hash('12345')
        )
        
        # Create additional users
        user1 = User(
            username='jepkemoi shyllah',
            email='jepkemoishyllah@example.com',
            password=generate_password_hash('password1')
        )
        
        user2 = User(
            username='collins kiptoo',
            email='collinskiptoo@example.com',
            password=generate_password_hash('password2')
        )
        
        db.session.add_all([admin_user, user1, user2])
        db.session.commit()
        
        # Create budgets for admin user
        admin_budgets = [
            Budget(user_id=admin_user.id, category='Housing', amount=1500.0, month=12, year=2024),
            Budget(user_id=admin_user.id, category='Food', amount=600.0, month=12, year=2024),
            Budget(user_id=admin_user.id, category='Transportation', amount=400.0, month=12, year=2024),
            Budget(user_id=admin_user.id, category='Entertainment', amount=300.0, month=12, year=2024),
            Budget(user_id=admin_user.id, category='Healthcare', amount=200.0, month=12, year=2024),
            Budget(user_id=admin_user.id, category='Shopping', amount=250.0, month=12, year=2024),
        ]
        
        # Create budgets for other users
        user1_budget = Budget(user_id=user1.id, category='Food', amount=1000.0, month=12, year=2024)
        user2_budget = Budget(user_id=user2.id, category='Entertainment', amount=1500.0, month=12, year=2024)
        
        db.session.add_all(admin_budgets + [user1_budget, user2_budget])
        db.session.commit()
        
        # Create expenses for admin user
        admin_expenses = [
            Expense(user_id=admin_user.id, category='Housing', amount=1500.00, date=date(2024, 12, 1), description='Monthly rent payment'),
            Expense(user_id=admin_user.id, category='Food', amount=120.50, date=date(2024, 12, 2), description='Grocery shopping at Walmart'),
            Expense(user_id=admin_user.id, category='Transportation', amount=55.00, date=date(2024, 12, 3), description='Gas station fill-up'),
            Expense(user_id=admin_user.id, category='Entertainment', amount=15.99, date=date(2024, 12, 4), description='Netflix subscription'),
            Expense(user_id=admin_user.id, category='Food', amount=85.00, date=date(2024, 12, 5), description='Dinner at Italian restaurant'),
            Expense(user_id=admin_user.id, category='Transportation', amount=35.00, date=date(2024, 12, 6), description='Uber ride to airport'),
            Expense(user_id=admin_user.id, category='Entertainment', amount=28.00, date=date(2024, 12, 7), description='Movie tickets for two'),
            Expense(user_id=admin_user.id, category='Healthcare', amount=45.00, date=date(2024, 12, 8), description='Pharmacy prescription'),
            Expense(user_id=admin_user.id, category='Food', amount=12.50, date=date(2024, 12, 9), description='Coffee shop'),
            Expense(user_id=admin_user.id, category='Shopping', amount=89.99, date=date(2024, 12, 10), description='Online shopping - clothes'),
            Expense(user_id=admin_user.id, category='Housing', amount=125.00, date=date(2024, 12, 11), description='Electricity bill'),
            Expense(user_id=admin_user.id, category='Food', amount=32.00, date=date(2024, 12, 12), description='Lunch with colleagues'),
            Expense(user_id=admin_user.id, category='Entertainment', amount=9.99, date=date(2024, 12, 13), description='Spotify premium'),
            Expense(user_id=admin_user.id, category='Transportation', amount=150.00, date=date(2024, 12, 14), description='Car maintenance'),
            Expense(user_id=admin_user.id, category='Food', amount=95.75, date=date(2024, 12, 15), description='Grocery shopping'),
        ]
        
        # Create expenses for other users
        user1_expenses = [
            Expense(user_id=user1.id, category='Food', amount=50.0, date=date(2024, 12, 1), description='Groceries'),
            Expense(user_id=user1.id, category='Transportation', amount=20.0, date=date(2024, 12, 2), description='Bus ticket'),
        ]
        
        user2_expense = Expense(user_id=user2.id, category='Entertainment', amount=100.0, date=date(2024, 12, 3), description='Concert ticket')
        
        db.session.add_all(admin_expenses + user1_expenses + [user2_expense])
        db.session.commit()
        
        print("Database seeded successfully!")
        print("Admin credentials:")
        print("Email: admin@gmail.com")
        print("Password: 12345")

if __name__ == '__main__':
    seed_data()
