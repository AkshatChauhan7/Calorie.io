import React, { useState, useEffect } from 'react';
import styles from './ProteinCalculator.module.css';
import { proteinAPI } from '../services/api';

const ProteinCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    diet: 'Vegetarian',
    activityLevel: 'Sedentary',
    goal: 'Maintain',
  });
  const [recommendedProtein, setRecommendedProtein] = useState(null);
  const [consumedProtein, setConsumedProtein] = useState(0);
  const [dailyLog, setDailyLog] = useState(null);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

  // Fetch today's protein log
  useEffect(() => {
    const fetchTodaysLog = async () => {
      try {
        const data = await proteinAPI.getForDate(today);
        if (data) {
          setConsumedProtein(data.proteinGrams);
          setDailyLog(data);
        }
      } catch (error) {
        console.error("Failed to fetch today's protein log", error);
      }
    };
    fetchTodaysLog();
  }, [today]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateProtein = (e) => {
    e.preventDefault();
    const { weight, activityLevel, goal } = formData;
    if (!weight) {
      alert('Please enter your weight.');
      return;
    }

    let factor = 1.0;
    if (goal === 'Muscle Gain') {
      factor = 2.2;
    } else {
      switch (activityLevel) {
        case 'Sedentary':
          factor = 0.9;
          break;
        case 'Moderate':
          factor = 1.3;
          break;
        case 'Active':
          factor = 1.8;
          break;
        default:
          factor = 1.0;
      }
    }
    setRecommendedProtein((weight * factor).toFixed(1));
  };

  const handleLogProtein = async () => {
    try {
      const updatedLog = await proteinAPI.log({ date: today, proteinGrams: consumedProtein });
      setDailyLog(updatedLog);
      alert('Protein intake logged successfully!');
    } catch (error) {
      console.error('Failed to log protein', error);
      alert('Failed to log protein intake.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.calculatorCard}>
        <h2 className={styles.title}>Daily Protein Calculator</h2>
        <form onSubmit={calculateProtein} className={styles.form}>
          <div className={styles.grid}>
            {/* Form Fields */}
            <div className={styles.formGroup}><label>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} required /></div>
            <div className={styles.formGroup}><label>Gender</label><select name="gender" value={formData.gender} onChange={handleChange}><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div className={styles.formGroup}><label>Height (cm)</label><input type="number" name="height" value={formData.height} onChange={handleChange} required /></div>
            <div className={styles.formGroup}><label>Weight (kg)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} required /></div>
            <div className={styles.formGroup}><label>Diet Type</label><select name="diet" value={formData.diet} onChange={handleChange}><option>Vegetarian</option><option>Non-Vegetarian</option><option>Vegan</option></select></div>
            <div className={styles.formGroup}><label>Activity Level</label><select name="activityLevel" value={formData.activityLevel} onChange={handleChange}><option>Sedentary</option><option>Moderate</option><option>Active</option></select></div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Fitness Goal</label><select name="goal" value={formData.goal} onChange={handleChange}><option>Weight Loss</option><option>Maintain</option><option>Muscle Gain</option></select></div>
          </div>
          <button type="submit" className={styles.calculateButton}>Calculate My Protein</button>
        </form>

        {recommendedProtein && (
          <div className={styles.resultCard}>
            <h3>Your Recommended Daily Protein Intake</h3>
            <p><span>{recommendedProtein}</span> grams/day</p>
          </div>
        )}
      </div>

      <div className={styles.trackerCard}>
        <h3 className={styles.title}>Track Today's Protein Intake</h3>
        <div className={styles.trackerInputContainer}>
          <input
            type="number"
            value={consumedProtein}
            onChange={(e) => setConsumedProtein(Number(e.target.value))}
            className={styles.trackerInput}
            placeholder="Grams of protein"
          />
          <span className={styles.unit}>grams</span>
        </div>
        <button onClick={handleLogProtein} className={styles.logButton}>Log Protein</button>
      </div>
    </div>
  );
};

export default ProteinCalculator;
