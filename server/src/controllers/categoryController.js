// src/controllers/categoryController.js
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc   Get all categories
// @route  GET /api/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// @desc   Get single category
// @route  GET /api/categories/:id
// @access Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

// @desc   Create category (admin)
// @route  POST /api/categories
// @access Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const existing = await Category.findOne({ name });
  if (existing) {
    res.status(400);
    throw new Error('Category already exists');
  }
  const category = await Category.create({ name, description });
  res.status(201).json(category);
});

// @desc   Update category (admin)
// @route  PUT /api/categories/:id
// @access Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

// @desc   Delete category (admin)
// @route  DELETE /api/categories/:id
// @access Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ message: 'Category removed' });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
