// src/controllers/foodController.js
const asyncHandler = require('express-async-handler');
const FoodItem = require('../models/FoodItem');
const Category = require('../models/Category');

// @desc   Get all food items (optionally filter by category)
// @route  GET /api/foods
// @access Public
const getFoods = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const foods = await FoodItem.find(filter).populate('category');
  res.json(foods);
});

// @desc   Get single food item
// @route  GET /api/foods/:id
// @access Public
const getFoodById = asyncHandler(async (req, res) => {
  const food = await FoodItem.findById(req.params.id).populate('category');
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  res.json(food);
});

// @desc   Create food item (admin)
// @route  POST /api/foods
// @access Admin
const createFood = asyncHandler(async (req, res) => {
  const { name, description, price, image, category } = req.body;
  const cat = await Category.findById(category);
  if (!cat) {
    res.status(400);
    throw new Error('Invalid category');
  }
  const food = await FoodItem.create({ name, description, price, image, category });
  res.status(201).json(food);
});

// @desc   Update food item (admin)
// @route  PUT /api/foods/:id
// @access Admin
const updateFood = asyncHandler(async (req, res) => {
  const food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  res.json(food);
});

// @desc   Delete food item (admin)
// @route  DELETE /api/foods/:id
// @access Admin
const deleteFood = asyncHandler(async (req, res) => {
  const food = await FoodItem.findByIdAndDelete(req.params.id);
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  res.json({ message: 'Food item removed' });
});

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
