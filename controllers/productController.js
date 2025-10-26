const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// @desc    Get all products
// @route   GET  /api/products
// @access  Visitor/Buyer/Seller
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.getAll();
  res.status(200).json({
    status: "success",
    products,
  });
});

// @desc    Get A product By ID
// @route   GET  /api/products/:id
// @access  Visitor/Buyer/Seller
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
  userid = req.user.userid;
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("No Product Found");
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, userid, req.body);

  if (!updatedProduct) {
    throw new Error("User is Not Authorized to Update this product");
  }
  res.status(201).json({
    status: "success",
    updatedProduct,
  });
});

// @desc    Delete product By id
// @route   DELETE  /api/v1/products
// @access  Seller
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  userid = req.user.userid;
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("No Product Found");
  }
  const deletedProduct = await Product.findByIdAndDelete(id, userid);

  if (!deletedProduct) {
    throw new Error("User is Not Authorized to Update this product");
  }
  res.status(204);
});
