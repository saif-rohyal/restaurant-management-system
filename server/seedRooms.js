require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./src/models/Room');

const rooms = [];

for (let i = 1; i <= 10; i++) {
  rooms.push({
    title: `Room ${100 + i} - 2 Seater`,
    description: 'Comfortable 2-seater room at Khan Restaurant Kalam.',
    pricePerNight: 5000,
    capacity: 2,
    amenities: ['Free WiFi', 'Hot Water', 'Room Service', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85'
    ],
    roomType: 'Standard'
  });
}

for (let i = 1; i <= 10; i++) {
  rooms.push({
    title: `Room ${200 + i} - 4 Seater`,
    description: 'Spacious 4-seater room with comfortable accommodation for families and groups.',
    pricePerNight: 10000,
    capacity: 4,
    amenities: ['Free WiFi', 'Mountain View', 'Hot Water', 'Room Service', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85'
    ],
    roomType: 'Deluxe'
  });
}

for (let i = 1; i <= 10; i++) {
  rooms.push({
    title: `Room ${300 + i} - Family`,
    description: 'Large family room designed for a comfortable family stay in Kalam.',
    pricePerNight: 20000,
    capacity: 6,
    amenities: ['Free WiFi', 'Mountain View', 'Hot Water', 'Room Service', 'Parking', 'TV'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85'
    ],
    roomType: 'Family'
  });
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await Room.deleteMany({});
    console.log('Old rooms cleared');

    const created = await Room.insertMany(rooms);

    console.log(`SUCCESS: ${created.length} rooms created`);

    const counts = await Room.aggregate([
      {
        $group: {
          _id: '$roomType',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('Room summary:');
    console.table(counts);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('SEED ERROR:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
