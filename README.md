# Budget Smart - Personal Finance Management System

A comprehensive personal finance management application built with Next.js frontend and Python Flask backend, featuring expense tracking, budget management, and financial analytics.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration, login, and password reset
- **Expense Tracking**: Add, edit, delete, and categorize expenses
- **Budget Management**: Set monthly budgets by category
- **Financial Analytics**: Visual charts and spending insights
- **Data Export**: Export personal financial data
- **Profile Management**: Update profile and change passwords

### Security Features
- JWT-based authentication
- Password hashing with SHA-256
- Secure password reset with time-limited tokens
- Input validation and sanitization
- CORS protection

### User Experience
- Responsive design for all devices
- Real-time budget alerts
- Interactive charts and visualizations
- Date-based filtering
- Category-based expense organization

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Recharts** - Data visualization library
- **Lucide React** - Icon library

### Backend
- **Python 3.8+** - Programming language
- **Flask** - Web framework
- **SQLite** - Database
- **JWT** - Authentication tokens
- **Flask-CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- pip (Python package manager)

## 🚀 Installation & Setup

### Backend Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd budget-smart
   \`\`\`

2. **Set up Python virtual environment**
   \`\`\`bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   \`\`\`

3. **Install Python dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   \`\`\`env
   SECRET_KEY=your-super-secret-key-here
   DATABASE_URL=sqlite:///budget_smart.db
   FLASK_ENV=development
   FLASK_DEBUG=True
   
   # Email configuration (optional)
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   \`\`\`

5. **Initialize the database**
   \`\`\`bash
   python flask-backend.py
   \`\`\`
   The database will be automatically created on first run.

6. **Start the Flask server**
   \`\`\`bash
   python run-backend.py
   \`\`\`
   Server will be available at `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Application will be available at `http://localhost:3000`

## 📊 Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Expenses Table
\`\`\`sql
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
\`\`\`

### Budgets Table
\`\`\`sql
CREATE TABLE budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, category, month, year)
);
\`\`\`

### Password Resets Table
\`\`\`sql
CREATE TABLE password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
\`\`\`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/change-password` - Change password
- `GET /api/user/export-data` - Export user data
- `DELETE /api/user/delete-account` - Delete user account

### Expenses
- `GET /api/expenses` - Get user expenses (with filtering)
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/<id>` - Update expense
- `DELETE /api/expenses/<id>` - Delete expense

### Budgets
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Set/update budget

### Analytics
- `GET /api/analytics/summary` - Get financial summary

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration/Login**: User credentials are validated and a JWT token is issued
2. **Token Storage**: Frontend stores the token in localStorage
3. **API Requests**: Token is sent in the Authorization header as `Bearer <token>`
4. **Token Validation**: Backend validates the token for protected routes

### Password Security
- Passwords are hashed using SHA-256
- Password reset tokens expire after 1 hour
- Minimum password length: 6 characters

## 📱 Usage

### Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Set Budget**: Define monthly spending limits for each category
4. **Track Expenses**: Add daily expenses with descriptions and categories
5. **Monitor Progress**: View charts and summaries of your spending

### Key Features
- **Dashboard**: Overview of budget vs. actual spending
- **Expense Management**: Add, edit, or delete expense entries
- **Budget Alerts**: Get warnings when approaching budget limits
- **Data Filtering**: Filter expenses by category and date range
- **Profile Settings**: Update personal information and change password

## 🔧 Configuration

### Environment Variables
\`\`\`env
# Flask Configuration
SECRET_KEY=your-secret-key
FLASK_ENV=development
FLASK_DEBUG=True

# Database
DATABASE_URL=sqlite:///budget_smart.db

# Email (for password reset)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-password
\`\`\`

### Categories
Default expense categories:
- Housing (rent, utilities, maintenance)
- Food (groceries, restaurants, dining)
- Transportation (gas, public transport, car maintenance)
- Entertainment (movies, games, subscriptions)

## 🚀 Deployment

### Backend Deployment
1. **Production Environment**
   \`\`\`bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 flask-backend:app
   \`\`\`

2. **Environment Variables**
   Set production values for:
   - `SECRET_KEY` (use a strong, random key)
   - `FLASK_ENV=production`
   - `DATABASE_URL` (production database)

### Frontend Deployment
1. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to Vercel/Netlify**
   - Connect your repository
   - Set environment variables
   - Deploy automatically

## 🧪 Testing

### Backend Testing
\`\`\`bash
# Install testing dependencies
pip install pytest pytest-flask

# Run tests
pytest tests/
\`\`\`

### Frontend Testing
\`\`\`bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react

# Run tests
npm test
\`\`\`

## 📈 Performance Optimization

### Backend
- Database indexing on frequently queried columns
- Connection pooling for database operations
- Caching for repeated queries
- Input validation to prevent SQL injection

### Frontend
- Code splitting with Next.js
- Image optimization
- Lazy loading of components
- Efficient state management

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   \`\`\`
   Solution: Ensure SQLite database file has proper permissions
   \`\`\`

2. **CORS Error**
   \`\`\`
   Solution: Verify Flask-CORS is installed and configured
   \`\`\`

3. **JWT Token Invalid**
   \`\`\`
   Solution: Check token expiration and SECRET_KEY consistency
   \`\`\`

4. **Port Already in Use**
   \`\`\`bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   \`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions:
- Create an issue on GitHub
- Email: support@budgetsmart.com
- Documentation: [Wiki](https://github.com/your-repo/wiki)

## 🎯 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Bank account integration
- [ ] Recurring expense automation
- [ ] Advanced analytics and reports
- [ ] Multi-currency support
- [ ] Expense receipt scanning
- [ ] Budget sharing with family members
- [ ] Investment tracking
- [ ] Bill reminders and notifications
- [ ] Dark mode theme

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added password reset and profile management
- **v1.2.0** - Enhanced security and data export features

---

**Budget Smart** - Take control of your finances with intelligent budgeting and expense tracking.

