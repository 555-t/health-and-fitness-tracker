console.log("tracker.js loaded");
const API_URL = "http://localhost:5000/api/workout";
const STEPS_API = "http://localhost:5000/api/steps";
const token = localStorage.getItem("token");

function authHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

if (!token) {
    alert("Please log in first");
    window.location.href = "login.html";
}

// ===================== LOAD ON PAGE START =====================
document.addEventListener("DOMContentLoaded", () => {
    loadWorkouts();
});

// ===================== LOAD WORKOUTS =====================
async function loadWorkouts() {
    try {
        const res = await fetch(API_URL, {
            headers: authHeader()
        });

        const data = await res.json();
        renderWorkouts(data);
    } catch (error) {
        console.error("Error loading workouts:", error);
    }
}

// ===================== ADD WORKOUT =====================
document.getElementById("workoutForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const activity = document.getElementById("activity").value;
    const duration = document.getElementById("duration").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    const workout = {
        activity,
        duration,
        date,
        time
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: authHeader(),
            body: JSON.stringify(workout)
        });
        this.reset();
        loadWorkouts();

    } catch (error) {
        console.error("Error adding workout:", error);
    }
});

// ===================== RENDER TABLE =====================
function renderWorkouts(workouts) {
    const tableBody = document.getElementById("workoutTableBody");
    const emptyState = document.getElementById("emptyState");

    tableBody.innerHTML = "";

    if (!workouts || workouts.length === 0) {
        emptyState.style.display = "block";
        return;
    } else {
        emptyState.style.display = "none";
    }

    workouts.forEach(workout => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${workout.date}</td>
            <td>${workout.time}</td>
            <td><span class="badge-activity">${workout.activity}</span></td>
            <td>${workout.duration} min</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteWorkout('${workout._id}')">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// ===================== DELETE WORKOUT =====================
async function deleteWorkout(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: authHeader()
        });
        loadWorkouts();

    } catch (error) {
        console.error("Error deleting workout:", error);
    }
} 

const stepsForm = document.getElementById("stepsForm");
const stepsInput = document.getElementById("stepsInput");
const currentStepsDisplay = document.getElementById("currentStepsDisplay");
const stepsProgressBar = document.getElementById("stepsProgressBar");

const goalSteps = 10000;

// LOAD TODAY STEPS
document.addEventListener("DOMContentLoaded", loadTodaySteps);

async function loadTodaySteps() {
    const res = await fetch(`${STEPS_API}/today`, {
        headers: authHeader()
    });
    const data = await res.json();

    updateUI(data.steps);
}

// ADD STEPS
stepsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const steps = parseInt(stepsInput.value);

    if (!steps || steps <= 0) return;

    const res = await fetch(STEPS_API, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ steps })
    });
    const data = await res.json();

    updateUI(data.totalSteps);

    stepsForm.reset();
});

// UPDATE UI
function updateUI(currentSteps) {
    currentStepsDisplay.innerHTML =
        `${currentSteps} <span style="font-size:1rem; color:rgba(247,247,247,0.5)">/ ${goalSteps} steps</span>`;

    let percent = (currentSteps / goalSteps) * 100;
    if (percent > 100) percent = 100;

    stepsProgressBar.style.width = percent + "%";
}