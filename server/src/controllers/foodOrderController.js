// src/controllers/foodOrderController.js
const asyncHandler = require('express-async-handler');
const FoodOrder = require('../models/FoodOrder');
const FoodItem = require('../models/FoodItem');

// @desc   Create a new food order (customer)
// @route  POST /api/food-orders
// @access Private
const createFoodOrder = asyncHandler(async (req, res) => {
  const { items, roomNumber, orderType } = req.body; // items: [{foodItem, quantity}]
  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }
  // Calculate totalAmount
  let totalAmount = 0;
  for (const { foodItem, quantity } of items) {
    const food = await FoodItem.findById(foodItem);
    if (!food) {
      res.status(404);
      throw new Error('Food item not found');
    }
    totalAmount += food.price * (quantity || 1);
  }

  const order = await FoodOrder.create({
    user: req.user._id,
    items,
    roomNumber,
    orderType,
    totalAmount,
    status: 'pending',
  });

  res.status(201).json(order);
});

// @desc   Get all food orders (admin)
// @route  GET /api/food-orders
// @access Admin
const getAllFoodOrders = asyncHandler(async (req, res) => {
  const orders = await FoodOrder.find()
    .populate('user', '-password')
    .populate('items.foodItem');
  res.json(orders);
});

// @desc   Get current user's orders
// @route  GET /api/food-orders/my
// @access Private
const getMyFoodOrders = asyncHandler(async (req, res) => {
  const orders = await FoodOrder.find({ user: req.user._id })
    .populate('items.foodItem');
  res.json(orders);
});

// @desc   Update order status (admin)
// @route  PUT /api/food-orders/:id/status
// @access Admin
const updateFoodOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of ${allowed.join(', ')}`);
  }
  const order = await FoodOrder.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate('items.foodItem');
  if (!order) {
    res.status(404);
    throw new Error('Food order not found');
  }
  res.json(order);
});

module.exports = {
  createFoodOrder,
  getAllFoodOrders,
  getMyFoodOrders,
  updateFoodOrderStatus,
};
