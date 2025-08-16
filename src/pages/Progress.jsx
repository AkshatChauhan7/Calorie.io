import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './Progress.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Progress = ({ intakeList }) => {
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();

  const calorieData = {
    labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Calories Consumed',
      data: last7Days.map(date =>
        intakeList
          .filter(item => item.date.slice(0, 10) === date)
          .reduce((sum, item) => sum + item.calories, 0)
      ),
      borderColor: 'rgba(16, 185, 129, 1)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.3,
      borderWidth: 2,
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
      borderColor: 'var(--bg-secondary)',
      borderWidth: 3,
    }]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-secondary)',
          padding: 15,
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Chart Title',
        color: 'var(--text-primary)',
        font: { size: 16, weight: '600' },
        padding: { bottom: 20 }
      }
    },
    scales: {
      y: {
        ticks: { color: 'var(--text-secondary)' },
        grid: { color: 'var(--border-light)' }
      },
      x: {
        ticks: { color: 'var(--text-secondary)' },
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
              <p className={styles.noDataText}>Log an intake to see today's macro distribution.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;