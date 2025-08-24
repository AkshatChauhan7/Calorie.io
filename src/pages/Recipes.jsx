import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import styles from './Recipes.module.css'; // We'll create this file next

const Recipes = ({ handleLogRecipe }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await recipeAPI.getAll();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleDeleteRecipe = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeAPI.delete(id);
        setRecipes(recipes.filter(r => r._id !== id));
      } catch (error) {
        console.error("Failed to delete recipe", error);
      }
    }
  };
  
  const getTotalCalories = (ingredients) => {
    return ingredients.reduce((total, item) => total + item.calories, 0);
  };


  if (loading) return <p>Loading recipes...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Recipes</h2>
        <button onClick={() => navigate('/add-recipe')} className={styles.addButton}>+ Add Recipe</button>
      </div>

      {recipes.length > 0 ? (
        <div className={styles.grid}>
          {recipes.map(recipe => (
            <div key={recipe._id} className={styles.card}>
              <h3>{recipe.name}</h3>
              <p className={styles.totalCalories}>{getTotalCalories(recipe.ingredients)} kcal</p>
              <ul>
                {recipe.ingredients.map(ing => (
                  <li key={ing._id}>{ing.foodItem}</li>
                ))}
              </ul>
              <div className={styles.actions}>
                <button onClick={() => handleLogRecipe(recipe)} className={styles.logButton}>Log Recipe</button>
                <button onClick={() => handleDeleteRecipe(recipe._id)} className={styles.deleteButton}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't created any recipes yet.</p>
      )}
    </div>
  );
};

export default Recipes;