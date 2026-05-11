from flask import Flask
from flask_migrate import Migrate
from config import Config
from extensions import db, jwt
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

CORS(app,
     resources={r"/api/*": {"origins": [
         "http://localhost:3001",
         "http://127.0.0.1:3001",
         "https://budget-smart-three.vercel.app"
     ]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3001')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

db.init_app(app)
jwt.init_app(app)
migrate = Migrate(app, db)

from models import models
from routes import routes_bp

app.register_blueprint(routes_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)