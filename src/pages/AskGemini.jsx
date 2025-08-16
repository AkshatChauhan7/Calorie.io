import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './AskGemini.module.css';

const AskGemini = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const res = await fetch('http://localhost:5000/api/gemini/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to get a response from the server.');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🤖 Ask Gemini</h2>
        <p className={styles.subtitle}>
          Ask any questions you have about nutrition, fitness, or anything else!
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., What are some high-protein breakfast ideas?"
            required
          />
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Gemini is thinking...</p>
          </div>
        )}
        {error && (
          <div className={styles.errorCard}>
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}
        {response && (
          <div className={styles.responseCard}>
            <h3>Gemini's Response:</h3>
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