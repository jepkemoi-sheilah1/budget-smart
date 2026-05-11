from flask import Flask
from flask_migrate import Migrate
from config import Config
from extensions import db, jwt
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

CORS(app,
     resources={r"/api/*": {"origins": "*"}},
     supports_credentials=False,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

db.init_app(app)
jwt.init_app(app)
migrate = Migrate(app, db)

from models import models
from routes import routes_bp

app.register_blueprint(routes_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)