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
        borderColor: '#05be62',
        backgroundColor: 'rgba(5, 190, 98, 0.15)',
        borderWidth: 3,
        pointBackgroundColor: '#05be62',
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
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: '#2b2e35' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#2b2e35' }
        }
      }
    }
  });

  // --- Doughnut Chart: Activity Breakdown ---
  const activityCtx = document.getElementById('activityChart').getContext('2d');
  new Chart(activityCtx, {
    type: 'doughnut',
    data: {
      labels: ['Running', 'Cycling', 'Weightlifting', 'Yoga', 'Swimming'],
      datasets: [{
        data: [5, 2, 3, 1, 1],
        backgroundColor: [
          '#05be62',
          '#ff4d00',
          '#2b2e35',
          '#f7c948',
          '#4fc3f7'
        ],
        borderColor: '#f7f7f7',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#2b2e35',
            padding: 16,
            font: { size: 13 }
          }
        }
      }
    }
  });

});
