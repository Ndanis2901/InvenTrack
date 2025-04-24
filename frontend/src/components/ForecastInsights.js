import React from "react";

const ForecastInsights = ({ forecastData }) => {
  if (!forecastData) {
    return null;
  }

  const { seasonalIndices, forecast } = forecastData;

  // Find peak and low seasons
  const indexedMonths = seasonalIndices.map((value, index) => ({
    value,
    month: index,
  }));
  indexedMonths.sort((a, b) => b.value - a.value);

  const peakMonths = indexedMonths.slice(0, 3);
  const lowMonths = indexedMonths.slice(-3).reverse();

  // Calculate expected stock needs
  const nextMonthForecast = forecast[0];
  const sixMonthTotal = forecast.reduce((sum, item) => sum + item.forecast, 0);

  // Format month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="forecast-insights">
      <h3>Inventory Planning Insights</h3>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-header">
            <i className="fas fa-calendar-alt"></i>
            <h4>Seasonal Patterns</h4>
          </div>
          <div className="insight-content">
            <p>
              <strong>Peak Demand Months:</strong>
            </p>
            <ul>
              {peakMonths.map((item) => (
                <li key={`peak-${item.month}`}>
                  {monthNames[item.month]} (
                  {(item.value * 100 - 100).toFixed(0)}% above average)
                </li>
              ))}
            </ul>

            <p>
              <strong>Low Demand Months:</strong>
            </p>
            <ul>
              {lowMonths.map((item) => (
                <li key={`low-${item.month}`}>
                  {monthNames[item.month]} (
                  {(100 - item.value * 100).toFixed(0)}% below average)
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <i className="fas fa-boxes"></i>
            <h4>Inventory Recommendations</h4>
          </div>
          <div className="insight-content">
            <p>
              <strong>Next Month Expected Sales:</strong>{" "}
              {nextMonthForecast.forecast} units
            </p>
            <p>
              <strong>Safety Stock Recommendation:</strong>{" "}
              {Math.ceil(
                nextMonthForecast.upperBound - nextMonthForecast.forecast
              )}{" "}
              additional units
            </p>
            <p>
              <strong>6-Month Projected Demand:</strong> {sixMonthTotal} units
            </p>

            <div className="recommendation-box">
              <p>
                <strong>Recommendation:</strong> Plan inventory levels for{" "}
                {monthNames[nextMonthForecast.month - 1]} at{" "}
                {nextMonthForecast.upperBound} units to avoid stockouts during
                this{" "}
                {nextMonthForecast.seasonalIndex > 1.1
                  ? "high-demand"
                  : "normal-demand"}{" "}
                period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastInsights;
