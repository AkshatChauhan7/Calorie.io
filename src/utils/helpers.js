export const calculateTodaysCalories = (intakeList) => {
  const today = new Date().toISOString().slice(0, 10);
  return intakeList
    .filter(item => item.date.slice(0, 10) === today)
    .reduce((total, item) => total + Number(item.calories), 0);
};

export const calculateTodaysProtein = (intakeList) => {
  const today = new Date().toISOString().slice(0, 10);
  return intakeList
    .filter(item => item.date.slice(0, 10) === today)
    .reduce((total, item) => total + Number(item.protein || 0), 0);
};

// ADDED: New function to calculate today's total carbs
export const calculateTodaysCarbs = (intakeList) => {
  const today = new Date().toISOString().slice(0, 10);
  return intakeList
    .filter(item => item.date.slice(0, 10) === today)
    .reduce((total, item) => total + Number(item.carbs || 0), 0);
};

// ADDED: New function to calculate today's total fats
export const calculateTodaysFats = (intakeList) => {
  const today = new Date().toISOString().slice(0, 10);
  return intakeList
    .filter(item => item.date.slice(0, 10) === today)
    .reduce((total, item) => total + Number(item.fats || 0), 0);
};

export const calculateCalorieGoal = (profile) => {
  // ... (this function remains unchanged)
  const { age, gender, weight, height, activityLevel, goal } = profile;
  if (!age || !gender || !weight || !height || !activityLevel || !goal) { return 2500; }
  let bmr;
  if (gender === 'male') { bmr = 10 * weight + 6.25 * height - 5 * age + 5; } 
  else { bmr = 10 * weight + 6.25 * height - 5 * age - 161; }
  const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extra: 1.9 };
  const tdee = bmr * activityMultipliers[activityLevel];
  let calorieGoal;
  switch (goal) {
    case 'lose': calorieGoal = tdee - 500; break;
    case 'gain': calorieGoal = tdee + 500; break;
    case 'maintain': default: calorieGoal = tdee; break;
  }
  return Math.round(calorieGoal);
};

