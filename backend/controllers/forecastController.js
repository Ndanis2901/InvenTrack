const Product = require("../models/Product");
const SalesHistory = require("../models/SalesHistory");
const mongoose = require("mongoose");

// @desc    Generate forecast for a product
// @route   GET /api/forecast/:id
// @access  Private
exports.generateForecast = async (req, res) => {
  try {
    const { id } = req.params;
    const { months = 6 } = req.query;

    console.log(`Generating forecast for product ID: ${id}, months: ${months}`);

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    // Get historical sales data grouped by month
    const historicalData = await SalesHistory.aggregate([
      {
        $match: { productId: new mongoose.Types.ObjectId(id) },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          sales: { $sum: "$quantity" },
          holidaySales: {
            $sum: {
              $cond: [{ $eq: ["$isHoliday", true] }, "$quantity", 0],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    console.log(`Found ${historicalData.length} historical data points`);

    // If no historical data, return error
    if (historicalData.length === 0) {
      console.log("No sales history found");
      return res
        .status(404)
        .json({ message: "No sales history found for this product" });
    }

    // Calculate seasonal indices (month factors)
    const monthlyTotals = Array(12).fill(0);
    const monthlyCounts = Array(12).fill(0);

    historicalData.forEach((data) => {
      const monthIdx = data._id.month - 1; // 0-based index
      monthlyTotals[monthIdx] += data.sales;
      monthlyCounts[monthIdx]++;
    });

    // Calculate monthly averages
    const monthlyAverages = monthlyTotals.map((total, idx) =>
      monthlyCounts[idx] > 0 ? total / monthlyCounts[idx] : 0
    );

    // Calculate overall average
    const overallTotal = monthlyTotals.reduce((sum, val) => sum + val, 0);
    const overallCount = monthlyCounts.reduce((sum, val) => sum + val, 0);
    const overallAverage = overallCount > 0 ? overallTotal / overallCount : 0;

    // Calculate seasonal indices (normalized)
    const seasonalIndices = monthlyAverages.map((avg) =>
      overallAverage > 0 ? avg / overallAverage : 1
    );

    // Get latest date in historical data
    const latestData = historicalData[historicalData.length - 1];
    const latestYear = latestData._id.year;
    const latestMonth = latestData._id.month;

    console.log(`Latest data point: ${latestMonth}/${latestYear}`);

    // Generate forecast for the requested number of months
    const forecast = [];
    let forecastMonth = latestMonth;
    let forecastYear = latestYear;

    for (let i = 1; i <= parseInt(months); i++) {
      // Move to next month
      forecastMonth++;
      if (forecastMonth > 12) {
        forecastMonth = 1;
        forecastYear++;
      }

      // Get seasonal index for this month (0-based index)
      const monthIndex = forecastMonth - 1;
      const seasonalIndex = seasonalIndices[monthIndex];

      // Calculate forecast using seasonality
      // Add growth trend of 5% per year
      const monthsSinceLatest =
        (forecastYear - latestYear) * 12 + (forecastMonth - latestMonth);
      const trendFactor = 1 + (0.05 * monthsSinceLatest) / 12;

      const forecastValue = overallAverage * seasonalIndex * trendFactor;

      // Add forecast data point
      forecast.push({
        year: forecastYear,
        month: forecastMonth,
        seasonalIndex,
        forecast: Math.round(forecastValue),
        upperBound: Math.round(forecastValue * 1.15), // 15% upper bound
        lowerBound: Math.round(forecastValue * 0.85), // 15% lower bound
      });
    }

    // Format historical data for response
    const formattedHistory = historicalData.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      sales: item.sales,
      holidaySales: item.holidaySales,
    }));

    // Return forecast data
    const responseData = {
      product: {
        _id: product._id,
        name: product.name,
        sku: product.sku,
        category: product.category,
      },
      seasonalIndices,
      historicalData: formattedHistory,
      forecast,
    };

    console.log("Successfully generated forecast");
    res.json(responseData);
  } catch (error) {
    console.error("Forecast generation error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seasonal patterns for all products
// @route   GET /api/forecast/seasonal-patterns
// @access  Private
exports.getSeasonalPatterns = async (req, res) => {
  try {
    // Get sales data for all products, grouped by month
    const seasonalData = await SalesHistory.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            category: "$product.category", // This assumes you have populated the product
          },
          totalSales: { $sum: "$quantity" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // Process data by category
    const categoriesData = {};

    seasonalData.forEach((data) => {
      const category = data._id.category || "Unknown";
      const month = data._id.month;

      if (!categoriesData[category]) {
        categoriesData[category] = Array(12).fill(0);
      }

      categoriesData[category][month - 1] = data.totalSales;
    });

    // Normalize each category's data
    Object.keys(categoriesData).forEach((category) => {
      const total = categoriesData[category].reduce((sum, val) => sum + val, 0);
      const average = total / 12;

      if (average > 0) {
        categoriesData[category] = categoriesData[category].map(
          (val) => val / average
        );
      }
    });

    // Format the response
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

    const formattedData = monthNames.map((month, idx) => {
      const dataPoint = { month };

      Object.keys(categoriesData).forEach((category) => {
        dataPoint[category] = categoriesData[category][idx];
      });

      return dataPoint;
    });

    res.json(formattedData);
  } catch (error) {
    console.error("Seasonal patterns error:", error);
    res.status(500).json({ message: error.message });
  }
};
