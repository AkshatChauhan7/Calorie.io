import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AddIntake.module.css';

const AddIntake = ({ handleSaveItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemToEdit = location.state?.itemToEdit;
  
  const [formData, setFormData] = useState({
    id: null,
    foodItem: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',   // ADDED
    fats: '',    // ADDED
    category: 'Snack',
    date: null
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        id: itemToEdit.id,
        foodItem: itemToEdit.foodItem,
        quantity: itemToEdit.quantity,
        calories: itemToEdit.calories,
        protein: itemToEdit.protein || '',
        carbs: itemToEdit.carbs || '',     // ADDED
        fats: itemToEdit.fats || '',       // ADDED
        category: itemToEdit.category,
        date: itemToEdit.date
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
    handleSaveItem(formData);
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
            <input type="text" id="foodItem" name="foodItem" value={formData.foodItem} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="quantity">Quantity</label>
            <input type="text" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
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
            <label htmlFor="calories">Calories</label>
            <input type="number" id="calories" name="calories" value={formData.calories} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="protein">Protein (g)</label>
            <input type="number" id="protein" name="protein" value={formData.protein} onChange={handleChange} />
          </div>

          {/* ADDED: Carbs and Fats Input Fields */}
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
