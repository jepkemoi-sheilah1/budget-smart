from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, bcrypt
from routes.auth import auth_bp
from routes.user import user_bp
from routes.budget import budget_bp
from routes.expense import expense_bp
from routes.analytics import analytics_bp
import os

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget_smart.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'jwt-secret-string-change-in-production'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Configure CORS
    CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(budget_bp, url_prefix='/api/budgets')
    app.register_blueprint(expense_bp, url_prefix='/api/expenses')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Budget Smart API is running'}, 200
    
    # Create tables and admin user
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully")
        
        # Create admin user if it doesn't exist
        from models.models import User
        admin_user = User.query.filter_by(email='admin@gmail.com').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@gmail.com'
            )
            admin_user.set_password('12345')
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Admin user created: admin@gmail.com / 12345")
        else:
            print("ℹ️ Admin user already exists: admin@gmail.com / 12345")
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting Budget Smart Backend Server")
    print("🌐 Server: http://localhost:5000")
    print("🔗 Health Check: http://localhost:5000/api/health")
    print("👤 Admin Login: admin@gmail.com / 12345")
    app.run(debug=True, host='0.0.0.0', port=5000)
