const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// @desc    Get all products
// @route   GET  /api/products
// @access  All
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const filters = {
    title: req.query.title,
    categoryid: req.query.categoryid,
    availability_status: req.query.availability,
    discount_percent: req.query.discount,
  };

  const products = await Product.getAll(filters);

  if (!products) {
    throw new Error("No Product Found");
  }

  res.status(200).json({
    status: "success",
    length: products.length,
    products,
  });
});

// @desc    Get all products For Seller
// @route   GET  /api/products
// @access  seller
exports.getSellerProducts = asyncHandler(async (req, res) => {
  const userid = req.user.userid;
  const sellerProducts = await Product.getAll({}, userid);
  res.status(200).json({
    status: "success",
    length: sellerProducts.length,
    sellerProducts,
  });
});

// @desc    Get A product By ID
// @route   GET  /api/products/:id
// @access  All
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("No Product Found");
  }
  res.status(200).json({
    status: "success",
    product,
  });
});

// @desc    Create product
// @route   POST  /api/products
// @access  Seller
exports.createNewProduct = asyncHandler(async (req, res, next) => {
  req.body.userid = req.user.userid;
  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    product,
  });
});

// @desc    Update product By Id
// @route   PATCH  /api/products/:id
// @access  Seller
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("No Product Found");
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, userid, req.body);

  if (!updatedProduct) {
    res
      .status(401)
      .json({ message: "User is Not Authorized to Update this product" });
  }
  res.status(201).json({
    status: "success",
    updatedProduct,
  });
});

// @desc    Delete product By id
// @route   DELETE  /api/products
// @access  Seller
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("No Product Found");
  }
  const deletedProduct = await Product.findByIdAndDelete(id, userid);

  if (!deletedProduct) {
    res
      .status(401)
      .json({ message: "User is Not Authorized to Delete this product" });
  }
  res.status(200).json({
    message: "Product successfully Removed",
  });
});
