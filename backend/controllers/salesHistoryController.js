const SalesHistory = require("../models/SalesHistory");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// Holiday definitions
const HOLIDAYS = {
  // Format: "MM-DD": "Holiday Name"
  "12-25": "Christmas",
  "10-31": "Halloween",
  "11-25": "Thanksgiving", // Approximate
  "01-01": "New Year's Day",
  "07-04": "Independence Day",
};

// @desc    Record a new sales transaction
// @route   POST /api/sales
// @access  Private
exports.recordSale = async (req, res) => {
  try {
    const { productId, quantity, date, notes } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if sale date is a holiday
    const saleDate = date ? new Date(date) : new Date();
    const monthDay = `${String(saleDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(saleDate.getDate()).padStart(2, "0")}`;

    const isHoliday = HOLIDAYS[monthDay] ? true : false;
    const holidayName = HOLIDAYS[monthDay] || null;

    // Create the sales record
    const salesRecord = await SalesHistory.create({
      productId,
      quantity,
      date: saleDate,
      notes,
      isHoliday,
      holidayName,
      createdBy: req.user._id,
    });

    // Update product inventory
    product.quantity = Math.max(0, product.quantity - quantity);
    await product.save();

    res.status(201).json(salesRecord);
  } catch (error) {
    console.error("Sales recording error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales history for a product
// @route   GET /api/sales/product/:id
// @access  Private
exports.getSalesHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const query = { productId: id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const salesHistory = await SalesHistory.find(query).sort({ date: -1 });

    res.json(salesHistory);
  } catch (error) {
    console.error("Get sales history error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get aggregated sales data by month for forecasting
// @route   GET /api/sales/aggregate/:id
// @access  Private
exports.getAggregatedSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { years } = req.query;

    // Limit to last N years if specified
    const dateFilter = {};
    if (years) {
      const yearsAgo = new Date();
      yearsAgo.setFullYear(yearsAgo.getFullYear() - parseInt(years));
      dateFilter.$gte = yearsAgo;
    }

    const aggregatedSales = await SalesHistory.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(id),
          ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalSales: { $sum: "$quantity" },
          holidaySales: {
            $sum: {
              $cond: [{ $eq: ["$isHoliday", true] }, "$quantity", 0],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Format the response
    const formattedData = aggregatedSales.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      totalSales: item.totalSales,
      holidaySales: item.holidaySales,
      averageSales: item.totalSales / item.count,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Aggregated sales error:", error);
    res.status(500).json({ message: error.message });
  }
};
