import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './History.module.css';
import Modal from '../components/Modal'; // Import your Modal component
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown for formatting

const History = ({ intakeList, handleDeleteItem }) => {
  const navigate = useNavigate();
  // State for managing the modal and its content
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentItemName, setCurrentItemName] = useState('');

  const handleEdit = (item) => {
    navigate('/add', {
      state: {
        itemToEdit: {
          ...item,
          id: item._id
        }
      }
    });
  };

  // Function to call the backend and get a healthy swap suggestion
  const handleSuggestSwap = async (foodItem) => {
    setCurrentItemName(foodItem);
    setIsLoading(true);
    setModalContent('');
    setModalOpen(true);

    try {
      const res = await fetch('http://localhost:5000/api/gemini/suggest-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodItem }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to get a response.');
      }

      const data = await res.json();
      setModalContent(data.response);
    } catch (err) {
      setModalContent(`Sorry, I couldn't find a swap for "${foodItem}" right now.`);
    } finally {
      setIsLoading(false);
    }
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
                      <button onClick={() => handleDeleteItem(item._id)} className={styles.deleteButton}>Delete</button>
                      <button onClick={() => handleSuggestSwap(item.foodItem)} className={styles.swapButton}>Swap</button>
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

      {/* Modal for displaying the swap suggestion */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h3 className={styles.modalTitle}>Healthy Swap for {currentItemName}</h3>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Finding a healthier swap...</p>
          </div>
        ) : (
          <div className={styles.markdownResponse}>
            <ReactMarkdown>{modalContent}</ReactMarkdown>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default History;