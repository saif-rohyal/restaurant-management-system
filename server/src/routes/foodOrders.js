// src/routes/foodOrders.js
const express = require('express');
const {
  createFoodOrder,
  getAllFoodOrders,
  getMyFoodOrders,
  updateFoodOrderStatus,
} = require('../controllers/foodOrderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Customer routes
router.post('/', protect, createFoodOrder);
router.get('/my', protect, getMyFoodOrders);

// Admin routes
router.get('/', protect, admin, getAllFoodOrders);
router.put('/:id/status', protect, admin, updateFoodOrderStatus);

module.exports = router;
