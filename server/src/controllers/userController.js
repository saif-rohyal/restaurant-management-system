// src/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc   Get all users (admin)
// @route  GET /api/users
// @access Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = { getAllUsers };
