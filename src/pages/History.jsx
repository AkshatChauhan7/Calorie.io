import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './History.module.css';

const History = ({ intakeList, handleDeleteItem }) => {
  const navigate = useNavigate();

  const handleEdit = (item) => {
    navigate('/add', { 
      state: { 
        itemToEdit: {
          ...item,
          id: item._id // Pass the database ID for editing
        }
      } 
    });
  };

  // Group intake items by date
  const groupedByDate = intakeList.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className={styles.historyPage}>
      <header className={styles.header}>
        <h2>Intake History</h2>
        <p>A complete log of all your calorie intakes, grouped by day.</p>
      </header>

      {sortedDates.length > 0 ? (
        <div className={styles.timeline}>
          {sortedDates.map(date => (
            <div key={date} className={styles.dateGroup}>
              <h3 className={styles.dateHeading}>{date}</h3>
              <div className={styles.cardGrid}>
                {groupedByDate[date].sort((a,b) => new Date(b.date) - new Date(a.date)).map(item => (
                  <div key={item._id} className={styles.intakeCard}>
                    <div className={styles.cardContent}>
                      <span className={styles.category}>{item.category}</span>
                      <h4 className={styles.foodName}>{item.foodItem}</h4>
                      <p className={styles.calories}>{item.calories} kcal</p>
                      <p className={styles.time}>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className={styles.cardActions}>
                      <button onClick={() => handleEdit(item)} className={styles.editButton}>Edit</button>
                      {/* --- THIS IS THE FIX --- */}
                      {/* Use item._id to ensure the correct database ID is passed */}
                      <button onClick={() => handleDeleteItem(item._id)} className={styles.deleteButton}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noHistory}>
          <h3>No History Found</h3>
          <p>Start by adding a new intake from the dashboard or "Add Intake" page.</p>
        </div>
      )}
    </div>
  );
};

export default History;
