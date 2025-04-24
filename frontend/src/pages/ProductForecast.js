import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import ForecastChart from "../components/ForecastChart";
import SeasonalityChart from "../components/SeasonalityChart";
import ForecastInsights from "../components/ForecastInsights";
import SalesForm from "../components/SalesForm";

const ProductForecast = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecastMonths, setForecastMonths] = useState(6);
  const [showSalesForm, setShowSalesForm] = useState(false);

  // Function to load forecast data - wrapped with useCallback
  const loadForecastData = useCallback(async () => {
    console.log("Loading data for product ID:", id);
    try {
      setLoading(true);
      setError(null);

      // Get product details
      const productResponse = await axios.get(
        `http://localhost:5001/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setProduct(productResponse.data);
      console.log("Product data loaded:", productResponse.data.name);

      // Get sales history
      const salesResponse = await axios.get(
        `http://localhost:5001/api/sales/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSalesHistory(salesResponse.data);
      console.log("Sales records loaded:", salesResponse.data.length);

      // If we have sales history, try to get forecast
      if (salesResponse.data.length > 0) {
        try {
          const forecastResponse = await axios.get(
            `http://localhost:5001/api/forecast/${id}?months=${forecastMonths}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          setForecastData(forecastResponse.data);
          console.log("Forecast data loaded successfully");
        } catch (forecastError) {
          console.error("Error loading forecast:", forecastError);
          setError("Could not generate forecast. Please try again.");
        }
      } else {
        setError("No sales history found for this product");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  }, [id, user, forecastMonths]); // Include all dependencies

  // Load data when component mounts or when dependencies change
  useEffect(() => {
    if (user && id) {
      loadForecastData();
    }
  }, [id, user, forecastMonths, loadForecastData]); // Include all dependencies

  // Handle sales recorded
  const handleSaleRecorded = () => {
    console.log("Sale recorded, reloading data");
    setShowSalesForm(false);
    loadForecastData();
  };

  return (
    <Layout>
      <div className="forecast-page">
        <div className="page-header">
          <div className="header-left">
            <Link to={`/products/${id}`} className="btn-back">
              <i className="fas fa-arrow-left"></i> Back to Product
            </Link>
            <h1>
              {loading
                ? "Loading..."
                : product
                ? `Forecast: ${product.name}`
                : "Product Forecast"}
            </h1>
          </div>
          <div className="header-right">
            {user && user.role === "admin" && (
              <button
                type="button"
                className="btn-record-sale"
                onClick={() => {
                  console.log("Record Sale button clicked");
                  setShowSalesForm(true); // Always set to true to show the form
                }}
              >
                <i className="fas fa-plus"></i> Record Sale
              </button>
            )}
          </div>
        </div>

        {/* Always show the sales form if showSalesForm is true */}
        {showSalesForm && (
          <div className="sales-form-wrapper">
            <SalesForm
              productId={id}
              productName={product?.name || ""}
              onSaleRecorded={handleSaleRecorded}
            />
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowSalesForm(false)}
            >
              Cancel
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading forecast data...</div>
        ) : error ? (
          <div className="error-container">
            <div className="error-message">{error}</div>
            <p>
              You need to record sales history before generating a forecast.
              {user && user.role === "admin" && !showSalesForm && (
                <>
                  <br />
                  <button
                    type="button"
                    className="btn-record-sale"
                    onClick={() => {
                      console.log("Record Sales Now button clicked");
                      setShowSalesForm(true);
                    }}
                  >
                    Record Sales Now
                  </button>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="forecast-content">
            {forecastData && (
              <>
                <div className="forecast-controls">
                  <label htmlFor="forecastMonths">Forecast Horizon:</label>
                  <select
                    id="forecastMonths"
                    value={forecastMonths}
                    onChange={(e) => setForecastMonths(e.target.value)}
                  >
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>

                <div className="charts-container">
                  <div className="chart-wrapper">
                    <ForecastChart forecastData={forecastData} />
                  </div>

                  <div className="chart-wrapper">
                    <SeasonalityChart
                      seasonalIndices={forecastData?.seasonalIndices}
                    />
                  </div>
                </div>

                <ForecastInsights forecastData={forecastData} />
              </>
            )}

            <div className="sales-history-section">
              <h3>Recent Sales History</h3>

              {salesHistory.length === 0 ? (
                <p>No sales history recorded yet.</p>
              ) : (
                <table className="sales-history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Month/Year</th>
                      <th>Quantity</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesHistory.map((sale) => {
                      const saleDate = new Date(sale.date);
                      return (
                        <tr key={sale._id}>
                          <td>{saleDate.toLocaleDateString()}</td>
                          <td>
                            {saleDate.toLocaleString("default", {
                              month: "long",
                            })}{" "}
                            {saleDate.getFullYear()}
                          </td>
                          <td>{sale.quantity}</td>
                          <td>{sale.notes || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductForecast;
