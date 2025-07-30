import React from 'react';
import { Link } from 'react-router-dom';
import { 
  calculateTodaysCalories, 
  calculateTodaysProtein,
  calculateTodaysCarbs,
  calculateTodaysFats
} from '../utils/helpers';
import styles from './Dashboard.module.css';

const mealIcons = {
  Breakfast: '🥞', Lunch: '🥗', Dinner: '🍛', Snack: '🍎',
};

const Dashboard = ({ intakeList, calorieGoal, proteinGoal, carbsGoal, fatsGoal }) => {
  const todaysCalories = calculateTodaysCalories(intakeList);
  const todaysProtein = calculateTodaysProtein(intakeList);
  const todaysCarbs = calculateTodaysCarbs(intakeList);
  const todaysFats = calculateTodaysFats(intakeList);
  
  const progress = calorieGoal > 0 ? Math.min((todaysCalories / calorieGoal) * 100, 100) : 0;

  const today = new Date().toISOString().slice(0, 10);
  const recentIntakes = intakeList
    .filter(item => item.date.slice(0, 10) === today)
    .slice(-5)
    .reverse();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h2>Today's Summary</h2>
        <Link to="/add" className={styles.addButton}>+ Add Intake</Link>
      </header>

      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.highlightCard}`}>
          <h3>Calories Consumed</h3>
          <p><span>{todaysCalories}</span> / {calorieGoal} kcal</p>
        </div>
        
        <div className={styles.summaryCard}>
          <h3>Protein</h3>
          <p><span>{todaysProtein.toFixed(1)}</span> / {proteinGoal} g</p>
        </div>

        <div className={styles.summaryCard}>
          <h3>Carbs</h3>
          <p><span>{todaysCarbs.toFixed(1)}</span> / {carbsGoal} g</p>
        </div>

        <div className={styles.summaryCard}>
          <h3>Fats</h3>
          <p><span>{todaysFats.toFixed(1)}</span> / {fatsGoal} g</p>
        </div>
      </div>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}>
          <span>{progress.toFixed(0)}% of Calorie Goal</span>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3>Recent Intakes</h3>
        {recentIntakes.length > 0 ? (
          <ul className={styles.recentList}>
            {recentIntakes.map(item => (
              <li key={item._id}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemIcon}>{mealIcons[item.category] || '🍽️'}</span>
                  <div>
                    <span className={styles.itemName}>{item.foodItem}</span>
                    <span className={styles.itemCategory}>{item.category}</span>
                  </div>
                </div>
                <div className={styles.itemMacros}>
                    <span>{item.protein || 0}g P</span>
                    <span>{item.carbs || 0}g C</span>
                    <span>{item.fats || 0}g F</span>
                    <strong>{item.calories} kcal</strong>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noActivity}>No intakes recorded for today. <Link to="/add">Add one now!</Link></p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;