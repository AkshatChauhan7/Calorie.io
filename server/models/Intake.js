const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const intakeSchema = new Schema({
  foodItem: { type: String, required: true },
  quantity: { type: String, default: '' },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },   // ADDED: Carbs field
  fats: { type: Number, default: 0 },      // ADDED: Fats field
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const Intake = mongoose.model('Intake', intakeSchema);

module.exports = Intake;