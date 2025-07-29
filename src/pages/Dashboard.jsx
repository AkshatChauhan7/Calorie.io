import React from 'react';
import { Link } from 'react-router-dom';
import { calculateTodaysCalories } from '../utils/helpers';
import styles from './Dashboard.module.css';

// Helper object to map categories to icons
const mealIcons = {
  Breakfast: '🥞',
  Lunch: '🥗',
  Dinner: '🍲',
  Snack: '🍿',
};

const Dashboard = ({ intakeList, calorieGoal }) => {
  const todaysCalories = calculateTodaysCalories(intakeList);
  const remainingCalories = calorieGoal - todaysCalories;
  const progress = Math.min((todaysCalories / calorieGoal) * 100, 100);

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
        {/* We will add a highlight class here to make the first card stand out */}
        <div className={`${styles.summaryCard} ${styles.highlightCard}`}>
          <h3>Consumed</h3>
          <p><span>{todaysCalories}</span> kcal</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Goal</h3>
          <p><span>{calorieGoal}</span> kcal</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Remaining</h3>
          <p><span className={remainingCalories < 0 ? styles.negative : ''}>{remainingCalories}</span> kcal</p>
        </div>
      </div>
      
      {/* Redesigned Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}>
          <span>{progress.toFixed(0)}%</span>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3>Recent Intakes</h3>
        {recentIntakes.length > 0 ? (
          <ul className={styles.recentList}>
            {recentIntakes.map(item => (
              <li key={item.id}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemIcon}>{mealIcons[item.category] || '🍽️'}</span>
                  <div>
                    <span className={styles.itemName}>{item.foodItem}</span>
                    <span className={styles.itemCategory}>{item.category}</span>
                  </div>
                </div>
                <span className={styles.itemCalories}>{item.calories} kcal</span>
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