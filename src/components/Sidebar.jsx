import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import CalorieCalculator from './CalorieCalculator';
import Modal from './Modal';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, setSidebarOpen, handleSaveItem }) => {
  const [isCalculatorOpen, setCalculatorOpen] = useState(false);

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <h1 className={styles.logo}>Calorie.io</h1>
          <nav className={styles.nav}>
            <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <span className={styles.icon}>📊</span> Dashboard
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <span className={styles.icon}>➕</span> Add Intake
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <span className={styles.icon}>📜</span> History
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <span className={styles.icon}>👤</span> My Profile
            </NavLink>
            {/* New Link for Protein Calculator */}
            <NavLink to="/protein" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <span className={styles.icon}>💪</span> Protein Calculator
            </NavLink>
            <NavLink to="/bmi" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <span className={styles.icon}>⚖️</span> BMI Calculator
            </NavLink>
            
            <button 
              className={styles.calculatorButton} 
              onClick={() => setCalculatorOpen(true)}
            >
              <span className={styles.icon}>🧮</span> Quick Calculator
            </button>
          </nav>
        </div>
      </div>
      
      <Modal isOpen={isCalculatorOpen} onClose={() => setCalculatorOpen(false)}>
        <h2 className={styles.modalTitle}>Quick Calculator</h2>
        <CalorieCalculator handleSaveItem={handleSaveItem} onClose={() => setCalculatorOpen(false)} />
      </Modal>

      {isOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Sidebar;