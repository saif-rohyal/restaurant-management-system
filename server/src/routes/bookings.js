// src/routes/bookings.js
const express = require('express');
const {
  getBookings,
  getMyBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Customer routes
router.get('/my', protect, getMyBookings); // list bookings of logged in user
router.post('/', protect, createBooking);
router.get('/:id', protect, getBookingById);

// Admin routes
router.get('/', protect, admin, getBookings);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.delete('/:id', protect, admin, deleteBooking);

module.exports = router;
