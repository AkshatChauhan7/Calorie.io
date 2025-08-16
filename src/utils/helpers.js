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

export const calculateTodaysCarbs = (intakeList) => {
  const today = new Date().toISOString().slice(0, 10);
  return intakeList
    .filter(item => item.date.slice(0, 10) === today)
    .reduce((total, item) => total + Number(item.carbs || 0), 0);
};

export const calculateTodaysFats = (intakeList) => {
  const today = new Date().toISOString().slice(0, 10);
  return intakeList
    .filter(item => item.date.slice(0, 10) === today)
    .reduce((total, item) => total + Number(item.fats || 0), 0);
};

export const calculateCalorieGoal = (profile) => {
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

// --- UPDATED MACRO GOAL CALCULATION TO MATCH PROTEIN CALCULATOR LOGIC ---
export const calculateMacroGoals = (calorieGoal, profile) => {
  const { weight, activityLevel, goal } = profile;

  if (!weight || !calorieGoal || calorieGoal <= 0) {
    return { proteinGoal: 0, carbsGoal: 0, fatsGoal: 0 };
  }

  // 1. Calculate Protein Goal based on the same logic as the Protein Calculator page
  let proteinMultiplier;
  // For 'Muscle Gain', the multiplier is highest
  if (goal === 'gain') {
    proteinMultiplier = 2.2;
  } else {
    // For 'Maintain' or 'Lose', it's based on activity level
    switch (activityLevel) {
      case 'sedentary':
        proteinMultiplier = 0.9;
        break;
      case 'light':
        proteinMultiplier = 1.3;
        break;
      case 'moderate':
        proteinMultiplier = 1.5;
        break;
      case 'active':
        proteinMultiplier = 1.8;
        break;
      case 'extra':
        proteinMultiplier = 2.0;
        break;
      default:
        proteinMultiplier = 1.2;
    }
  }

  const proteinGoal = Math.round(weight * proteinMultiplier);
  const proteinCalories = proteinGoal * 4;

  // 2. Calculate remaining calories for Carbs and Fats
  const remainingCalories = calorieGoal - proteinCalories;

  // 3. Split remaining calories (e.g., 55% Carbs, 35% Fats)
  const carbsGoal = Math.round((remainingCalories * 0.55) / 4);
  const fatsGoal = Math.round((remainingCalories * 0.35) / 9);

  return { proteinGoal, carbsGoal, fatsGoal };
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
  'atom_whey_protein': { name: 'Atom Whey Protein (1 scoop)', caloriesPerUnit: 120, proteinPerUnit: 27, carbsPerUnit: 2, fatsPerUnit: 1, unit: 'qty' },

  // JUNK FOOD
  // Sodas & Drinks
  'coca_cola': { name: 'Coca-Cola (can, 330ml)', caloriesPerUnit: 140, proteinPerUnit: 0, carbsPerUnit: 39, fatsPerUnit: 0, unit: 'qty' },
  'pepsi': { name: 'Pepsi (can, 330ml)', caloriesPerUnit: 150, proteinPerUnit: 0, carbsPerUnit: 41, fatsPerUnit: 0, unit: 'qty' },
  'sprite': { name: 'Sprite (can, 330ml)', caloriesPerUnit: 140, proteinPerUnit: 0, carbsPerUnit: 38, fatsPerUnit: 0, unit: 'qty' },
  'fanta': { name: 'Fanta Orange (can, 330ml)', caloriesPerUnit: 160, proteinPerUnit: 0, carbsPerUnit: 42, fatsPerUnit: 0, unit: 'qty' },
  'frooti': { name: 'Frooti (200ml)', caloriesPerUnit: 100, proteinPerUnit: 0, carbsPerUnit: 25, fatsPerUnit: 0, unit: 'qty' },
  'red_bull': { name: 'Red Bull (250ml can)', caloriesPerUnit: 110, proteinPerUnit: 0, carbsPerUnit: 28, fatsPerUnit: 0, unit: 'qty' },

  // Chips & Salty Snacks
  'lays_classic': { name: "Lay's Classic Chips (small bag, 28g)", caloriesPerUnit: 160, proteinPerUnit: 2, carbsPerUnit: 15, fatsPerUnit: 10, unit: 'qty' },
  'lays_magic_masala': { name: "Lay's Magic Masala (small bag, 28g)", caloriesPerUnit: 155, proteinPerUnit: 2, carbsPerUnit: 16, fatsPerUnit: 9, unit: 'qty' },
  'uncle_chipps': { name: 'Uncle Chipps (small bag, 28g)', caloriesPerUnit: 150, proteinPerUnit: 1.8, carbsPerUnit: 16, fatsPerUnit: 9, unit: 'qty' },
  'kurkure_masala': { name: 'Kurkure Masala Munch (small bag, 28g)', caloriesPerUnit: 150, proteinPerUnit: 2, carbsPerUnit: 18, fatsPerUnit: 8, unit: 'qty' },
  'bingo_mad_angles': { name: 'Bingo Mad Angles (small bag, 36g)', caloriesPerUnit: 190, proteinPerUnit: 2.5, carbsPerUnit: 22, fatsPerUnit: 10, unit: 'qty' },
  'pringles_original': { name: 'Pringles Original (10 chips)', caloriesPerUnit: 150, proteinPerUnit: 1, carbsPerUnit: 15, fatsPerUnit: 9, unit: 'qty' },
  'doritos_nacho_cheese': { name: 'Doritos Nacho Cheese (small bag, 48g)', caloriesPerUnit: 240, proteinPerUnit: 3, carbsPerUnit: 29, fatsPerUnit: 13, unit: 'qty' },
  'cheetos': { name: 'Cheetos Crunchy (small bag, 28g)', caloriesPerUnit: 160, proteinPerUnit: 2, carbsPerUnit: 15, fatsPerUnit: 10, unit: 'qty' },

  // Chocolates & Candy
  'dairy_milk': { name: 'Cadbury Dairy Milk (25g bar)', caloriesPerUnit: 130, proteinPerUnit: 2, carbsPerUnit: 15, fatsPerUnit: 7, unit: 'qty' },
  'kitkat': { name: 'KitKat (4-finger bar)', caloriesPerUnit: 210, proteinPerUnit: 2.7, carbsPerUnit: 27, fatsPerUnit: 11, unit: 'qty' },
  'snickers': { name: 'Snickers (standard bar)', caloriesPerUnit: 250, proteinPerUnit: 4, carbsPerUnit: 33, fatsPerUnit: 12, unit: 'qty' },
  'five_star': { name: 'Cadbury 5 Star (22g bar)', caloriesPerUnit: 100, proteinPerUnit: 1, carbsPerUnit: 15, fatsPerUnit: 4, unit: 'qty' },
  'munch': { name: 'Nestle Munch (10g bar)', caloriesPerUnit: 50, proteinPerUnit: 0.7, carbsPerUnit: 6.8, fatsPerUnit: 2.3, unit: 'qty' },
  'gems': { name: 'Cadbury Gems (small pack)', caloriesPerUnit: 90, proteinPerUnit: 1, carbsPerUnit: 15, fatsPerUnit: 3, unit: 'qty' },

  // Biscuits & Cookies
  'oreo_biscuit': { name: 'Oreo Biscuit', caloriesPerUnit: 53, proteinPerUnit: 0.5, carbsPerUnit: 8.3, fatsPerUnit: 2.3, unit: 'qty' },
  'biscuit_marie': { name: 'Marie Biscuit', caloriesPerUnit: 22, proteinPerUnit: 0.4, carbsPerUnit: 4.5, fatsPerUnit: 0.3, unit: 'qty' },
  'parle_g': { name: 'Parle-G Biscuit', caloriesPerUnit: 25, proteinPerUnit: 0.4, carbsPerUnit: 4.9, fatsPerUnit: 0.5, unit: 'qty' },
  'good_day_cashew': { name: 'Good Day Cashew Biscuit', caloriesPerUnit: 45, proteinPerUnit: 0.6, carbsPerUnit: 6, fatsPerUnit: 2, unit: 'qty' },
  'hide_and_seek': { name: 'Hide & Seek Chocolate Chip Cookie', caloriesPerUnit: 50, proteinPerUnit: 0.6, carbsPerUnit: 6.5, fatsPerUnit: 2.5, unit: 'qty' },
  'britannia_bourbon': { name: 'Britannia Bourbon Biscuit', caloriesPerUnit: 70, proteinPerUnit: 0.8, carbsPerUnit: 10, fatsPerUnit: 3, unit: 'qty' },

  // Noodles & Street Food
  'maggi_noodles': { name: 'Maggi Noodles (1 packet, cooked)', caloriesPerUnit: 385, proteinPerUnit: 8, carbsPerUnit: 54, fatsPerUnit: 15, unit: 'qty' },
  'top_ramen_masala': { name: 'Top Ramen Masala Noodles (1 packet, cooked)', caloriesPerUnit: 350, proteinPerUnit: 7, carbsPerUnit: 50, fatsPerUnit: 13, unit: 'qty' },
  'samosa': { name: 'Samosa (1 piece)', caloriesPerUnit: 260, proteinPerUnit: 4, carbsPerUnit: 24, fatsPerUnit: 17, unit: 'qty' },
  'kachori': { name: 'Kachori (1 piece)', caloriesPerUnit: 190, proteinPerUnit: 3, carbsPerUnit: 18, fatsPerUnit: 12, unit: 'qty' },
  'jalebi': { name: 'Jalebi (1 piece)', caloriesPerUnit: 150, proteinPerUnit: 1, carbsPerUnit: 25, fatsPerUnit: 5, unit: 'qty' },
  'pani_puri': { name: 'Pani Puri (6 pieces)', caloriesPerUnit: 300, proteinPerUnit: 6, carbsPerUnit: 40, fatsPerUnit: 12, unit: 'qty' },
  'vada_pav': { name: 'Vada Pav (1 piece)', caloriesPerUnit: 290, proteinPerUnit: 7, carbsPerUnit: 48, fatsPerUnit: 8, unit: 'qty' },
  'pav_bhaji': { name: 'Pav Bhaji (1 plate)', caloriesPerUnit: 400, proteinPerUnit: 10, carbsPerUnit: 55, fatsPerUnit: 15, unit: 'qty' },
  
  // Fast Food
  'mcaloo_tikki': { name: "McDonald's McAloo Tikki", caloriesPerUnit: 337, proteinPerUnit: 10, carbsPerUnit: 49, fatsPerUnit: 11, unit: 'qty' },
  'mcveggie': { name: "McDonald's McVeggie", caloriesPerUnit: 427, proteinPerUnit: 13, carbsPerUnit: 53, fatsPerUnit: 18, unit: 'qty' },
  'mccrispy_chicken': { name: "McDonald's McChicken Burger", caloriesPerUnit: 426, proteinPerUnit: 21, carbsPerUnit: 42, fatsPerUnit: 20, unit: 'qty' },
  'french_fries_mcd': { name: "McDonald's Fries (medium)", caloriesPerUnit: 320, proteinPerUnit: 4, carbsPerUnit: 42, fatsPerUnit: 15, unit: 'qty' },
  'dominos_margherita': { name: "Domino's Margherita Pizza (1 slice, regular)", caloriesPerUnit: 186, proteinPerUnit: 8.5, carbsPerUnit: 27, fatsPerUnit: 4.6, unit: 'qty' },
  'dominos_peppy_paneer': { name: "Domino's Peppy Paneer Pizza (1 slice, regular)", caloriesPerUnit: 250, proteinPerUnit: 11, carbsPerUnit: 29, fatsPerUnit: 10, unit: 'qty' },
  'pizza_hut_veggie_lover': { name: "Pizza Hut Veggie Lover's (1 slice, medium)", caloriesPerUnit: 240, proteinPerUnit: 10, carbsPerUnit: 29, fatsPerUnit: 9, unit: 'qty' },
  'kfc_fried_chicken': { name: 'KFC Fried Chicken (1 pc, original)', caloriesPerUnit: 320, proteinPerUnit: 19, carbsPerUnit: 11, fatsPerUnit: 21, unit: 'qty' },
  'kfc_zinger_burger': { name: 'KFC Zinger Burger', caloriesPerUnit: 460, proteinPerUnit: 22, carbsPerUnit: 45, fatsPerUnit: 21, unit: 'qty' },
  'subway_veg_delite': { name: 'Subway Veg Delite (6-inch)', caloriesPerUnit: 230, proteinPerUnit: 8, carbsPerUnit: 46, fatsPerUnit: 2.5, unit: 'qty' },
  'subway_paneer_tikka': { name: 'Subway Paneer Tikka (6-inch)', caloriesPerUnit: 380, proteinPerUnit: 18, carbsPerUnit: 47, fatsPerUnit: 13, unit: 'qty' },
  
  // Desserts
  'ice_cream_vanilla': { name: 'Vanilla Ice Cream (1 scoop)', caloriesPerUnit: 137, proteinPerUnit: 2.3, carbsPerUnit: 15.6, fatsPerUnit: 7.3, unit: 'qty' },
  'gulab_jamun': { name: 'Gulab Jamun (1 piece)', caloriesPerUnit: 175, proteinPerUnit: 2, carbsPerUnit: 20, fatsPerUnit: 9, unit: 'qty' },
  'rasgulla': { name: 'Rasgulla (1 piece)', caloriesPerUnit: 140, proteinPerUnit: 4, carbsPerUnit: 30, fatsPerUnit: 0.5, unit: 'qty' },
  'brownie': { name: 'Chocolate Brownie (1 piece)', caloriesPerUnit: 250, proteinPerUnit: 3, carbsPerUnit: 30, fatsPerUnit: 14, unit: 'qty' },
  'donut': { name: 'Glazed Donut (1 piece)', caloriesPerUnit: 260, proteinPerUnit: 3, carbsPerUnit: 31, fatsPerUnit: 14, unit: 'qty' },
};



