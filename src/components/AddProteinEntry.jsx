import React, { useState } from 'react';
import styles from './AddProteinEntry.module.css';

const AddProteinEntry = ({ onSave, onClose }) => {
  const [foodItem, setFoodItem] = useState('');
  const [proteinGrams, setProteinGrams] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodItem || !proteinGrams) {
      alert('Please fill out all fields.');
      return;
    }
    onSave({ foodItem, proteinGrams });
    onClose(); // Close modal after saving
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Log Protein Intake</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="foodItem">Food Item</label>
          <input
            type="text"
            id="foodItem"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            placeholder="e.g., Chicken Breast, Tofu"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="proteinGrams">Protein (grams)</label>
          <input
            type="number"
            id="proteinGrams"
            value={proteinGrams}
            onChange={(e) => setProteinGrams(e.target.value)}
            placeholder="e.g., 25"
            required
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
          <button type="submit" className={styles.saveButton}>Save Entry</button>
        </div>
      </form>
    </div>
  );
};

export default AddProteinEntry;
