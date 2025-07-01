#!/usr/bin/env python3
"""
Budget Smart Backend Runner
Run this script to start the Flask backend server
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

def main():
    print("=" * 50)
    print("🚀 Starting Budget Smart Backend Server")
    print("=" * 50)
    
    # Check if database exists
    if not os.path.exists('budget_smart.db'):
        print("📊 Creating database...")
        with create_app().app_context():
            from extensions import db
            db.create_all()
            print("✅ Database created successfully!")
    
    print(f"🌐 Server running at: http://localhost:5000")
    print(f"🔗 API Health Check: http://localhost:5000/api/health")
    print(f"👤 Admin Login: admin@gmail.com / 12345")
    print("=" * 50)
    
    try:
        create_app().run(debug=True, port=5000, host='0.0.0.0')
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
