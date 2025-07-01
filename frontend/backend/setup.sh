#!/bin/bash

# Budget Smart Backend Setup Script

echo "🚀 Setting up Budget Smart Backend..."

# Create virtual environment
echo "Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
python -c "from app import create_app; from extensions import db; app = create_app(); app.app_context().push(); db.create_all(); print('Database initialized!')"

# Seed database
echo "Seeding database with sample data..."
python seed_data.py

echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "1. Activate virtual environment: source venv/bin/activate (Linux/Mac) or venv\\Scripts\\activate (Windows)"
echo "2. Run: python app.py"
echo ""
echo "Admin credentials:"
echo "Email: admin@gmail.com"
echo "Password: 12345"
