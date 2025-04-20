import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import Layout from "../components/Layout";
import "../assets/styles/Dashboard.css";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const { products, loading, getLowStockProducts } = useContext(ProductContext);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [seasonalTrendRisk, setSeasonalTrendRisk] = useState(0);
  const [categories, setCategories] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (products && products.length > 0) {
      // Calculate total counts
      setTotalProducts(products.length);

      // Calculate products at seasonal risk (previously low stock)
      setSeasonalTrendRisk(getLowStockProducts().length);

      // Calculate total inventory value
      const total = products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
      setTotalValue(total);

      // Extract categories
      const uniqueCategories = [...new Set(products.map((p) => p.category))];
      setCategories(uniqueCategories);

      // Process data for pie chart (products by category)
      const categoryData = uniqueCategories.map((cat) => {
        return products.filter((p) => p.category === cat).length;
      });

      setPieData({
        labels: uniqueCategories,
        datasets: [
          {
            label: "Pet Food Products by Category",
            data: categoryData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
            borderWidth: 1,
          },
        ],
      });

      // Process data for line chart (seasonal trend data)
      const seasons = [
        "Winter",
        "Spring",
        "Summer",
        "Fall",
        "Winter",
        "Spring",
      ];

      // Mock seasonal variation data - in a real app, this would be from actual sales data
      const mockSeasonalData = [
        Math.floor(Math.random() * 2000) + 3000, // Winter - higher
        Math.floor(Math.random() * 1000) + 2000, // Spring - medium
        Math.floor(Math.random() * 1000) + 1000, // Summer - lower
        Math.floor(Math.random() * 1500) + 2500, // Fall - medium-high
        Math.floor(Math.random() * 2000) + 3200, // Winter - higher
        Math.floor(Math.random() * 1000) + 2100, // Spring - medium
      ];

      setChartData({
        labels: seasons,
        datasets: [
          {
            label: "Seasonal Pet Food Demand",
            data: mockSeasonalData,
            fill: false,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            tension: 0.3,
          },
        ],
      });
    }
  }, [products, getLowStockProducts]);

  return (
    <Layout>
      <div className="dashboard">
        <h1>Pet Food Trend Dashboard</h1>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="stats-container">
              <div className="stat-card">
                <i className="fas fa-bone stat-icon"></i>
                <div className="stat-info">
                  <h3>Total Pet Food Products</h3>
                  <p className="stat-value">{totalProducts}</p>
                </div>
              </div>

              <div className="stat-card">
                <i className="fas fa-dollar-sign stat-icon"></i>
                <div className="stat-info">
                  <h3>Inventory Value</h3>
                  <p className="stat-value">${totalValue.toFixed(2)}</p>
                </div>
              </div>

              <div className="stat-card">
                <i className="fas fa-temperature-high stat-icon"></i>
                <div className="stat-info">
                  <h3>Seasonal Risk Items</h3>
                  <p className="stat-value">{seasonalTrendRisk}</p>
                </div>
              </div>

              <div className="stat-card">
                <i className="fas fa-tags stat-icon"></i>
                <div className="stat-info">
                  <h3>Pet Food Categories</h3>
                  <p className="stat-value">{categories.length}</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
              <div className="chart-card">
                <h2>Seasonal Demand Forecast</h2>
                <Line data={chartData} />
              </div>

              <div className="chart-card">
                <h2>Products by Pet Food Category</h2>
                <Pie data={pieData} />
              </div>
            </div>

            {/* Seasonal Risk Table */}
            <div className="data-container">
              <div className="data-card">
                <h2>Seasonal Risk Items</h2>
                <p className="seasonal-insight">
                  Products that have potential overstocking risk based on
                  upcoming seasonal trends.
                </p>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Current Stock</th>
                      <th>Seasonal Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getLowStockProducts().map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.sku}</td>
                        <td className="quantity-cell">{product.quantity}</td>
                        <td>
                          {product.quantity > product.lowStockThreshold * 2
                            ? "Potential Overstock"
                            : "Optimized"}
                        </td>
                      </tr>
                    ))}
                    {getLowStockProducts().length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          No seasonal risk items detected
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
