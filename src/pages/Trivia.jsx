import React, { useState, useEffect } from 'react';
import { triviaAPI } from '../services/api';
import styles from './Trivia.module.css';

const Trivia = () => {
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFact = async () => {
    setLoading(true);
    try {
      const data = await triviaAPI.getFact();
      setFact(data.fact);
    } catch (error) {
      console.error("Failed to fetch fact", error);
      setFact('Sorry, I couldn\'t fetch a fun fact right now. Please try again later!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>💡 Daily Trivia Fact</h2>
          <p>Get a new random fact about health and nutrition!</p>
        </div>
        <div className={styles.factContainer}>
          {loading ? (
            <div className={styles.spinner}></div>
          ) : (
            <p className={styles.factText}>"{fact}"</p>
          )}
        </div>
        <button onClick={fetchFact} disabled={loading} className={styles.newFactButton}>
          Get Another Fact
        </button>
      </div>
    </div>
  );
};

export default Trivia;