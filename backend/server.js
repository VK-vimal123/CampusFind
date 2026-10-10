import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import User from './models/User.js';
import Item from './models/Item.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve Uploaded Images Statically
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'Active',
    service: 'CampusFind API',
    endpoints: {
      auth: '/api/auth',
      items: '/api/items'
    }
  });
});

// Seed Initial Campus Data helper
async function seedInitialData() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultUser = await User.create({
        name: 'Kumar CSE',
        studentId: '211423104089',
        email: 'kumar.cse@college.edu',
        department: 'CSE',
        password: 'password123',
        role: 'Student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        isAdmin: false
      });

      const itemCount = await Item.countDocuments();
      if (itemCount === 0) {
        await Item.create([
          {
            title: 'Student ID Card - Vimal Kumar',
            type: 'lost',
            category: 'ID Card',
            description: 'Lost my college Smart ID card near Central Library ground floor. Green lanyard with CSE dept printed on it.',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            location: 'Central Library',
            date: '2026-09-26',
            time: '11:30 AM',
            status: 'Searching',
            reportedBy: defaultUser._id,
            contactName: defaultUser.name,
            contactEmail: defaultUser.email,
            contactPhone: '+91 98765 43210'
          },
          {
            title: 'Black Leather Wallet',
            type: 'found',
            category: 'Wallet',
            description: 'Found a black WildHorn leather wallet containing some cash, metro card, and library token near Canteen entrance bench.',
            image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
            location: 'Campus Canteen',
            date: '2026-09-27',
            time: '01:15 PM',
            status: 'Reported',
            reportedBy: defaultUser._id,
            contactName: 'Ananya Sharma',
            contactEmail: 'ananya.ece@college.edu',
            contactPhone: '+91 98123 45678'
          },
          {
            title: 'Blue Milton Stainless Steel Water Bottle',
            type: 'lost',
            category: 'Other',
            description: 'Left my blue insulated water bottle with stickers in ECE Seminar Hall, 2nd floor.',
            image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
            location: 'ECE Seminar Hall',
            date: '2026-09-25',
            time: '03:45 PM',
            status: 'Searching',
            reportedBy: defaultUser._id,
            contactName: defaultUser.name,
            contactEmail: defaultUser.email,
            contactPhone: '+91 97654 32109'
          },
          {
            title: '65W Type-C Laptop Charger',
            type: 'found',
            category: 'Charger',
            description: 'Found a black Lenovo 65W USB Type-C power adapter plugged into power socket in Lab 3, CSE Block.',
            image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
            location: 'CSE Block Lab 3',
            date: '2026-09-27',
            time: '05:00 PM',
            status: 'Reported',
            reportedBy: defaultUser._id,
            contactName: 'Dr. K. Rajesh',
            contactEmail: 'rajesh.faculty@college.edu',
            contactPhone: '+91 94440 12345'
          }
        ]);
        console.log('Sample campus items seeded successfully.');
      }
    }
  } catch (err) {
    console.log('Seeding note:', err.message);
  }
}

// Connect MongoDB & Start Server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusfind';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' Connected to MongoDB Database');
    seedInitialData();
    app.listen(PORT, () => {
      console.log(` CampusFind Backend API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB Connection Notice:', err.message);
    console.log(' Starting server in standalone mode...');
    app.listen(PORT, () => {
      console.log(` CampusFind Backend API running on http://localhost:${PORT}`);
    });
  });
