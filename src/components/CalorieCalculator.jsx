import React, { useState, useEffect, useRef } from 'react';
import { foodSearchAPI } from '../services/api';
import styles from './CalorieCalculator.module.css';

const CalorieCalculator = ({ handleSaveItem, onClose }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('100'); // Default to 100g
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [category, setCategory] = useState('Snack');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        setDropdownOpen(true);
        try {
          const results = await foodSearchAPI.search(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setDropdownOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Recalculate nutrients when amount or selected food changes
  useEffect(() => {
    if (selectedFood && amount > 0) {
      const ratio = amount / 100; // API values are per 100g
      setTotalCalories(selectedFood.calories * ratio);
      setTotalProtein(selectedFood.protein * ratio);
      setTotalCarbs(selectedFood.carbs * ratio);
      setTotalFats(selectedFood.fats * ratio);
    } else {
      setTotalCalories(0);
      setTotalProtein(0);
      setTotalCarbs(0);
      setTotalFats(0);
    }
  }, [selectedFood, amount]);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setSearchTerm(food.name);
    setDropdownOpen(false);
  };

  const handleAddEntry = () => {
    if (!selectedFood || !amount || amount <= 0) {
      alert('Please select a food and enter a valid amount.');
      return;
    }
    const newEntry = {
      foodItem: selectedFood.name,
      quantity: `${amount}g`,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats,
      category: category,
    };
    handleSaveItem(newEntry);
    onClose();
  };
  
  return (
    <div className={styles.calculator}>
      <div className={styles.inputGroup}>
        <div className={styles.dropdown} ref={dropdownRef}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            autoComplete="off"
          />
          {isDropdownOpen && (
            <ul className={styles.dropdownList}>
              {isSearching && <li className={styles.noResults}>Searching...</li>}
              {!isSearching && searchResults.length > 0 && (
                searchResults.map((food) => (
                  <li key={food.id} onClick={() => handleSelectFood(food)}>
                    {food.name}
                  </li>
                ))
              )}
              {!isSearching && searchResults.length === 0 && searchTerm.length > 2 && (
                <li className={styles.noResults}>No results found</li>
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
          <span className={styles.unitLabel}>g</span>
        </div>
        
        <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
      </div>
      
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
      <button onClick={handleAddEntry} className={styles.addEntryButton}>Add Entry</button>
    </div>
  );
};

export default CalorieCalculator;