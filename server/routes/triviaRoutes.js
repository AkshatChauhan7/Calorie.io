const router = require('express').Router();

// A fun collection of trivia questions
const triviaQuestions = [
  {
    question: "Which of these nuts has the highest protein content per serving?",
    options: ["Almonds", "Walnuts", "Peanuts", "Cashews"],
    answer: "Peanuts"
  },
  {
    question: "What is the primary nutrient that provides the body with its main source of energy?",
    options: ["Protein", "Fats", "Carbohydrates", "Vitamins"],
    answer: "Carbohydrates"
  },
  {
    question: "Which popular vegetable is botanically classified as a fruit?",
    options: ["Carrot", "Broccoli", "Tomato", "Spinach"],
    answer: "Tomato"
  },
  {
    question: "What percentage of the human body is made up of water?",
    options: ["40%", "50%", "60%", "70%"],
    answer: "60%"
  },
  {
    question: "Which vitamin is known as the 'sunshine vitamin' because the body produces it in response to sun exposure?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"],
    answer: "Vitamin D"
  }
];

// GET: Fetch all trivia questions in a random order
router.route('/').get((req, res) => {
  // Shuffle the array to make it different each time
  const shuffledQuestions = triviaQuestions.sort(() => 0.5 - Math.random());
  res.json(shuffledQuestions);
});

module.exports = router;