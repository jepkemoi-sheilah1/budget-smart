import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models.models import User, Budget, Category, Expense
from datetime import date

def seed_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Create users
        user1 = User(username='jepkemoi shyllah', email='jepkemoishyllah@example.com', password='password1')
        user2 = User(username='collins kiptoo', email='collinskiptoo@example.com', password='password2')

        db.session.add_all([user1, user2])
        db.session.commit()

        # Create categories
        cat_food = Category(name='Food')
        cat_transport = Category(name='Transport')
        cat_entertainment = Category(name='Entertainment')

        db.session.add_all([cat_food, cat_transport, cat_entertainment])
        db.session.commit()

        # Create budgets
        budget1 = Budget(user_id=user1.id, amount=1000.0, month='2024-06')
        budget2 = Budget(user_id=user2.id, amount=1500.0, month='2024-06')

        db.session.add_all([budget1, budget2])
        db.session.commit()

        # Create expenses
        expense1 = Expense(user_id=user1.id, category_id=cat_food.id, amount=50.0, date=date(2024,6,1), description='Groceries')
        expense2 = Expense(user_id=user1.id, category_id=cat_transport.id, amount=20.0, date=date(2024,6,2), description='Bus ticket')
        expense3 = Expense(user_id=user2.id, category_id=cat_entertainment.id, amount=100.0, date=date(2024,6,3), description='Concert ticket')

        db.session.add_all([expense1, expense2, expense3])
        db.session.commit()

        print("Database seeded successfully.")

if __name__ == '__main__':
    seed_data()
