from flask import Flask
from flask_migrate import Migrate
from flask import Flask
from config import Config
from extensions import db
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

from models import models
from routes import routes_bp

app.register_blueprint(routes_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
