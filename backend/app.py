from flask import Flask, redirect
from flask_migrate import Migrate
from config import Config
from extensions import db, jwt
from flask_cors import CORS
from flasgger import Swagger
from models.models import Category

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

app.config['SWAGGER'] = {
    'title': 'Spentwise API',
    'uiversion': 3
}

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/",
    "swagger_ui_bundle_js": "//unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js",
    "swagger_ui_standalone_preset_js": "//unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js",
    "swagger_ui_css": "//unpkg.com/swagger-ui-dist@3/swagger-ui.css",
}

swagger_template = {
    "info": {
        "title": "Spentwise API",
        "description": "Budget tracking API for Spentwise",
        "version": "1.0.0"
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT token format: Bearer <token>"
        }
    }
}

swagger = Swagger(app, config=swagger_config, template=swagger_template)

from models import models
from routes import routes_bp

app.register_blueprint(routes_bp, url_prefix='/api')

@app.route('/')
def index():
    return redirect('/apidocs/')

@app.route('/init-db')
def init_db():
    db.create_all()
    categories = [
        'Housing', 'Transportation', 'Food', 'Health & Medical',
        'Debt Payments', 'Savings & Investments', 'Personal & Family',
        'Entertainment & Leisure', 'Education', 'Gifts & Donations', 'Miscellaneous'
    ]
    for name in categories:
        existing = Category.query.filter_by(name=name).first()
        if not existing:
            db.session.add(Category(name=name))
    db.session.commit()
    return {"message": "Database initialized and categories seeded!"}

if __name__ == '__main__':
    app.run(debug=True)