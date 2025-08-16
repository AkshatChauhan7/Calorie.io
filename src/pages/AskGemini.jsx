import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './AskGemini.module.css';

const AskGemini = ({ calorieGoal }) => {
  const [mode, setMode] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResponse = async (url, body) => {
    setLoading(true);
    setError(null);
    setResponse('');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to get a response from the server.');
      }
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    handleResponse('http://localhost:5000/api/gemini/ask', { prompt });
  };

  const handleMealSubmit = (e) => {
    e.preventDefault();
    handleResponse('http://localhost:5000/api/gemini/suggest-meal', { ingredients, calorieGoal });
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    if (response) setResponse('');
    if (error) setError(null);
  };

  const handleIngredientsChange = (e) => {
    setIngredients(e.target.value);
    if (response) setResponse('');
    if (error) setError(null);
  };

  // --- NEW FUNCTION TO HANDLE MODE SWITCHING ---
  const handleModeChange = (newMode) => {
    if (mode !== newMode) {
      setMode(newMode);
      setResponse('');
      setError(null);
      setPrompt('');
      setIngredients('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.switchButtons}>
          <button
            className={`${styles.switchButton} ${mode === 'text' ? styles.active : ''}`}
            onClick={() => handleModeChange('text')} // <-- UPDATED THIS LINE
          >
            🤖 Ask Gemini
          </button>
          <button
            className={`${styles.switchButton} ${mode === 'meal' ? styles.active : ''}`}
            onClick={() => handleModeChange('meal')} // <-- UPDATED THIS LINE
          >
            🍳 Meal Suggester
          </button>
        </div>

        {mode === 'text' && (
          <div className={styles.featureContent} key="text-mode">
            <p className={styles.subtitle}>
              Ask any questions you have about nutrition, fitness, or anything else!
            </p>
            <form onSubmit={handleTextSubmit} className={styles.form}>
              <textarea
                className={styles.textarea}
                value={prompt}
                onChange={handlePromptChange}
                placeholder="e.g., What are some high-protein breakfast ideas?"
                data-gramm_editor="false"
                required
              />
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading && mode === 'text' ? 'Thinking...' : 'Ask'}
              </button>
            </form>
          </div>
        )}

        {mode === 'meal' && (
          <div className={styles.featureContent} key="meal-mode">
            <p className={styles.subtitle}>
              List your ingredients and let Gemini suggest a healthy meal!
            </p>
            <form onSubmit={handleMealSubmit} className={styles.form}>
              <textarea
                className={styles.textarea}
                value={ingredients}
                onChange={handleIngredientsChange}
                placeholder="e.g., chicken breast, broccoli, brown rice, olive oil"
                data-gramm_editor="false"
                required
              />
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading && mode === 'meal' ? 'Suggesting...' : 'Suggest a Meal'}
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Gemini is working...</p>
          </div>
        )}
        {error && (
          <div className={styles.errorCard}>
            <h3>An Error Occurred</h3>
            <p>{error}</p>
          </div>
        )}
        {response && (
          <div className={styles.responseCard}>
            {/* THIS H3 TAG IS NOW REMOVED */}
            <div className={styles.markdownResponse}>
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AskGemini;