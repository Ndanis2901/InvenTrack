# InvenTrack - Pet Food Seasonal Trend Forecasting

InvenTrack is a specialized inventory management system designed for pet food brands to forecast seasonal trends and optimize inventory levels. The application helps reduce unsold stock by providing data-driven insights into pet food demand patterns throughout the year.

## Features

- Seasonal Trend Forecasting for Pet Food Products
- Pet Food Product Management
- Inventory Optimization Recommendations
- Seasonal Risk Monitoring
- Dashboard Analytics
- Visual Reporting
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

### Pet Food Products

- `GET /api/products` - Get all pet food products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Seasonal Forecasts

- `GET /api/forecasts` - Get all seasonal forecasts
- `GET /api/forecasts/:season` - Get forecasts for a specific season
- `GET /api/forecasts/products/:productId` - Get forecasts for a specific product
- `POST /api/forecasts` - Create a new forecast (admin only)

## How It Works

InvenTrack helps pet food brands optimize their inventory by:

1. **Historical Data Analysis**: Tracking sales patterns across seasons to identify trends
2. **Seasonal Forecasting**: Predicting future demand based on historical patterns
3. **Risk Monitoring**: Identifying products at risk of overstocking or stockouts
4. **Optimization Recommendations**: Providing specific inventory adjustments to maximize sales and minimize waste

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
