import React, { useState, useEffect, useRef } from 'react';
import { FOOD_DATA } from '../utils/helpers';
import styles from './CalorieCalculator.module.css';

const CalorieCalculator = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);   // ADDED: Carbs state
  const [totalFats, setTotalFats] = useState(0);     // ADDED: Fats state

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (selectedFood && amount > 0) {
      setTotalCalories(selectedFood.caloriesPerUnit * amount);
      setTotalProtein(selectedFood.proteinPerUnit * amount);
      setTotalCarbs(selectedFood.carbsPerUnit * amount);   // ADDED: Calculate carbs
      setTotalFats(selectedFood.fatsPerUnit * amount);     // ADDED: Calculate fats
    } else {
      setTotalCalories(0);
      setTotalProtein(0);
      setTotalCarbs(0);   // ADDED: Reset carbs
      setTotalFats(0);    // ADDED: Reset fats
    }
  }, [selectedFood, amount]);

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
        {/* Searchable Dropdown */}
        <div className={styles.dropdown} ref={dropdownRef}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a food..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDropdownOpen(true);
              setSelectedFood(null);
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

        {/* Amount Input */}
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
      
      {/* UPDATED: Result Display Grid */}
      <div className={styles.resultGrid}>
        <div className={styles.resultItem}>
            <p>Calories</p>
            <span className={styles.value}>{totalCalories.toFixed(0)}</span>
            <span className={styles.unit}>kcal</span>
        </div>
        <div className={styles.resultItem}>
            <p>Protein</p>
            <span className={styles.value}>{totalProtein.toFixed(1)}</span>
            <span className={styles.unit}>g</span>
        </div>
        <div className={styles.resultItem}>
            <p>Carbs</p>
            <span className={styles.value}>{totalCarbs.toFixed(1)}</span>
            <span className={styles.unit}>g</span>
        </div>
        <div className={styles.resultItem}>
            <p>Fats</p>
            <span className={styles.value}>{totalFats.toFixed(1)}</span>
            <span className={styles.unit}>g</span>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;
