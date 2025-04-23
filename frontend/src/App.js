// File: frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from "./context/UserContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Components
import PrivateRoute from "./components/PrivateRoute";

// Styles
import "./App.css";
import EditUser from "./pages/EditUser"; // Add this line

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ProductProvider>
            <UserProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/products/add" element={<AddProduct />} />
                  <Route path="/products/edit/:id" element={<EditProduct />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/add" element={<AddUser />} />
                  <Route path="/users/edit/:id" element={<EditUser />} />{" "}
                  {/* Add this line */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserProvider>
          </ProductProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
