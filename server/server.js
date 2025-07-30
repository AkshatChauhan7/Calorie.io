// 1. Import Dependencies
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors()); 
app.use(express.json());

// 4. Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(() => console.log('Successfully connected to MongoDB!'))
.catch(err => console.error('MongoDB connection error:', err));

// 5. API Routes
const intakeRouter = require('./routes/intakeRoutes');
const profileRouter = require('./routes/profileRoutes');
const proteinIntakeRouter = require('./routes/proteinIntakeRoutes'); // Import new router

app.use('/api/intakes', intakeRouter);
app.use('/api/profile', profileRouter);
app.use('/api/protein', proteinIntakeRouter); // Use new router

// 6. Basic Test Route
app.get('/', (req, res) => {
  res.send('Hello from the Calorie Tracker Backend!');
});

// 7. Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
