const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFoundHandler, errorHandler } = require('./middlewares/error');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Other middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/messages', require('./routes/messages'));

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;