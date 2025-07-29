import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import CalorieCalculator from './CalorieCalculator';
import Modal from './Modal';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, setSidebarOpen }) => {
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
            
            {/* MOVED the button here, inside the main navigation block */}
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
        <CalorieCalculator />
      </Modal>

      {isOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Sidebar;