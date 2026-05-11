# 💰 Spentwise

> A modern personal finance tracker to help you manage budgets, track expenses, and visualize your spending.

---

## 🚀 Live Demo
- **Frontend:** Coming soon
- **Backend API:** Coming soon

---

## ✨ Features
- 🔐 User registration and JWT authentication
- 📊 Interactive dashboard with spending overview
- 🎯 Set monthly budgets per category
- 💸 Add, view, and delete expenses
- 📈 Visual bar chart of spending by category
- 📱 Fully responsive — works on mobile and desktop
- 🔒 Protected routes — data is user-specific

---

## 🛠 Tech Stack

### Backend
- Python & Flask
- SQLAlchemy & Flask-Migrate
- Flask-JWT-Extended
- Flask-CORS
- SQLite (development) → PostgreSQL (production)

### Frontend
- React
- Tailwind CSS
- Axios
- Recharts
- React Router DOM

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create the database:
```bash
python -c "from app import app; from extensions import db; app.app_context().push(); db.create_all()"
```

Seed categories:
```bash
python -c "
from app import app
from extensions import db
from models.models import Category

categories = [
    'Housing', 'Transportation', 'Food', 'Health & Medical',
    'Debt Payments', 'Savings & Investments', 'Personal & Family',
    'Entertainment & Leisure', 'Education', 'Gifts & Donations', 'Miscellaneous'
]

with app.app_context():
    for name in categories:
        existing = Category.query.filter_by(name=name).first()
        if not existing:
            db.session.add(Category(name=name))
    db.session.commit()
    print('Categories seeded!')
"
```

Run the backend:
```bash
python app.py
```
Backend runs at `http://localhost:5000/api`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3001`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and get JWT token |
| POST | `/api/logout` | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update current user |
| DELETE | `/api/users/me` | Delete current user |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get user budgets |
| POST | `/api/budgets` | Create a budget |
| PUT | `/api/budgets/<id>` | Update a budget |
| DELETE | `/api/budgets/<id>` | Delete a budget |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create a category |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get user expenses |
| POST | `/api/expenses` | Add an expense |
| PUT | `/api/expenses/<id>` | Update an expense |
| DELETE | `/api/expenses/<id>` | Delete an expense |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard?month=YYYY-MM` | Get monthly summary |

---

## 👩‍💻 Author
**Sheilah Jepkemoi**  
[GitHub](https://github.com/jepkemoi_sheilah1)

---

## 📄 License
This project is open source. Contact the author for licensing information.