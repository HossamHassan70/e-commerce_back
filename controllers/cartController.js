const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");

// @desc    Get User Cart
// @route   GET  /api/cart
// @access  Buyer/Seller
exports.getCart = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  const cart = await Cart.get(userid);

  if (cart.length === 0) {
    res.status(200).json({ message: "Cart is Empty" });
  }

  res.status(200).json({
    cart,
  });
});

// @desc    Add or Update To cart
// @route   POST  /api/cart
// @access  Buyer/Seller
exports.addToCart = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  const { productid, quantity } = req.body;

  if (
    req.user.role === "seller" &&
    (await Cart.checkOwner(userid, productid))
  ) {
    res.status(401).json({
      message: "This Product is Owned By Current User",
    });
  }

  const cartItem = await Cart.addOrUpdate(userid, productid, quantity);

  res.status(201).json({
    message: "Product added to cart",
    cartItem,
  });
});

// @desc    Reduce Quantity
// @route   POST  /api/cart
// @access  Buyer/Seller
exports.decreaseProductQnt = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  const { productid, quantity } = req.body;

  const cartItem = await Cart.decreaseQnt(userid, productid, quantity);

  res.status(201).json({
    message: "Product Quantity Reduced",
    cartItem,
  });
});

// @desc    Remove Product From Cart
// @route   DELETE  /api/cart/remove
// @access  Buyer/Seller
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  const { productid } = req.body;

  await Cart.remove(userid, productid);

  res.status(200).json({
    message: "Product successfully Removed",
  });
});
