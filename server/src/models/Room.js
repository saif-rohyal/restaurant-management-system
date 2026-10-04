// src/models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }], // URLs to images stored elsewhere
  roomType: { type: String, enum: ['Standard', 'Deluxe', 'Family', 'Mountain View'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
