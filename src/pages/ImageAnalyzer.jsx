import React, { useState, useRef } from 'react';
import { clarifaiAPI } from '../services/api';
import styles from './ImageAnalyzer.module.css';

const ImageAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResults([]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select an image file to analyze.');
      return;
    }
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await clarifaiAPI.analyzeUpload(selectedFile);

      if (data.status && data.status.code !== 10000) {
        throw new Error(data.status.description || 'Failed to analyze image.');
      }

      if (data.outputs && data.outputs[0].data.concepts) {
        setResults(data.outputs[0].data.concepts);
      } else {
        throw new Error('No food concepts were found in the image.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.analyzerCard}>
        <h2 className={styles.title}>📸 Analyze Food Image</h2>
        <p className={styles.subtitle}>
          Browse and upload an image to identify the food items within it.
        </p>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        {previewUrl && (
          <div className={styles.imagePreviewContainer}>
            <img src={previewUrl} alt="Selected food" className={styles.imagePreview} />
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button onClick={() => fileInputRef.current.click()} className={styles.browseButton}>
            Browse Image
          </button>
          <button onClick={handleAnalyze} disabled={loading || !selectedFile} className={styles.analyzeButton}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Identifying food...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorCard}>
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className={styles.resultsCard}>
          <h3 className={styles.resultsTitle}>Analysis Results</h3>
          <ul className={styles.resultsList}>
            {results.map((result) => (
              <li key={result.id} className={styles.resultItem}>
                <span className={styles.itemName}>{result.name}</span>
                <span className={styles.itemConfidence}>
                  Confidence: {(result.value * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;