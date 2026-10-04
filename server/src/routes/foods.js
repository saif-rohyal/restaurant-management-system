// src/routes/foods.js
const express = require('express');
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', protect, admin, createFood);
router.put('/:id', protect, admin, updateFood);
router.delete('/:id', protect, admin, deleteFood);

module.exports = router;
