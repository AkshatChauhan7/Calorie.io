const router = require('express').Router();
let ProteinIntake = require('../models/ProteinIntake.js');

// GET: Fetch protein intake for a specific date
router.route('/:date').get((req, res) => {
  ProteinIntake.findOne({ date: req.params.date })
    .then(proteinIntake => res.json(proteinIntake))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Add or update protein intake for a specific date
router.route('/log').post((req, res) => {
  const { date, proteinGrams } = req.body;

  const query = { date: date };
  const update = { $set: { date, proteinGrams } };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  ProteinIntake.findOneAndUpdate(query, update, options)
    .then(newProteinIntake => res.json(newProteinIntake))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;