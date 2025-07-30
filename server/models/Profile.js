const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  age: { type: Number },
  gender: { type: String, default: 'female' },
  weight: { type: Number },
  height: { type: Number },
  activityLevel: { type: String, default: 'sedentary' },
  goal: { type: String, default: 'maintain' },
}, {
  timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;