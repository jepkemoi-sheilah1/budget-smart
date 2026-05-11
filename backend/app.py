from flask import Flask
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
swagger = Swagger(app)

from models import models
from routes import routes_bp

app.register_blueprint(routes_bp, url_prefix='/api')

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