// --- UPDATED FOOD_DATA with all macros ---
export const FOOD_DATA = {
  'unselected': { name: 'Select a food...', caloriesPerUnit: 0, proteinPerUnit: 0, carbsPerUnit: 0, fatsPerUnit: 0, unit: 'g' },
  'apple': { name: 'Apple (medium)', caloriesPerUnit: 95, proteinPerUnit: 0.5, carbsPerUnit: 25, fatsPerUnit: 0.3, unit: 'qty' },
  'banana': { name: 'Banana (medium)', caloriesPerUnit: 105, proteinPerUnit: 1.3, carbsPerUnit: 27, fatsPerUnit: 0.4, unit: 'qty' },
  'mango': { name: 'Mango (medium)', caloriesPerUnit: 150, proteinPerUnit: 1.4, carbsPerUnit: 38, fatsPerUnit: 0.6, unit: 'qty' },
  'papaya': { name: 'Papaya (1 cup chopped)', caloriesPerUnit: 55, proteinPerUnit: 0.6, carbsPerUnit: 14, fatsPerUnit: 0.2, unit: 'qty' },
  'grapes': { name: 'Grapes (10 grapes)', caloriesPerUnit: 34, proteinPerUnit: 0.4, carbsPerUnit: 9, fatsPerUnit: 0.1, unit: 'qty' },
  'orange': { name: 'Orange (medium)', caloriesPerUnit: 62, proteinPerUnit: 1.2, carbsPerUnit: 15, fatsPerUnit: 0.2, unit: 'qty' },
  'pomegranate': { name: 'Pomegranate (1/2 cup arils)', caloriesPerUnit: 72, proteinPerUnit: 1.5, carbsPerUnit: 16, fatsPerUnit: 1, unit: 'qty' },
  'milk': { name: 'Milk (Whole)', caloriesPerUnit: 0.64, proteinPerUnit: 0.032, carbsPerUnit: 0.048, fatsPerUnit: 0.033, unit: 'ml' },
  'paneer': { name: 'Paneer (Full Fat)', caloriesPerUnit: 2.96, proteinPerUnit: 0.18, carbsPerUnit: 0.012, fatsPerUnit: 0.22, unit: 'g' },
  'tofu': { name: 'Tofu (Firm)', caloriesPerUnit: 1.44, proteinPerUnit: 0.17, carbsPerUnit: 0.02, fatsPerUnit: 0.08, unit: 'g' },
  'yogurt': { name: 'Curd / Yogurt (plain)', caloriesPerUnit: 0.61, proteinPerUnit: 0.1, carbsPerUnit: 0.04, fatsPerUnit: 0.03, unit: 'ml' },
  'almonds': { name: 'Almonds', caloriesPerUnit: 5.79, proteinPerUnit: 0.21, carbsPerUnit: 0.22, fatsPerUnit: 0.49, unit: 'g' },
  'walnuts': { name: 'Walnuts', caloriesPerUnit: 6.9, proteinPerUnit: 0.15, carbsPerUnit: 0.14, fatsPerUnit: 0.65, unit: 'g' },
  'pistachios': { name: 'Pistachios', caloriesPerUnit: 5.7, proteinPerUnit: 0.20, carbsPerUnit: 0.29, fatsPerUnit: 0.44, unit: 'g' },
  'cashews': { name: 'Cashews', caloriesPerUnit: 5.75, proteinPerUnit: 0.19, carbsPerUnit: 0.33, fatsPerUnit: 0.46, unit: 'g' },
  'yellow_lentils': { name: 'Yellow Lentils (cooked)', caloriesPerUnit: 1.15, proteinPerUnit: 0.09, carbsPerUnit: 0.20, fatsPerUnit: 0.005, unit: 'g' },
  'broccoli': { name: 'Broccoli (raw)', caloriesPerUnit: 0.34, proteinPerUnit: 0.028, carbsPerUnit: 0.07, fatsPerUnit: 0.003, unit: 'g' },
  'spinach': { name: 'Spinach (raw)', caloriesPerUnit: 0.23, proteinPerUnit: 0.029, carbsPerUnit: 0.036, fatsPerUnit: 0.004, unit: 'g' },
  'egg': { name: 'Egg (whole, large)', caloriesPerUnit: 78, proteinPerUnit: 6.3, carbsPerUnit: 0.6, fatsPerUnit: 5.3, unit: 'qty' },
  'chicken_breast': { name: 'Chicken Breast (Cooked)', caloriesPerUnit: 1.65, proteinPerUnit: 0.31, carbsPerUnit: 0, fatsPerUnit: 0.036, unit: 'g' },
  'lentils': { name: 'Lentils (Dal, Cooked)', caloriesPerUnit: 1.16, proteinPerUnit: 0.09, carbsPerUnit: 0.2, fatsPerUnit: 0.004, unit: 'g' },
  'peanut_butter': { name: 'Peanut Butter', caloriesPerUnit: 5.88, proteinPerUnit: 0.25, carbsPerUnit: 0.2, fatsPerUnit: 0.5, unit: 'g' },
  'oats': { name: 'Quaker Oats (Raw)', caloriesPerUnit: 3.89, proteinPerUnit: 0.17, carbsPerUnit: 0.66, fatsPerUnit: 0.07, unit: 'g' },
  'alpino_oats': { name: 'Alpino Chocolate Oats', caloriesPerUnit: 4.5, proteinPerUnit: 0.22, carbsPerUnit: 0.55, fatsPerUnit: 0.15, unit: 'g' },
  'roti': { name: 'Roti/Chapati', caloriesPerUnit: 104, proteinPerUnit: 3.1, carbsPerUnit: 18, fatsPerUnit: 2.5, unit: 'qty' },
  'white_rice': { name: 'White Rice (Cooked)', caloriesPerUnit: 1.3, proteinPerUnit: 0.027, carbsPerUnit: 0.28, fatsPerUnit: 0.003, unit: 'g' },
  'brown_rice': { name: 'Brown Rice (Cooked)', caloriesPerUnit: 1.23, proteinPerUnit: 0.026, carbsPerUnit: 0.25, fatsPerUnit: 0.01, unit: 'g' },
  'biscuit_marie': { name: 'Marie Biscuit', caloriesPerUnit: 22, proteinPerUnit: 0.4, carbsPerUnit: 4.5, fatsPerUnit: 0.3, unit: 'qty' },
  'onion': { name: 'Onion (raw)', caloriesPerUnit: 0.4, proteinPerUnit: 0.011, carbsPerUnit: 0.09, fatsPerUnit: 0.001, unit: 'g' },
  'potato': { name: 'Potato (boiled)', caloriesPerUnit: 0.77, proteinPerUnit: 0.017, carbsPerUnit: 0.18, fatsPerUnit: 0.001, unit: 'g' },
  'spinach': { name: 'Spinach (Raw)', caloriesPerUnit: 0.23, proteinPerUnit: 0.029, carbsPerUnit: 0.036, fatsPerUnit: 0.004, unit: 'g' },
  'tomato': { name: 'Tomato', caloriesPerUnit: 0.18, proteinPerUnit: 0.009, carbsPerUnit: 0.039, fatsPerUnit: 0.002, unit: 'g' },
  'carrot': { name: 'Carrot (Raw)', caloriesPerUnit: 0.41, proteinPerUnit: 0.009, carbsPerUnit: 0.1, fatsPerUnit: 0.002, unit: 'g' },
  'cooking_oil': { name: 'Cooking Oil (vegetable)', caloriesPerUnit: 8.8, proteinPerUnit: 0, carbsPerUnit: 0, fatsPerUnit: 1, unit: 'g' },
  'fish': { name: 'Fish (Tilapia, Cooked)', caloriesPerUnit: 1.29, proteinPerUnit: 0.26, carbsPerUnit: 0, fatsPerUnit: 0.027, unit: 'g' },
  'soya_chunks': { name: 'Soya Chunks (Cooked)', caloriesPerUnit: 1.19, proteinPerUnit: 0.16, carbsPerUnit: 0.08, fatsPerUnit: 0.005, unit: 'g' },
  'chickpeas': { name: 'Chickpeas (Cooked)', caloriesPerUnit: 1.64, proteinPerUnit: 0.089, carbsPerUnit: 0.27, fatsPerUnit: 0.026, unit: 'g' },
  'whey_protein': { name: 'Whey Protein (1 scoop)', caloriesPerUnit: 120, proteinPerUnit: 24, carbsPerUnit: 3, fatsPerUnit: 1.5, unit: 'qty' },
  'atom_whey_protein': { name: 'Atom Whey Protein (1 scoop)', caloriesPerUnit: 120, proteinPerUnit: 27, carbsPerUnit: 2, fatsPerUnit: 1, unit: 'qty' }
};
