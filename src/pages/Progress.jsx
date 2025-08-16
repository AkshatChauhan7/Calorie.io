import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import styles from './Progress.module.css';

// Register the 'Filler' plugin for gradient backgrounds
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// A helper function to create the gradient for the line chart
const createGradient = (ctx, area) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.3)');
  return gradient;
};

const Progress = ({ intakeList, theme }) => {
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();

  const calorieData = {
    labels: last7Days.map(date => new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Calories Consumed',
      data: last7Days.map(date =>
        intakeList
          .filter(item => item.date.slice(0, 10) === date)
          .reduce((sum, item) => sum + item.calories, 0)
      ),
      borderColor: '#10b981',
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
          return null; // Return null if chartArea is not defined
        }
        return createGradient(ctx, chartArea);
      },
      fill: true,
      tension: 0.4, // Smoother curve
      borderWidth: 2.5,
      pointBackgroundColor: '#10b981',
      pointHoverRadius: 7,
      pointHoverBackgroundColor: '#ffffff',
      pointHoverBorderColor: '#10b981',
      pointHoverBorderWidth: 2,
    }]
  };

  const today = new Date().toISOString().slice(0, 10);
  const todaysIntake = intakeList.filter(item => item.date.slice(0, 10) === today);
  const totalProtein = todaysIntake.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = todaysIntake.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFats = todaysIntake.reduce((sum, item) => sum + (item.fats || 0), 0);

  const macroData = {
    labels: ['Protein (g)', 'Carbs (g)', 'Fats (g)'],
    datasets: [{
      data: [totalProtein, totalCarbs, totalFats],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 12,
      hoverBorderColor: theme === 'dark' ? '#0f0f23' : '#ffffff', // Use theme color for hover border
      hoverBorderWidth: 4,
    }]
  };
  
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1a1d29';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const tooltipColor = theme === 'dark' ? '#1e1f47' : '#ffffff';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          padding: 20,
          font: { size: 13, weight: '500' },
          usePointStyle: true,
          pointStyle: 'rectRounded'
        }
      },
      title: {
        display: true,
        text: 'Chart Title',
        color: textColor,
        font: { size: 18, weight: '600' },
        padding: { bottom: 25 }
      },
      tooltip: {
        backgroundColor: tooltipColor,
        titleColor: textColor,
        bodyColor: textColor,
        titleFont: { weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
      }
    },
    scales: {
      y: {
        ticks: { color: textColor, font: {size: 13}},
        grid: { color: gridColor, drawBorder: false }
      },
      x: {
        ticks: { color: textColor, font: {size: 13} },
        grid: { display: false }
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Progress Dashboard</h2>
        <p>Visualize your intake history and track your trends over time.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.chartCard}>
          <div className={styles.chartWrapper}>
            <Line options={{...commonOptions, plugins: {...commonOptions.plugins, title: {...commonOptions.plugins.title, text: 'Calories Over Last 7 Days'}}}} data={calorieData} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartWrapper}>
            {todaysIntake.length > 0 ? (
              <Doughnut options={{...commonOptions, scales: {}, plugins: {...commonOptions.plugins, title: {...commonOptions.plugins.title, text: "Today's Macronutrients"}}}} data={macroData} />
            ) : (
              <div className={styles.noDataContainer}>
                <p className={styles.noDataText}>Log an intake to see today's macro distribution.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;