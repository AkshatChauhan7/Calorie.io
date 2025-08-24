import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddRecipe.module.css'; // We'll create this file next

const AddRecipe = ({ intakeList, handleSaveRecipe }) => {
  const [name, setName] = useState('');
  const [selectedIntakes, setSelectedIntakes] = useState([]);
  const navigate = useNavigate();

  const handleIntakeSelect = (intakeId) => {
    setSelectedIntakes(prev =>
      prev.includes(intakeId)
        ? prev.filter(id => id !== intakeId)
        : [...prev, intakeId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || selectedIntakes.length === 0) {
      alert('Please provide a name and select at least one ingredient.');
      return;
    }
    handleSaveRecipe({ name, ingredients: selectedIntakes });
    navigate('/recipes');
  };

  // Get unique food items from the intake list
  const uniqueIntakeItems = intakeList.reduce((acc, current) => {
    if (!acc.find(item => item.foodItem === current.foodItem)) {
      acc.push(current);
    }
    return acc;
  }, []);


  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.header}>
          <h2>Create a New Recipe</h2>
          <p>Combine your past food entries into a reusable meal.</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Recipe Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., My Awesome Smoothie"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Select Ingredients</label>
          <div className={styles.ingredientList}>
            {uniqueIntakeItems.map(intake => (
              <div
                key={intake._id}
                className={`${styles.ingredientItem} ${selectedIntakes.includes(intake._id) ? styles.selected : ''}`}
                onClick={() => handleIntakeSelect(intake._id)}
              >
                <div className={styles.checkbox}></div>
                <span>{intake.foodItem} ({intake.calories} kcal)</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.cancelButton} onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className={styles.submitButton}>Save Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;