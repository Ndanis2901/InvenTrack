# InvenTrack - Inventory Management System

InvenTrack is a comprehensive inventory management system that helps businesses track and manage their inventory efficiently. The application includes features like product management, low stock notifications, analytics dashboard, and more.

## Features

- User Authentication and Authorization
- Product Management
- Inventory Tracking
- Low Stock Alerts
- Dashboard Analytics
- Notification System
- Responsive Design

## Tech Stack

- **Frontend**: React.js, React Router, Chart.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API

## Installation

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Setup and Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/inventrack.git
   cd inventrack
   ```

2. Install dependencies for the backend:

   ```
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:

   ```
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory:

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/inventrackDB
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

5. Start the development servers:

   ```
   # In the backend directory
   npm run dev
   ```

   This will start both the backend server and the frontend development server concurrently.

## Project Structure

```
inventrack/
├── backend/
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js          # Entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Notifications

- `GET /api/notifications` - Get all notifications for the user
- `PUT /api/notifications/:id` - Mark a notification as read
- `PUT /api/notifications/mark-all` - Mark all notifications as read
- `POST /api/notifications` - Create a notification (admin only)
- `DELETE /api/notifications/:id` - Delete a notification (admin only)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
