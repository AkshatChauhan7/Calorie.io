const router = require('express').Router();
let Intake = require('../models/Intake.js');

// --- API Endpoints ---

// GET: Fetch all intake entries, sorted by date
router.route('/').get((req, res) => {
  Intake.find()
    .sort({ date: -1 })
    .then(intakes => res.json(intakes))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Add a new intake entry
router.route('/add').post((req, res) => {
  const { foodItem, quantity, calories, category, date } = req.body;

  const newIntake = new Intake({
    foodItem,
    quantity,
    calories: Number(calories),
    category,
    date: Date.parse(date),
  });

  newIntake.save()
    .then(() => res.json('Intake entry added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE: Remove an intake entry by its ID
router.route('/:id').delete((req, res) => {
    Intake.findByIdAndDelete(req.params.id)
        .then(() => res.json('Intake entry deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// PUT: Update an intake entry by its ID
router.route('/:id').put((req, res) => {
    const { foodItem, quantity, calories, category, date } = req.body;
  
    Intake.findByIdAndUpdate(req.params.id, {
      foodItem,
      quantity,
      calories: Number(calories),
      category,
      date: Date.parse(date),
    }, { new: true })
      .then(updatedIntake => res.json(updatedIntake))
      .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;