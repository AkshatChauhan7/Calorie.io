// 1. Import Dependencies
require('dotenv').config({ path: __dirname + '/.env' }); // <-- Always load .env from server folder
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Debug: log that env is loaded
console.log("DEBUG: Loaded CLARIFAI_API_KEY =", process.env.CLARIFAI_API_KEY ? "LOADED" : "NOT LOADED");

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

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
const clarifaiRouter = require('./routes/clarifaiRoutes');

app.use('/api/intakes', intakeRouter);
app.use('/api/profile', profileRouter);
app.use('/api/protein', proteinIntakeRouter);
app.use('/api/clarifai', clarifaiRouter);

// 6. Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
