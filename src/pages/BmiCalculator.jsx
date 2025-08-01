import React, { useState } from 'react';
import styles from './BmiCalculator.module.css';

const BmiCalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  /**
   * Handles changes to input fields.
   * Resets the result display when the user starts editing.
   * @param {Function} setter - The state setter function for the input.
   */
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (showResult) {
      setShowResult(false);
    }
  };

  /**
   * Calculates the BMI and updates the state to show the result.
   * @param {React.FormEvent} e - The form submission event.
   */
  const calculateBmi = (e) => {
    e.preventDefault();
    setShowResult(false); // Reset animation before calculating

    if (!height || !weight) {
      alert('Please enter both height and weight.');
      return;
    }
    
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    
    // Use a short timeout to allow the UI to reset before animating the new result in
    setTimeout(() => {
      setBmiResult({
        value: bmi,
        category: getBmiCategory(bmi),
      });
      setShowResult(true);
    }, 100);
  };

  /**
   * Determines the BMI category based on the calculated value.
   * @param {number} bmi - The calculated BMI value.
   * @returns {string} The corresponding BMI category.
   */
  const getBmiCategory = (bmi) => {
    if (bmi < 16) return 'Severely underweight';
    if (bmi >= 16 && bmi <= 16.9) return 'Moderately underweight';
    if (bmi >= 17 && bmi <= 18.4) return 'Mildly underweight';
    if (bmi >= 18.5 && bmi <= 24.9) return 'Normal';
    if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
    if (bmi >= 30 && bmi <= 34.9) return 'Obese Class I';
    if (bmi >= 35 && bmi <= 39.9) return 'Obese Class II';
    return 'Obese Class III';
  };

  /**
   * Calculates the rotation for the gauge needle based on the BMI value.
   * @returns {number} The rotation degree for the CSS transform.
   */
  const getGaugeRotation = () => {
    if (!bmiResult) return -90;
    // Clamp the BMI value between 10 and 40 for the gauge's visual range
    const clampedBmi = Math.max(10, Math.min(40, bmiResult.value));
    // Convert the BMI value to a rotation degree (-90 to +90)
    return ((clampedBmi - 10) / 30) * 180 - 90;
  };

  /**
   * Gets the descriptive information (icon, title, text) for the current BMI category.
   * @returns {object} An object containing info for the result display.
   */
  const getCategoryInfo = () => {
    if (!bmiResult) {
      return {
        icon: 'ℹ️',
        title: 'Your Result',
        text: 'Enter your height and weight to see your BMI result and its category.',
      };
    }
    switch (bmiResult.category) {
      case 'Severely underweight':
        return { icon: '❗', title: 'Severely Underweight', text: 'Your BMI is critically low. It is highly recommended to consult with a healthcare provider immediately.' };
      case 'Moderately underweight':
        return { icon: '⚠️', title: 'Moderately Underweight', text: 'Your BMI is in a low range. Consulting with a healthcare provider is recommended to ensure you are meeting your nutritional needs.' };
      case 'Mildly underweight':
        return { icon: '📉', title: 'Mildly Underweight', text: 'Your BMI is slightly below the normal range. It could be beneficial to speak with a healthcare provider about your diet.' };
      case 'Normal':
        return { icon: '✅', title: 'Normal', text: 'Your BMI is in the healthy weight range. Keep up the great work with your health and fitness habits!' };
      case 'Overweight':
        return { icon: '⚠️', title: 'Overweight', text: 'A BMI between 25 and 29.9 indicates you may be overweight. Consider consulting a healthcare provider for advice.' };
      case 'Obese Class I':
        return { icon: '❗', title: 'Obese (Class I)', text: 'Your BMI is in the Class I obesity range. It is recommended to speak with a healthcare provider about a health plan.' };
      case 'Obese Class II':
        return { icon: '❗', title: 'Obese (Class II)', text: 'Your BMI is in the Class II obesity range. It is highly recommended to consult with a healthcare provider.' };
      case 'Obese Class III':
        return { icon: '🚨', title: 'Obese (Class III)', text: 'Your BMI is in the most severe obesity range. Please consult with a healthcare provider immediately.' };
      default:
        return {};
    }
  };

  const info = getCategoryInfo();

  return (
    <div className={styles.container}>
      {/* Left Column: Input Form */}
      <div className={styles.formCard}>
        <h2 className={styles.title}>BMI Calculator</h2>
        <p className={styles.subtitle}>Enter your details below to calculate your Body Mass Index.</p>
        <form onSubmit={calculateBmi} className={styles.form}>
          <div className={styles.formGroup}>
            <label>📏 Height (cm)</label>
            <input 
              type="number" 
              value={height} 
              onChange={handleInputChange(setHeight)} 
              placeholder="e.g., 175"
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label>⚖️ Weight (kg)</label>
            <input 
              type="number" 
              value={weight} 
              onChange={handleInputChange(setWeight)} 
              placeholder="e.g., 70"
              required 
            />
          </div>
          <button type="submit" className={styles.calculateButton}>Calculate BMI</button>
        </form>
      </div>

      {/* Right Column: Visual Results */}
      <div className={`${styles.resultsCard} ${showResult ? styles.resultsVisible : ''}`}>
        <div className={styles.gaugeContainer}>
          <div className={styles.gauge}>
            <div className={styles.gaugeFill}></div>
            <div className={styles.gaugeCover}>
              {bmiResult ? (
                <>
                  <span className={styles.bmiValue}>{bmiResult.value}</span>
                  <span className={styles.bmiLabel}>BMI</span>
                </>
              ) : (
                <span className={styles.bmiPlaceholder}>--.-</span>
              )}
            </div>
            <div className={styles.needle} style={{ transform: `rotate(${getGaugeRotation()}deg)` }}></div>
          </div>
        </div>
        <div className={`${styles.infoBox} ${bmiResult ? styles[bmiResult.category.replace(/ /g, '')] : ''}`}>
          <div className={styles.infoIcon}>{info.icon}</div>
          <div className={styles.infoText}>
            <h4>{info.title}</h4>
            <p>{info.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;
