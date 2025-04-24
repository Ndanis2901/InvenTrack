import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const ForecastChart = ({ forecastData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (forecastData) {
      const { historicalData, forecast } = forecastData;

      // Format historical data
      const formattedHistory = historicalData.map((item) => {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        return {
          period: `${monthNames[item.month - 1]} ${item.year}`,
          sales: item.sales,
          forecast: null,
          upperBound: null,
          lowerBound: null,
          isHistory: true,
        };
      });

      // Format forecast data
      const formattedForecast = forecast.map((item) => {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        return {
          period: `${monthNames[item.month - 1]} ${item.year}`,
          sales: null,
          forecast: item.forecast,
          upperBound: item.upperBound,
          lowerBound: item.lowerBound,
          isHistory: false,
        };
      });

      // Combine the data
      setChartData([...formattedHistory, ...formattedForecast]);
    }
  }, [forecastData]);

  if (!forecastData || chartData.length === 0) {
    return <div>No forecast data available</div>;
  }

  return (
    <div className="forecast-chart">
      <h3>Sales Forecast</h3>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            fill="#8884d8"
            name="Historical Sales"
            fillOpacity={0.3}
            activeDot={{ r: 8 }}
          />

          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Forecast"
            fillOpacity={0.3}
            activeDot={{ r: 8 }}
          />

          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Upper Bound"
            fillOpacity={0.1}
            strokeDasharray="3 3"
          />

          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Lower Bound"
            fillOpacity={0.1}
            strokeDasharray="3 3"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="forecast-legend">
        <p>
          <strong>Confidence Interval:</strong> The area between Upper and Lower
          Bounds represents the range where demand is likely to fall.
        </p>
      </div>
    </div>
  );
};

export default ForecastChart;
