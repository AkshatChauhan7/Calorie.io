/**
 * Calculates total calories for a given list of intake items for the current day.
 * @param {Array} intakeList - The list of intake objects.
 * @returns {number} - The total calories for today.
 */
export const calculateTodaysCalories = (intakeList) => {
    const today = new Date().toISOString().slice(0, 10);
    return intakeList
      .filter(item => item.date.slice(0, 10) === today)
      .reduce((total, item) => total + Number(item.calories), 0);
  };
  
  // ... your existing FOOD_DATA object goes below this ...
  export const FOOD_DATA = {
    'unselected': { name: 'Select a food...', caloriesPerUnit: 0, unit: 'g' },
  
    // Fruits (in qty unless eaten chopped)
    'apple': { name: 'Apple (medium)', caloriesPerUnit: 95, unit: 'qty' },
    'banana': { name: 'Banana (medium)', caloriesPerUnit: 105, unit: 'qty' },
    'mango': { name: 'Mango (medium)', caloriesPerUnit: 150, unit: 'qty' },
    'papaya': { name: 'Papaya (1 cup chopped)', caloriesPerUnit: 55, unit: 'qty' },
    'grapes': { name: 'Grapes (10 grapes)', caloriesPerUnit: 34, unit: 'qty' },
    'orange': { name: 'Orange (medium)', caloriesPerUnit: 62, unit: 'qty' },
    'pomegranate': { name: 'Pomegranate (1/2 cup arils)', caloriesPerUnit: 72, unit: 'qty' },
  
    // Dairy & Alternatives
    'milk': { name: 'Milk', caloriesPerUnit: 0.44, unit: 'ml' },
    'paneer': { name: 'Paneer (Full Fat)', caloriesPerUnit: 2.9, unit: 'g' },
    'tofu': { name: 'Tofu (Firm)', caloriesPerUnit: 1.45, unit: 'g' },
    'yogurt': { name: 'Curd / Yogurt (plain)', caloriesPerUnit: 0.61, unit: 'ml' },
  
    // Proteins
    'almonds': { name: 'Almonds', caloriesPerUnit: 5.8, unit: 'g' },
    'egg': { name: 'Egg (whole)', caloriesPerUnit: 78, unit: 'qty' },
    'chicken_breast': { name: 'Chicken Breast (Cooked)', caloriesPerUnit: 1.65, unit: 'g' },
    'lentils': { name: 'Lentils (Dal, Cooked)', caloriesPerUnit: 1.15, unit: 'g' },
    'peanut_butter': { name: 'Peanut Butter', caloriesPerUnit: 5.88, unit: 'g' },
  
    // Grains & Breads
    'oats': { name: 'Quaker Oats (Raw)', caloriesPerUnit: 4.1, unit: 'g' },
    'alpino_oats': { name: 'Alpino Chocolate Oats', caloriesPerUnit: 4.5, unit: 'g' },
    'roti': { name: 'Roti/Chapati', caloriesPerUnit: 95, unit: 'qty' },
    'white_rice': { name: 'White Rice (Cooked)', caloriesPerUnit: 1.3, unit: 'g' },
    'brown_rice': { name: 'Brown Rice (Cooked)', caloriesPerUnit: 1.23, unit: 'g' },
    'biscuit_marie': { name: 'Marie Biscuit', caloriesPerUnit: 22, unit: 'qty' },
  
    // Vegetables (mostly in g for cooked/raw)
    'onion': { name: 'Onion', caloriesPerUnit: 0.4, unit: 'g' },
    'potato': { name: 'Potato (boiled)', caloriesPerUnit: 0.77, unit: 'g' },
    'spinach': { name: 'Spinach (Raw)', caloriesPerUnit: 0.23, unit: 'g' },
    'tomato': { name: 'Tomato', caloriesPerUnit: 0.18, unit: 'g' },
    'carrot': { name: 'Carrot (Raw)', caloriesPerUnit: 0.41, unit: 'g' },
  
    // Fats & Oils
    'cooking_oil': { name: 'Cooking Oil', caloriesPerUnit: 8.8, unit: 'g' },
  };