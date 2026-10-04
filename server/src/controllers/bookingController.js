// src/controllers/bookingController.js (updated with status update)
const asyncHandler = require('express-async-handler');
const RoomBooking = require('../models/RoomBooking');
const Room = require('../models/Room');

// Get all bookings (admin)
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await RoomBooking.find()
    .populate('user', '-password')
    .populate('room');
  res.json(bookings);
});

// Get bookings for logged‑in customer
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await RoomBooking.find({ user: req.user._id })
    .populate('room');
  res.json(bookings);
});

// Get single booking (owner or admin)
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await RoomBooking.findById(req.params.id)
    .populate('user', '-password')
    .populate('room');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (
    booking.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json(booking);
});

// Create booking (customer)
const createBooking = asyncHandler(async (req, res) => {
  const {
    roomId,
    guestName,
    phone,
    checkIn,
    checkOut,
    numberOfGuests,
    paymentMethod,
  } = req.body;

  // validation
  if (!roomId || !guestName || !phone || !checkIn || !checkOut || !numberOfGuests) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  const room = await Room.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (checkOutDate <= checkInDate) {
    res.status(400);
    throw new Error('Check‑out must be after check‑in');
  }

  // availability check (same logic as earlier)
  const overlapping = await RoomBooking.findOne({
    room: roomId,
    status: { $in: ['pending', 'confirmed', 'checked-in'] },
    $or: [
      { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
    ],
  });
  if (overlapping) {
    res.status(409);
    throw new Error('Room already booked for selected dates');
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const numberOfNights = Math.ceil((checkOutDate - checkInDate) / msPerDay);
  const totalAmount = numberOfNights * room.pricePerNight;

  const booking = await RoomBooking.create({
    user: req.user._id,
    room: roomId,
    guestName,
    phone,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    numberOfGuests,
    numberOfNights,
    pricePerNight: room.pricePerNight,
    totalAmount,
    paymentMethod: paymentMethod || 'cash',
    status: 'pending',
  });

  res.status(201).json(booking);
});

// Update booking status (admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of ${allowed.join(', ')}`);
  }
  const booking = await RoomBooking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )
    .populate('user', '-password')
    .populate('room');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  res.json(booking);
});

// Delete booking (admin)
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await RoomBooking.findByIdAndDelete(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  res.json({ message: 'Booking removed' });
});

module.exports = {
  getBookings,
  getMyBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
