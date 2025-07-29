import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddIntake from './pages/AddIntake';
import History from './pages/History';
import Profile from './pages/Profile'; 
import { calculateTodaysCalories, calculateCalorieGoal } from './utils/helpers';
import styles from './App.module.css';

const App = () => {
  const [intakeList, setIntakeList] = useState(() => {
    const localData = localStorage.getItem('intakeList');
    return localData ? JSON.parse(localData) : [];
  });

  const [userProfile, setUserProfile] = useState(() => {
    const localProfile = localStorage.getItem('userProfile');
    return localProfile ? JSON.parse(localProfile) : {
      age: '', gender: 'female', weight: '', height: '', activityLevel: 'sedentary', goal: 'maintain'
    };
  });
  
  const [calorieGoal, setCalorieGoal] = useState(2500);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  // Update localStorage whenever intakeList or userProfile changes
  useEffect(() => {
    localStorage.setItem('intakeList', JSON.stringify(intakeList));
  }, [intakeList]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    // Recalculate the goal whenever the profile changes
    const newGoal = calculateCalorieGoal(userProfile);
    setCalorieGoal(newGoal);
  }, [userProfile]);

  // Other useEffects for theme and sidebar
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Handler Functions ---
  const handleAddItem = (item) => {
    const newItem = { ...item, id: item.id || Date.now(), date: new Date().toISOString() };
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

  const handleProfileUpdate = (newProfile) => {
    setUserProfile(newProfile);
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
            <Route path="/" element={<Dashboard intakeList={intakeList} calorieGoal={calorieGoal} />} />
            <Route path="/add" element={<AddIntake handleAddItem={handleAddItem} />} />
            <Route path="/history" element={<History intakeList={intakeList} handleDeleteItem={handleDeleteItem} />} />
            {/* Add the new route for the profile page */}
            <Route path="/profile" element={<Profile userProfile={userProfile} handleProfileUpdate={handleProfileUpdate} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;