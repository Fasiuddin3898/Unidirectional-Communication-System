require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const app = express();
const app = require('./app');
const cors = require('cors');

// Middleware
app.use(express.json());

const requestRoutes = require('./routes/requests');
const messageRoutes = require('./routes/messages');

app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);

// Add this before your routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable preflight requests for all routes
app.options('*', cors());

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

/// After DB connection
const initScheduler = require('./services/scheduler');
mongoose.connection.once('open', () => {
  initScheduler();
});

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// app.get('/test', (req, res) => {
//   res.send('Server is working');
// });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});