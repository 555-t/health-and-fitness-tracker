document.addEventListener('DOMContentLoaded', function () {

  // --- Line Chart: Weekly Workout Duration ---
  const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
  new Chart(weeklyCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Duration (mins)',
        data: [30, 45, 60, 0, 50, 90, 40],
        borderColor: '#5be662',
        backgroundColor: 'rgba(91, 230, 98, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#5be662',
        pointRadius: 5,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { color: 'rgba(247, 247, 247, 0.6)' }
        },
        x: {
          grid: { display: false },
          ticks: { color: 'rgba(247, 247, 247, 0.6)' }
        }
      }
    }
  });

  // --- Doughnut Chart: Activity Distribution ---
  const activityCtx = document.getElementById('activityChart').getContext('2d');
  new Chart(activityCtx, {
    type: 'doughnut',
    data: {
      labels: ['Running', 'Cycling', 'Weightlifting', 'Yoga', 'Swimming'],
      datasets: [{
        data: [5, 2, 3, 1, 1],
        backgroundColor: [
          '#5be662',
          '#ff4d00',
          '#4fc3f7',
          '#f7c948',
          '#a78bfa'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(247, 247, 247, 0.7)',
            padding: 16,
            font: { size: 13 },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    }
  });

});
