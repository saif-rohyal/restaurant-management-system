// src/models/FoodOrder.js
const mongoose = require('mongoose');

const foodOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
      quantity: { type: Number, default: 1 }
    }
  ],
  roomNumber: { type: String }, // optional if order is for a room
  orderType: { type: String, enum: ['Dine In', 'Takeaway', 'Room Service'], required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodOrder', foodOrderSchema);
