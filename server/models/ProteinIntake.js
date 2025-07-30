const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const proteinIntakeSchema = new Schema({
  // A field for a user ID can be added here in the future
  // userId: { type: String, required: true }, 
  date: { type: String, required: true, unique: true }, // Store date as "YYYY-MM-DD"
  proteinGrams: { type: Number, required: true, default: 0 },
}, {
  timestamps: true,
});

const ProteinIntake = mongoose.model('ProteinIntake', proteinIntakeSchema);

module.exports = ProteinIntake;
