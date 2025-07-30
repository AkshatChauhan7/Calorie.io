import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { intakeAPI, profileAPI } from './services/api'; 
import Dashboard from './pages/Dashboard';
import AddIntake from './pages/AddIntake';
import History from './pages/History';
import Profile from './pages/Profile'; 
import ProteinCalculator from './pages/ProteinCalculator';
import { 
  calculateTodaysCalories, 
  calculateCalorieGoal 
} from './utils/helpers';
import styles from './App.module.css';

const App = () => {
  const [intakeList, setIntakeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    age: '', gender: 'female', weight: '', height: '', activityLevel: 'sedentary', goal: 'maintain'
  });
  const [calorieGoal, setCalorieGoal] = useState(2500);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [intakes, profile] = await Promise.all([
          intakeAPI.getAll(),
          profileAPI.get()
        ]);
        
        setIntakeList(intakes);
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading app data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAppData();
  }, []);

  useEffect(() => {
    const newGoal = calculateCalorieGoal(userProfile);
    setCalorieGoal(newGoal);
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // UPDATED: handleSaveItem to include all macros
  const handleSaveItem = async (item) => {
    try {
      setLoading(true);
      const intakeData = {
        foodItem: item.foodItem,
        quantity: item.quantity || '',
        calories: Number(item.calories),
        protein: Number(item.protein || 0),
        carbs: Number(item.carbs || 0),
        fats: Number(item.fats || 0),
        category: item.category,
        date: item.id ? item.date : new Date().toISOString()
      };

      if (item.id) {
        await intakeAPI.update(item.id, intakeData);
      } else {
        await intakeAPI.add(intakeData);
      }
      
      const data = await intakeAPI.getAll();
      setIntakeList(data);
      navigate('/history');
    } catch (error) {
      console.error('Error saving intake:', error);
      alert('Failed to save intake. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      setLoading(true);
      await intakeAPI.delete(id);
      const data = await intakeAPI.getAll();
      setIntakeList(data);
    } catch (error) {
      console.error('Error deleting intake:', error);
      alert('Failed to delete intake. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (newProfile) => {
    try {
      const updatedProfile = await profileAPI.update(newProfile);
      setUserProfile(updatedProfile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };
  
  const todaysCalories = calculateTodaysCalories(intakeList);

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

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
            <Route path="/add" element={<AddIntake handleSaveItem={handleSaveItem} />} />
            <Route path="/history" element={<History intakeList={intakeList} handleDeleteItem={handleDeleteItem} />} />
            <Route path="/profile" element={<Profile userProfile={userProfile} handleProfileUpdate={handleProfileUpdate} />} />
            <Route path="/protein" element={<ProteinCalculator />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
