const Product = require("../models/Product");
const Notification = require("../models/Notification");

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Private
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      description,
      price,
      costPrice,
      quantity,
      lowStockThreshold,
      supplier,
      image,
      status,
    } = req.body;

    // Check if product with same SKU already exists
    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res
        .status(400)
        .json({ message: "Product with this SKU already exists" });
    }

    const product = await Product.create({
      name,
      sku,
      category,
      description,
      price,
      costPrice,
      quantity,
      lowStockThreshold,
      supplier,
      image,
      status,
      createdBy: req.user._id,
    });

    if (product) {
      res.status(201).json(product);
    } else {
      res.status(400).json({ message: "Invalid product data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      description,
      price,
      costPrice,
      quantity,
      lowStockThreshold,
      supplier,
      image,
      status,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if updating SKU and if it already exists
      if (sku && sku !== product.sku) {
        const skuExists = await Product.findOne({ sku });
        if (skuExists) {
          return res
            .status(400)
            .json({ message: "Product with this SKU already exists" });
        }
      }

      // Track if quantity changed to create notification
      const oldQuantity = product.quantity;

      product.name = name || product.name;
      product.sku = sku || product.sku;
      product.category = category || product.category;
      product.description = description || product.description;
      product.price = price || product.price;
      product.costPrice = costPrice || product.costPrice;
      product.quantity = quantity !== undefined ? quantity : product.quantity;
      product.lowStockThreshold =
        lowStockThreshold || product.lowStockThreshold;
      product.supplier = supplier || product.supplier;
      product.image = image || product.image;
      product.status = status || product.status;

      const updatedProduct = await product.save();

      // Create low stock notification if quantity falls below threshold
      if (
        updatedProduct.quantity < updatedProduct.lowStockThreshold &&
        (oldQuantity > updatedProduct.lowStockThreshold ||
          oldQuantity === updatedProduct.quantity)
      ) {
        await Notification.create({
          title: "Low Stock Alert",
          message: `${updatedProduct.name} is running low on stock (${updatedProduct.quantity} remaining)`,
          type: "warning",
          relatedTo: updatedProduct._id,
          onModel: "Product",
        });
      }

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
