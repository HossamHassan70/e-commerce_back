const asyncHandler = require("express-async-handler");
const FavList = require("../models/favlistModel");

// @desc    Get User FavList
// @route   GET  /api/favlist
// @access  Buyer/Seller
exports.getList = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  const list = await FavList.get(userid);

  if (list.length === 0) {
    res.status(200).json({ message: "Favorite List is Empty" });
  }

  res.status(200).json({
    list,
  });
});

// @desc    Add product
// @route   POST  /api/favlist
// @access  Buyer/Seller
exports.addToList = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  const { productid } = req.body;
  const listItem = await FavList.add(userid, productid);

  res.status(201).json({
    listItem,
  });
});

// @desc    Remove product From List
// @route   DELETE  /api/favlist/remove
// @access  Buyer/Seller
exports.removeFromList = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  const { productid } = req.body;
  await FavList.remove(userid, productid);

  res.status(200).json({
    message: "Product successfully Removed",
  });
});

// @desc    Empty List
// @route   DELETE  /api/favlist
// @access  Buyer/Seller
exports.emptyList = asyncHandler(async (req, res, next) => {
  const userid = req.user.userid;
  await FavList.empty(userid);

  res.status(200).json({
    message: "Favorite list cleared successfully",
  });
});
