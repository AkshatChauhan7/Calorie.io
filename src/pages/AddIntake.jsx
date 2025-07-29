import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AddIntake.module.css';

const AddIntake = ({ handleAddItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemToEdit = location.state?.itemToEdit;
  
  const [formData, setFormData] = useState({
    id: null,
    foodItem: '',
    quantity: '',
    calories: '',
    category: 'Snack'
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        id: itemToEdit.id,
        foodItem: itemToEdit.foodItem,
        quantity: itemToEdit.quantity,
        calories: itemToEdit.calories,
        category: itemToEdit.category
      });
    }
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.foodItem || !formData.calories) {
      alert('Please fill in at least the food item and calories.');
      return;
    }
    handleAddItem(formData);
    // Form is cleared and user redirected by App.jsx logic
  };

  return (
    <div className={styles.formContainer}>
      <h2>{itemToEdit ? 'Edit Calorie Intake' : 'Add Calorie Intake'}</h2>
      <p>Log what you've eaten to keep track of your daily progress.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="foodItem">Food Item</label>
          <input
            type="text"
            id="foodItem"
            name="foodItem"
            value={formData.foodItem}
            onChange={handleChange}
            placeholder="e.g., Apple, Chicken Salad"
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Quantity</label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 1 medium, 200g"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="calories">Estimated Calories</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              placeholder="e.g., 95"
              required
            />
          </div>
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