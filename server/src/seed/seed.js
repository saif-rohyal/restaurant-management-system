// src/seed/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');

const User = require('../models/User');
const Room = require('../models/Room');
const Category = require('../models/Category');
const FoodItem = require('../models/FoodItem');

const seed = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Room.deleteMany(),
      Category.deleteMany(),
      FoodItem.deleteMany(),
    ]);

    // Users
    const adminPassword = await bcrypt.hash('AdminPass123', 10);
    const customerPassword = await bcrypt.hash('CustomerPass123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@khanrestaurant.com',
      password: adminPassword,
      role: 'admin',
    });

    const customer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: customerPassword,
      role: 'customer',
    });

    // Rooms (5)
    const roomsData = [
      {
        title: 'Standard Room',
        description: 'Cozy standard room with basic amenities.',
        pricePerNight: 50,
        capacity: 2,
        amenities: ['Free Wi‑Fi', 'TV', 'Heater'],
        images: [],
        roomType: 'Standard',
      },
      {
        title: 'Deluxe Room',
        description: 'Spacious deluxe room with mountain view.',
        pricePerNight: 80,
        capacity: 3,
        amenities: ['Free Wi‑Fi', 'TV', 'Mini‑Bar', 'Balcony'],
        images: [],
        roomType: 'Deluxe',
      },
      {
        title: 'Family Room',
        description: 'Large room suitable for families, includes extra beds.',
        pricePerNight: 120,
        capacity: 5,
        amenities: ['Free Wi‑Fi', 'TV', 'Sofa Bed', 'Kids Play Area'],
        images: [],
        roomType: 'Family',
      },
      {
        title: 'Mountain View Room',
        description: 'Room with breathtaking view of the Swat mountains.',
        pricePerNight: 150,
        capacity: 2,
        amenities: ['Free Wi‑Fi', 'TV', 'Terrace', 'Fireplace'],
        images: [],
        roomType: 'Mountain View',
      },
      {
        title: 'Premium Suite',
        description: 'Luxury suite with private garden.',
        pricePerNight: 200,
        capacity: 4,
        amenities: ['Free Wi‑Fi', 'TV', 'Jacuzzi', 'Garden'],
        images: [],
        roomType: 'Deluxe',
      },
    ];
    const rooms = await Room.insertMany(roomsData);

    // Categories (8)
    const categoryNames = [
      'BBQ',
      'Karahi',
      'Biryani',
      'Handi',
      'Pakistani Cuisine',
      'Naan & Roti',
      'Fast Food',
      'Desserts',
      'Beverages',
    ];
    const categories = await Category.insertMany(
      categoryNames.map((name) => ({ name }))
    );

    // Food items (15)
    const foodItemsData = [
      { name: 'Chicken BBQ Plate', price: 12, category: categories.find(c => c.name === 'BBQ')._id },
      { name: 'Beef Karahi', price: 15, category: categories.find(c => c.name === 'Karahi')._id },
      { name: 'Mutton Biryani', price: 14, category: categories.find(c => c.name === 'Biryani')._id },
      { name: 'Vegetable Handi', price: 11, category: categories.find(c => c.name === 'Handi')._id },
      { name: 'Nihari (Beef)', price: 13, category: categories.find(c => c.name === 'Pakistani Cuisine')._id },
      { name: 'Naan (Butter)', price: 2, category: categories.find(c => c.name === 'Naan & Roti')._id },
      { name: 'Roti (Plain)', price: 1, category: categories.find(c => c.name === 'Naan & Roti')._id },
      { name: 'Cheese Burger', price: 9, category: categories.find(c => c.name === 'Fast Food')._id },
      { name: 'French Fries', price: 4, category: categories.find(c => c.name === 'Fast Food')._id },
      { name: 'Gulab Jamun', price: 5, category: categories.find(c => c.name === 'Desserts')._id },
      { name: 'Kheer', price: 6, category: categories.find(c => c.name === 'Desserts')._id },
      { name: 'Mint Lemonade', price: 3, category: categories.find(c => c.name === 'Beverages')._id },
      { name: 'Mango Lassi', price: 4, category: categories.find(c => c.name === 'Beverages')._id },
      { name: 'Paneer Tikka', price: 10, category: categories.find(c => c.name === 'BBQ')._id },
      { name: 'Chicken Fried Rice', price: 13, category: categories.find(c => c.name === 'Pakistani Cuisine')._id },
    ];
    await FoodItem.insertMany(foodItemsData);

    console.log('✅ Seed data inserted successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
