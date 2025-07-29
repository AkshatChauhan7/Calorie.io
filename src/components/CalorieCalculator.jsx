import React, { useState, useEffect } from 'react';
import { FOOD_DATA } from '../utils/helpers';
import styles from './CalorieCalculator.module.css';

const CalorieCalculator = () => {
  const [selectedFood, setSelectedFood] = useState('unselected');
  const [amount, setAmount] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    if (selectedFood !== 'unselected' && amount > 0) {
      const food = FOOD_DATA[selectedFood];
      const calculation = food.caloriesPerUnit * amount;
      setTotalCalories(calculation);
    } else {
      setTotalCalories(0);
    }
  }, [selectedFood, amount]);
  
  const currentUnit = FOOD_DATA[selectedFood]?.unit || 'g';

  return (
    <div className={styles.calculator}>
      <div className={styles.inputGroup}>
        <select 
          className={styles.foodSelect}
          value={selectedFood} 
          onChange={(e) => setSelectedFood(e.target.value)}
        >
          {Object.entries(FOOD_DATA).map(([key, { name }]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
        <div className={styles.amountContainer}>
          <input 
            type="number" 
            className={styles.amountInput}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            disabled={selectedFood === 'unselected'}
          />
          <span className={styles.unitLabel}>{currentUnit}</span>
        </div>
      </div>
      <div className={styles.total}>
        Estimated Calories: <span>{totalCalories.toFixed(0)} kcal</span>
      </div>
    </div>
  );
};

export default CalorieCalculator;