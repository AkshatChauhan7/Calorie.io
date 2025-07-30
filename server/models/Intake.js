const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// This is the blueprint for our calorie intake data
const intakeSchema = new Schema({
  foodItem: { type: String, required: true },
  quantity: { type: String, default: '' },
  calories: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
});

const Intake = mongoose.model('Intake', intakeSchema);

module.exports = Intake;