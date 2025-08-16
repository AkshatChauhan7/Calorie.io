// 1. Import Dependencies
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Apply JSON and URL-encoded middleware to ALL routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 4. Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// 5. API Routes
const intakeRouter = require('./routes/intakeRoutes');
const profileRouter = require('./routes/profileRoutes');
const proteinIntakeRouter = require('./routes/proteinIntakeRoutes');
const geminiRouter = require('./routes/geminiRoutes');

app.use('/api/intakes', intakeRouter);
app.use('/api/profile', profileRouter);
app.use('/api/protein', proteinIntakeRouter);
app.use('/api/gemini', geminiRouter);

// 6. Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});