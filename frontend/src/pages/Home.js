import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/Home.css";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to InvenTrack</h1>
          <p>Pet Food Seasonal Trend Forecasting to Optimize Your Inventory</p>
          {user ? (
            <Link to="/dashboard" className="cta-button">
              Go to Dashboard
            </Link>
          ) : (
            <div className="hero-buttons">
              <Link to="/login" className="cta-button">
                Login
              </Link>
              <Link to="/register" className="secondary-button">
                Register
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Seasonal Trend Forecasting</h3>
            <p>
              Predict pet food demand patterns based on historical seasonal data
              to optimize inventory levels.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <h3>Analytics Dashboard</h3>
            <p>
              Get insights into seasonal pet food trends with comprehensive
              analytics and visual reporting.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-dolly-flatbed"></i>
            </div>
            <h3>Stock Optimization</h3>
            <p>
              Reduce unsold pet food inventory and optimize storage with
              data-driven stocking recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Input Your Pet Food Products</h3>
              <p>
                Add your pet food catalog with details on product lines,
                seasonal patterns, and storage requirements.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Track Seasonal Sales Data</h3>
              <p>
                Record historical pet food sales data to identify seasonal
                patterns and trends.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Implement Forecasted Recommendations</h3>
              <p>
                Use our AI-powered seasonal predictions to optimize your pet
                food inventory and reduce waste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Optimize Your Pet Food Inventory?</h2>
          <p>
            Join leading pet food brands that use InvenTrack to reduce waste and
            maximize seasonal sales opportunities.
          </p>
          {user ? (
            <Link to="/dashboard" className="cta-button">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="cta-button">
              Get Started Now
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>InvenTrack</h3>
            <p>Pet Food Seasonal Trend Forecasting</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="#docs">Documentation</a>
                </li>
                <li>
                  <a href="#guides">Seasonal Guides</a>
                </li>
                <li>
                  <a href="#support">Support</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms">Terms of Service</a>
                </li>
                <li>
                  <a href="#cookies">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} InvenTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
