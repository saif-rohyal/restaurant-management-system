// src/controllers/roomController.js
const asyncHandler = require('express-async-handler');
const Room = require('../models/Room');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }
  res.json(room);
});

// @desc    Create a room (admin)
// @route   POST /api/rooms
// @access  Admin
const createRoom = asyncHandler(async (req, res) => {
  const { title, description, pricePerNight, capacity, amenities, images, roomType } = req.body;
  const room = await Room.create({
    title,
    description,
    pricePerNight,
    capacity,
    amenities,
    images,
    roomType,
  });
  res.status(201).json(room);
});

// @desc    Update a room (admin)
// @route   PUT /api/rooms/:id
// @access  Admin
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }
  res.json(room);
});

// @desc    Delete a room (admin)
// @route   DELETE /api/rooms/:id
// @access  Admin
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }
  res.json({ message: 'Room removed' });
});

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };
