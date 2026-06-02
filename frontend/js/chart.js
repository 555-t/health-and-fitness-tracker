document.addEventListener('DOMContentLoaded', async function () {

  var sessionId = localStorage.getItem('buff_session');
  var unitStyle = 'font-size:0.9rem;color:rgba(247,247,247,0.5);';

  var lockLg = '<i class="fa-solid fa-lock" style="font-size:1.4rem;color:rgba(247,247,247,0.2);"></i>';
  var lockSm = '<i class="fa-solid fa-lock" style="font-size:0.95rem;color:rgba(247,247,247,0.2);"></i>';

  function setReminderLocked() {
    var card = document.getElementById('reminderCard');
    if (!card) return;
    card.innerHTML = '<div style="text-align:center;padding:8px 0;">'
      + '<div style="width:56px;height:56px;border-radius:50%;background:rgba(255,77,0,0.1);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,77,0,0.2);margin:0 auto 14px;">'
      + '<i class="fa-solid fa-lock" style="font-size:1.3rem;color:#ff4d00;"></i>'
      + '</div>'
      + '<div style="font-family:\'Raleway\',sans-serif;font-weight:700;font-size:1rem;color:rgba(247,247,247,0.85);margin-bottom:8px;">Log in to set reminders</div>'
      + '<div style="font-size:0.8rem;color:rgba(247,247,247,0.4);line-height:1.6;max-width:240px;margin:0 auto;">Sign in to schedule your workout reminders and never miss a session</div>'
      + '<a href="login.html" style="display:inline-block;margin-top:16px;padding:8px 22px;background:#5be662;color:#2b2e35;font-weight:700;font-size:0.8rem;border-radius:6px;text-decoration:none;font-family:\'Poppins\',sans-serif;letter-spacing:0.5px;">Log In</a>'
      + '</div>';
  }

  // replaces both chart canvas areas with an icon + message card
  function setChartMsg(iconHtml, iconBg, iconBorder, heading, sub, btnLabel, btnHref) {
    var html = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:14px;text-align:center;padding:0 24px 48px;">'
      + '<div style="width:60px;height:60px;border-radius:50%;background:' + iconBg + ';display:flex;align-items:center;justify-content:center;border:1px solid ' + iconBorder + ';">'
      + iconHtml
      + '</div>'
      + '<div>'
      + '<div style="font-family:\'Raleway\',sans-serif;font-weight:700;font-size:1rem;color:rgba(247,247,247,0.85);margin-bottom:6px;">' + heading + '</div>'
      + '<div style="font-size:0.8rem;color:rgba(247,247,247,0.4);max-width:200px;line-height:1.5;">' + sub + '</div>'
      + '</div>'
      + '<a href="' + btnHref + '" style="display:inline-block;padding:8px 22px;background:#5be662;color:#2b2e35;font-weight:700;font-size:0.8rem;border-radius:6px;text-decoration:none;font-family:\'Poppins\',sans-serif;letter-spacing:0.5px;margin-top:2px;">' + btnLabel + '</a>'
      + '</div>';
    document.getElementById('weeklyChart').closest('.chart-canvas-wrap').innerHTML  = html;
    document.getElementById('activityChart').closest('.chart-canvas-wrap').innerHTML = html;
  }

  // not logged in — show locked gate
  if (!sessionId) {
    document.getElementById('statTotalWorkouts').innerHTML = lockLg;
    document.getElementById('statTotalMinutes').innerHTML  = lockLg;
    document.getElementById('statDayStreak').innerHTML     = lockLg;
    document.getElementById('statMostActiveDay').innerHTML = lockLg;
    document.getElementById('pbLongestSession').innerHTML  = lockSm;
    document.getElementById('pbTopActivity').innerHTML     = lockSm;
    document.getElementById('pbBestWeek').innerHTML        = lockSm;
    document.getElementById('pbHighestStreak').innerHTML   = lockSm;
    setChartMsg(
      '<i class="fa-solid fa-lock" style="font-size:1.5rem;color:#ff4d00;"></i>',
      'rgba(255,77,0,0.1)', 'rgba(255,77,0,0.2)',
      'Log in to view your stats',
      'Sign in to track and visualise your fitness progress',
      'Log In', 'login.html'
    );
    setReminderLocked();
    return;
  }

  var response;
  try {
    response = await fetch('/api/progress/summary', {
      headers: { 'x-session-id': sessionId }
    });
  } catch (err) {
    console.error('Network error loading progress data:', err);
    return;
  }

  // session expired — clear it and show locked gate
  if (response.status === 401) {
    localStorage.removeItem('buff_session');
    localStorage.removeItem('buff_token');
    localStorage.removeItem('buff_user');
    document.getElementById('statTotalWorkouts').innerHTML = lockLg;
    document.getElementById('statTotalMinutes').innerHTML  = lockLg;
    document.getElementById('statDayStreak').innerHTML     = lockLg;
    document.getElementById('statMostActiveDay').innerHTML = lockLg;
    document.getElementById('pbLongestSession').innerHTML  = lockSm;
    document.getElementById('pbTopActivity').innerHTML     = lockSm;
    document.getElementById('pbBestWeek').innerHTML        = lockSm;
    document.getElementById('pbHighestStreak').innerHTML   = lockSm;
    setChartMsg(
      '<i class="fa-solid fa-lock" style="font-size:1.5rem;color:#ff4d00;"></i>',
      'rgba(255,77,0,0.1)', 'rgba(255,77,0,0.2)',
      'Session expired',
      'Please log in again to view your progress',
      'Log In', 'login.html'
    );
    setReminderLocked();
    return;
  }

  var data = await response.json();

  // logged in but no workouts logged yet
  if (!data.hasData) {
    var phCardStyle = 'font-size:1.5rem;color:rgba(247,247,247,0.4);';
    var phPbStyle   = 'font-size:1rem;color:rgba(247,247,247,0.4);';
    var phUStyle    = 'font-size:0.8rem;color:rgba(247,247,247,0.3);';
    document.getElementById('statTotalWorkouts').innerHTML = '<span style="' + phCardStyle + '">0</span>';
    document.getElementById('statTotalMinutes').innerHTML  = '<span style="' + phCardStyle + '">0</span>';
    document.getElementById('statDayStreak').innerHTML     = '<span style="' + phCardStyle + '">0</span>';
    document.getElementById('statMostActiveDay').innerHTML = '<span style="' + phCardStyle + '">N/A</span>';
    document.getElementById('pbLongestSession').innerHTML  = '<span style="' + phPbStyle + '">0</span> <span style="' + phUStyle + '">mins</span>';
    document.getElementById('pbTopActivity').innerHTML     = '<span style="' + phPbStyle + '">N/A</span>';
    document.getElementById('pbBestWeek').innerHTML        = '<span style="' + phPbStyle + '">0</span> <span style="' + phUStyle + '">mins</span>';
    document.getElementById('pbHighestStreak').innerHTML   = '<span style="' + phPbStyle + '">0</span> <span style="' + phUStyle + '">days</span>';
    setChartMsg(
      '<i class="fa-solid fa-chart-line" style="font-size:1.5rem;color:#5be662;"></i>',
      'rgba(91,230,98,0.08)', 'rgba(91,230,98,0.15)',
      'No workouts yet',
      'Log your first workout to see your progress here',
      'Start Tracking', 'tracker.html'
    );
    return;
  }

  // populate stats
  document.getElementById('statTotalWorkouts').textContent = data.stats.totalWorkouts;
  document.getElementById('statTotalMinutes').textContent  = data.stats.totalMinutes;
  document.getElementById('statDayStreak').textContent     = data.stats.dayStreak;
  document.getElementById('statMostActiveDay').textContent = data.stats.mostActiveDay;

  document.getElementById('pbLongestSession').innerHTML = data.personalBests.longestSession + ' <span style="' + unitStyle + '">mins</span>';
  document.getElementById('pbTopActivity').textContent  = data.personalBests.topActivity;
  document.getElementById('pbBestWeek').innerHTML       = data.personalBests.bestWeek + ' <span style="' + unitStyle + '">mins</span>';
  document.getElementById('pbHighestStreak').innerHTML  = data.personalBests.highestStreak + ' <span style="' + unitStyle + '">days</span>';

  // weekly line chart
  var weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
  new Chart(weeklyCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Duration (mins)',
        data: data.weeklyData,
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
      plugins: { legend: { display: false } },
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

  // activity breakdown doughnut
  var activityCtx = document.getElementById('activityChart').getContext('2d');
  new Chart(activityCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(data.activityDistribution),
      datasets: [{
        data: Object.values(data.activityDistribution),
        backgroundColor: ['#5be662', '#ff4d00', '#4fc3f7', '#f7c948', '#a78bfa'],
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
