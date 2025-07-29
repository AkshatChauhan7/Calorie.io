import React from 'react';
import styles from './Navbar.module.css';

const Navbar = ({ todaysCalories, theme, setTheme, toggleSidebar }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className={styles.navbar}>
      <button className={styles.hamburger} onClick={toggleSidebar}>
        ☰
      </button>
      <div className={styles.dateDisplay}>{today}</div>
      <div className={styles.controls}>
        <div className={styles.calorieInfo}>
          Today's Intake: <strong>{todaysCalories} kcal</strong>
        </div>
        <div className={styles.themeToggle}>
          <input 
            type="checkbox" 
            id="themeSwitch" 
            className={styles.themeCheckbox}
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <label htmlFor="themeSwitch" className={styles.themeLabel}>
            <span className={styles.themeSlider}></span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Navbar;