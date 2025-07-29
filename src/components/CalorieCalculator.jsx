import React, { useState, useEffect, useRef } from 'react';
import { FOOD_DATA } from '../utils/helpers';
import styles from './CalorieCalculator.module.css';

const CalorieCalculator = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  // State for the custom searchable dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (selectedFood && amount > 0) {
      const calculation = selectedFood.caloriesPerUnit * amount;
      setTotalCalories(calculation);
    } else {
      setTotalCalories(0);
    }
  }, [selectedFood, amount]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredFoods = Object.entries(FOOD_DATA).filter(([key, food]) =>
    key !== 'unselected' && food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setSearchTerm(food.name);
    setDropdownOpen(false);
  };
  
  const currentUnit = selectedFood?.unit || 'g';

  return (
    <div className={styles.calculator}>
      <div className={styles.inputGroup}>
        {/* Custom Searchable Dropdown */}
        <div className={styles.dropdown} ref={dropdownRef}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a food..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDropdownOpen(true);
              setSelectedFood(null); // Reset selection when typing
            }}
            onFocus={() => setDropdownOpen(true)}
          />
          {isDropdownOpen && (
            <ul className={styles.dropdownList}>
              {filteredFoods.length > 0 ? (
                filteredFoods.map(([key, food]) => (
                  <li key={key} onClick={() => handleSelectFood(food)}>
                    {food.name}
                  </li>
                ))
              ) : (
                <li className={styles.noResults}>No food found</li>
              )}
            </ul>
          )}
        </div>

        <div className={styles.amountContainer}>
          <input 
            type="number" 
            className={styles.amountInput}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            disabled={!selectedFood}
          />
          <span className={styles.unitLabel}>{currentUnit}</span>
        </div>
      </div>
      
      <div className={styles.result}>
        <p>Estimated Calories</p>
        <span className={styles.calorieValue}>{totalCalories.toFixed(0)}</span>
        <span className={styles.kcal}>kcal</span>
      </div>
    </div>
  );
};

export default CalorieCalculator;