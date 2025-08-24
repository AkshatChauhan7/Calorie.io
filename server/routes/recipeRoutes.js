const router = require('express').Router();
let Recipe = require('../models/Recipe.js');

// GET: Fetch all recipes
router.route('/').get((req, res) => {
  Recipe.find()
    .populate('ingredients')
    .then(recipes => res.json(recipes))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Add a new recipe
router.route('/add').post((req, res) => {
  const { name, ingredients } = req.body;

  const newRecipe = new Recipe({
    name,
    ingredients
  });

  newRecipe.save()
    .then(() => res.json('Recipe added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE: Remove a recipe by its ID
router.route('/:id').delete((req, res) => {
    Recipe.findByIdAndDelete(req.params.id)
        .then(() => res.json('Recipe deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;