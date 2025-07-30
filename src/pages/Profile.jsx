import React, { useState } from 'react';
import styles from './Profile.module.css';

const Profile = ({ userProfile, handleProfileUpdate }) => {
  const [profile, setProfile] = useState(userProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleProfileUpdate(profile);
    alert('Your profile has been updated!'); 
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.header}>
          <h2>My Profile & Goals</h2>
          <p>Update your details to get a personalized calorie goal.</p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="age">Age</label>
            <input type="number" name="age" value={profile.age} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="gender">Gender</label>
            <select name="gender" value={profile.gender} onChange={handleChange} required>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="weight">Weight (kg)</label>
            <input type="number" name="weight" value={profile.weight} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="height">Height (cm)</label>
            <input type="number" name="height" value={profile.height} onChange={handleChange} required />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Activity Level</label>
            <select name="activityLevel" value={profile.activityLevel} onChange={handleChange} required>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Lightly active (exercise 1-3 days/week)</option>
              <option value="moderate">Moderately active (exercise 3-5 days/week)</option>
              <option value="active">Active (exercise 6-7 days a week)</option>
              <option value="extra">Extra active (very hard exercise & physical job)</option>
            </select>
          </div>
          
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Your Goal</label>
            <div className={styles.goalOptions}>
                <button type="button" className={profile.goal === 'lose' ? styles.active : ''} onClick={() => handleChange({ target: { name: 'goal', value: 'lose' } })}>Lose Weight</button>
                <button type="button" className={profile.goal === 'maintain' ? styles.active : ''} onClick={() => handleChange({ target: { name: 'goal', value: 'maintain' } })}>Maintain</button>
                <button type="button" className={profile.goal === 'gain' ? styles.active : ''} onClick={() => handleChange({ target: { name: 'goal', value: 'gain' } })}>Gain Weight</button>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;