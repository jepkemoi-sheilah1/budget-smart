# Budget Smart

## About
Budget Smart is a budgeting application designed to help users manage their finances effectively. It allows users to create budgets, categorize expenses, and track their spending over time.

## Features
- User registration and authentication
- Create, update, and delete budgets
- Manage expense categories
- Add, update, and delete expenses
- View expenses by category and date
- Secure login and logout functionality

## Tech Stack
### Backend
- Python
- Flask
- SQLAlchemy
- Flask-Migrate
- Flask-CORS

### Frontend
- React
- Axios
- Recharts
- React Router DOM

## Installation

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies using Pipenv:
   ```bash
   pipenv install
   ```
3. Activate the virtual environment:
   ```bash
   pipenv shell
   ```
4. Run database migrations:
   ```bash
   flask db upgrade
   ```

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies using npm:
   ```bash
   npm install
   ```

## Usage

### Backend
From the `backend` directory, run the Flask development server:
```bash
flask run
```
The backend API will be available at `http://localhost:5000/api`.

### Frontend
From the `frontend` directory, start the React development server:
```bash
npm start
```
The frontend app will be available at `http://localhost:3000`.

## API Endpoints

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/<user_id>` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/<user_id>` - Update user by ID
- `DELETE /api/users/<user_id>` - Delete user by ID

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Budget Endpoints
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/<budget_id>` - Get budget by ID
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/<budget_id>` - Update budget by ID
- `DELETE /api/budgets/<budget_id>` - Delete budget by ID

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/<category_id>` - Get category by ID
- `POST /api/categories` - Create a new category
- `PUT /api/categories/<category_id>` - Update category by ID
- `DELETE /api/categories/<category_id>` - Delete category by ID

### Expense Endpoints
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/<expense_id>` - Get expense by ID
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/<expense_id>` - Update expense by ID
- `DELETE /api/expenses/<expense_id>` - Delete expense by ID

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the existing code style and include tests where applicable.

## License
This project currently does not have a license file. Please contact the repository owner for licensing information.
## author 
     jepkemoi_sheilah1

