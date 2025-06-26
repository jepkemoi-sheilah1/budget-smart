from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import models
from routes import routes_bp

app.register_blueprint(routes_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
