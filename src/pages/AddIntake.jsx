import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { foodSearchAPI } from '../services/api';
import styles from './AddIntake.module.css';

const AddIntake = ({ handleSaveItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemToEdit = location.state?.itemToEdit;
  
  const [formData, setFormData] = useState({
    id: null,
    foodItem: '',
    quantity: '100',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    category: 'Snack',
    date: null
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        id: itemToEdit.id,
        foodItem: itemToEdit.foodItem,
        quantity: itemToEdit.quantity,
        calories: itemToEdit.calories,
        protein: itemToEdit.protein || '',
        carbs: itemToEdit.carbs || '',
        fats: itemToEdit.fats || '',
        category: itemToEdit.category,
        date: itemToEdit.date
      });
      setSearchTerm(itemToEdit.foodItem);
    }
  }, [itemToEdit]);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
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
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectFood = (food) => {
    setFormData(prev => ({
      ...prev,
      foodItem: food.name,
      // Values are per 100g, quantity is 100 by default
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
    }));
    setSearchTerm(food.name);
    setSearchResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveItem({ ...formData, foodItem: searchTerm });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.header}>
          <h2>{itemToEdit ? 'Edit Intake' : 'Add Intake'}</h2>
          <p>Log your food to track your daily progress.</p>
        </div>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="foodItem">Food Item</label>
            <div className={styles.searchInputContainer}>
              <input
                type="text"
                id="foodItem"
                name="foodItem"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
                autoComplete="off"
              />
              {isSearching && <div className={styles.spinner}></div>}
              {searchResults.length > 0 && (
                <ul className={styles.searchResults}>
                  {searchResults.map(food => (
                    <li key={food.id} onClick={() => handleSelectFood(food)}>
                      {food.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="quantity">Quantity (g)</label>
            <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="calories">Calories (kcal)</label>
            <input type="number" id="calories" name="calories" value={formData.calories} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="protein">Protein (g)</label>
            <input type="number" id="protein" name="protein" value={formData.protein} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="carbs">Carbs (g)</label>
            <input type="number" id="carbs" name="carbs" value={formData.carbs} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fats">Fats (g)</label>
            <input type="number" id="fats" name="fats" value={formData.fats} onChange={handleChange} />
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.cancelButton} onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className={styles.submitButton}>
            {itemToEdit ? 'Update Entry' : 'Add Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIntake;