import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SeasonalityChart = ({ seasonalIndices }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (seasonalIndices && seasonalIndices.length === 12) {
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

      const data = seasonalIndices.map((value, index) => ({
        month: monthNames[index],
        index: parseFloat(value.toFixed(2)),
      }));

      setChartData(data);
    }
  }, [seasonalIndices]);

  if (!seasonalIndices || seasonalIndices.length !== 12) {
    return <div>No seasonality data available</div>;
  }

  return (
    <div className="seasonality-chart">
      <h3>Monthly Seasonality Factors</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, Math.max(...seasonalIndices) * 1.1]} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="index"
            name="Seasonal Factor"
            fill="#8884d8"
            background={{ fill: "#eee" }}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="seasonality-legend">
        <p>
          <strong>Interpretation:</strong> Values above 1.0 indicate higher
          seasonal demand, while values below 1.0 indicate lower demand.
        </p>
      </div>
    </div>
  );
};

export default SeasonalityChart;
