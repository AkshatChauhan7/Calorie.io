import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddIntake from './pages/AddIntake';
import History from './pages/History';
import { calculateTodaysCalories } from './utils/helpers';
import styles from './App.module.css';

const App = () => {
  const [intakeList, setIntakeList] = useState(() => {
    try {
      const localData = localStorage.getItem('intakeList');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error parsing intake list from localStorage", error);
      return [];
    }
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  
  const navigate = useNavigate();
  const CALORIE_GOAL = 2500;

  useEffect(() => {
    localStorage.setItem('intakeList', JSON.stringify(intakeList));
  }, [intakeList]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleAddItem = (item) => {
    const newItem = {
      ...item,
      id: item.id || Date.now(), // Use existing id if editing, else new
      date: new Date().toISOString(),
    };
    
    // If editing, replace the old item; otherwise, add the new one
    const existingIndex = intakeList.findIndex(i => i.id === newItem.id);
    if (existingIndex > -1) {
      const updatedList = [...intakeList];
      updatedList[existingIndex] = newItem;
      setIntakeList(updatedList);
    } else {
      setIntakeList(prevList => [...prevList, newItem]);
    }
    
    navigate('/history');
  };

  const handleDeleteItem = (id) => {
    setIntakeList(intakeList.filter(item => item.id !== id));
  };
  
  const todaysCalories = calculateTodaysCalories(intakeList);

  return (
    <div className={styles.appContainer}>
      <Sidebar isOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.shifted : ''}`}>
        <Navbar 
          todaysCalories={todaysCalories} 
          theme={theme}
          setTheme={setTheme}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
        <main className={styles.pageContent}>
          <Routes>
            <Route path="/" element={<Dashboard intakeList={intakeList} calorieGoal={CALORIE_GOAL} />} />
            <Route path="/add" element={<AddIntake handleAddItem={handleAddItem} />} />
            <Route path="/history" element={<History intakeList={intakeList} handleDeleteItem={handleDeleteItem} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;