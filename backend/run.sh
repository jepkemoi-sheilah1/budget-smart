#!/bin/bash

# Set environment variables for Flask
export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_RUN_PORT=5000

# Activate virtual environment if needed
# source /path/to/venv/bin/activate

# Run the Flask app
flask run
