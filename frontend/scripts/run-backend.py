#!/usr/bin/env python3
"""
Budget Smart Backend Server
Run this script to start the Flask backend server
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        sys.exit(1)

def run_server():
    """Run the Flask server"""
    print("Starting Budget Smart Backend Server...")
    print("Server will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    
    try:
        # Import and run the Flask app
        from app import create_app
        from extensions import db
        
        app = create_app()
        
        # Initialize database
        with app.app_context():
            db.create_all()
            print("✅ Database initialized successfully!")
        
        # Run the server
        app.run(debug=True, port=5000, host='0.0.0.0')
        
    except ImportError:
        print("❌ Error: app.py not found in the current directory")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🚀 Budget Smart Backend Setup")
    print("=" * 40)
    
    # Check if requirements.txt exists
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found!")
        sys.exit(1)
    
    # Install requirements
    install_requirements()
    
    print("\n" + "=" * 40)
    
    # Run server
    run_server()
