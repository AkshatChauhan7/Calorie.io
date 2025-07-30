const router = require('express').Router();
let Profile = require('../models/Profile.js');

// GET: Fetch the user profile
router.route('/').get((req, res) => {
  Profile.findOne() // Finds the one profile document
    .then(profile => res.json(profile))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Create or Update the user profile
router.route('/update').post((req, res) => {
  const query = {}; // Find any profile document
  const update = req.body; // The new data
  const options = {
    new: true,    // Return the updated document
    upsert: true  // Create the document if it doesn't exist
  };

  Profile.findOneAndUpdate(query, update, options)
    .then(updatedProfile => res.json(updatedProfile))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;