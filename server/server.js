// 1. Import Dependencies
require('dotenv').config({ path: __dirname + '/.env' });
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

// Apply JSON and URL-encoded middleware to all routes EXCEPT the Clarifai route
app.use('/api/intakes', express.json({ limit: '10mb' }));
app.use('/api/intakes', express.urlencoded({ limit: '10mb', extended: true }));
app.use('/api/profile', express.json({ limit: '10mb' }));
app.use('/api/profile', express.urlencoded({ limit: '10mb', extended: true }));
app.use('/api/protein', express.json({ limit: '10mb' }));
app.use('/api/protein', express.urlencoded({ limit: '10mb', extended: true }));


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
// The Clarifai router should be used without the JSON and URL-encoded middleware
app.use('/api/clarifai', clarifaiRouter);

// 6. Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});