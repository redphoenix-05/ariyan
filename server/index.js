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

const Profile = require('./models/Profile');
const Education = require('./models/Education');
const Experience = require('./models/Experience');
const Project = require('./models/Project');
const Certificate = require('./models/Certificate');

let dbConnection;

function connectDB() {
  if (mongoose.connection.readyState >= 1) return Promise.resolve();

  dbConnection ||= mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio', {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  })
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

// Combined public portfolio endpoint (1 request + Vercel Edge CDN caching)
app.get('/api/portfolio', async (req, res) => {
  try {
    const [profileDoc, education, experience, projects, certificates] = await Promise.all([
      Profile.findOne().lean(),
      Education.find().sort({ order: 1, startYear: -1 }).lean(),
      Experience.find().sort({ order: 1, startDate: -1 }),
      Project.find().sort({ order: 1, createdAt: -1 }).lean(),
      Certificate.find().sort({ order: 1, createdAt: -1 }).lean(),
    ]);
    const profile = profileDoc || (await Profile.create({})).toObject();
    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.json({ profile, education, experience, projects, certificates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/education', require('./routes/education'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/messages', require('./routes/messages'));

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
