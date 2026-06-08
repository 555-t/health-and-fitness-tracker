/* =========================
   SESSION HELPERS
========================= */
function getSessionId() {
  return localStorage.getItem('buff_session');
}

/* =========================
   WORKOUT FORM
========================= */
const workoutForm = document.getElementById('workoutForm');

if (workoutForm) {
  workoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sessionId = getSessionId();

    if (!sessionId) {
      alert("Not logged in");
      return;
    }

    const body = {
      activity: document.getElementById('activity').value,
      duration: Number(document.getElementById('duration').value),
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
    };

    console.log("Sending workout:", body);

    try {
      const res = await fetch('/api/tracker/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Workout error:", data);
        alert(data.message || "Failed to add workout");
        return;
      }

      console.log("Saved workout:", data);
      alert("Workout added!");
      loadWorkouts();

      workoutForm.reset();

    } catch (err) {
      console.error("Network error:", err);
      alert("Cannot connect to server");
    }
  });
}

/* =========================
   STEPS FORM
========================= */
const stepsForm = document.getElementById('stepsForm');

if (stepsForm) {
  stepsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sessionId = getSessionId();

    if (!sessionId) {
      alert("Not logged in");
      return;
    }

    const steps = Number(document.getElementById('stepsInput').value);

    if (!steps || steps <= 0) {
      alert("Enter valid steps");
      return;
    }

    try {
      const res = await await fetch('/api/steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          steps,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Steps error:", data);
        alert(data.message || "Failed to update steps");
        return;
      }

      console.log("Steps updated:", data);
      alert("Steps updated!");
      loadSteps();

      stepsForm.reset();

    } catch (err) {
      console.error("Network error:", err);
      alert("Cannot connect to server");
    }
  });
}

/* =========================
   INITIAL DATA LOAD
========================= */
async function loadWorkouts() {
  const sessionId = getSessionId();
  if (!sessionId) return;
  try {
    const res = await fetch('http://localhost:5000/api/tracker/workouts', {
      headers: { 'x-session-id': sessionId }
    });
    if (!res.ok) return;
    const data = await res.json();
    const tbody = document.getElementById('workoutTableBody');
    const emptyState = document.getElementById('emptyState');
    if (!tbody || !emptyState) return;

    tbody.innerHTML = '';
    if (data.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      data.forEach(workout => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${workout.date}</td>
          <td>${workout.time}</td>
          <td><span class="badge badge-activity">${workout.activity}</span></td>
          <td>${workout.duration} min</td>
          <td></td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error("Error loading workouts", err);
  }
}

async function loadSteps() {
  const sessionId = getSessionId();
  if (!sessionId) return;
  try {
    const res = await fetch('http://localhost:5000/api/steps', {
      headers: { 'x-session-id': sessionId }
    });
    if (!res.ok) return;
    const data = await res.json();
    
    // Get today's local date string formatted as YYYY-MM-DD
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const today = (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];
    
    const todayStepsObj = data.find(s => s.date === today);
    const steps = todayStepsObj ? todayStepsObj.steps : 0;
    updateStepsUI(steps);
  } catch (err) {
    console.error("Error loading steps", err);
  }
}

function updateStepsUI(steps) {
  const display = document.getElementById('currentStepsDisplay');
  const bar = document.getElementById('stepsProgressBar');
  if (display) {
    display.innerHTML = `${steps.toLocaleString()} <span style="font-size: 1rem; color: rgba(247,247,247,0.5);">/ 10,000 steps</span>`;
  }
  if (bar) {
    const pct = Math.min((steps / 10000) * 100, 100);
    bar.style.width = `${pct}%`;
  }
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('workoutTableBody')) {
    loadWorkouts();
    loadSteps();
  }
});