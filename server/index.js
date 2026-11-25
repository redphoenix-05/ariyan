const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

let dbConnection;

function connectDB() {
  if (mongoose.connection.readyState >= 1) return Promise.resolve();

  dbConnection ||= mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      dbConnection = null;
      throw err;
    });

  return dbConnection;
}

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Ensure MongoDB connection before API routes in serverless/Vercel Services mode
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/education', require('./routes/education'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/certificates', require('./routes/certificates'));

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
