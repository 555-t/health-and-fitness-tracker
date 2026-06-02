document.addEventListener('DOMContentLoaded', function() {
    // 1. Get the session Token
    const session = localStorage.getItem('buff_session');
    
    if (session) {
        // 2. Simple auth: rely on localStorage.buff_user
        let userName = 'Member';
        const authBtn = document.getElementById('auth-btn');
        if (authBtn) {
            authBtn.innerHTML = `<a class="btn btn-login w-100" href="#" onclick="localStorage.removeItem('buff_token'); localStorage.removeItem('buff_session'); localStorage.removeItem('buff_user'); location.reload();"><i class="fas fa-sign-out-alt mr-2"></i>Sign Out</a>`;
        }
        const user = JSON.parse(localStorage.getItem('buff_user') || 'null');
        if (user && user.name) userName = user.name;

        // 3. Change Hero Section to "Welcome Back"
        const heroArea = document.getElementById('heroAuthArea');
        if (heroArea) {
            heroArea.innerHTML = `<h3 class="font-weight-bold text-white mb-0" style="font-family: 'Raleway', sans-serif;">Welcome back, <span style="color:var(--green);">${userName}</span>!</h3>`;
        }

        // 4. UNLOCK THE DASHBOARD
        const overlay = document.getElementById('lockedOverlay');
        if (overlay) {
            overlay.classList.remove('d-flex');
            overlay.style.display = 'none'; 
        }
        const cards = document.getElementById('dashboardCards');
        if (cards) {
            cards.style.filter = 'none';
            cards.style.opacity = '1';
            cards.style.pointerEvents = 'auto';
        }

        // 5. FETCH DASHBOARD DATA 
        async function loadDashboardData() {
            try {
                // Get todays clean date string (YYYY-MM-DD) to filter daily resets
                const today = new Date().toISOString().split('T')[0];

                // ==========================================
                // --- Fetch Workouts (Active Minutes) ---
                // ==========================================
                const workoutResponse = await fetch('http://localhost:5000/api/tracker/workouts', {
                    method: 'GET',
                    headers: { 'x-session-id': session }
                });

                if (workoutResponse.ok) {
                    const workouts = await workoutResponse.json();
                    
                    let totalMinutes = 0;
                    let lastWorkoutName = "None";
                    let lastWorkoutTime = "Let's get moving!";

                    if (workouts.length > 0) {
                        workouts.forEach(workout => { 
                            // DAILY RESET: Only add minutes if the workout date matches today!
                            if (workout.date === today) {
                                totalMinutes += Number(workout.duration); 
                            }
                        });
                        
                        // Last logged workout overall (even from a previous day)
                        const lastWorkout = workouts[workouts.length - 1];
                        lastWorkoutName = lastWorkout.activity;
                        lastWorkoutTime = `${lastWorkout.date} at ${lastWorkout.time}`;
                    }

                    document.getElementById('active-minutes-display').innerHTML = `${totalMinutes} <span style="font-size: 1rem; color: rgba(247,247,247,0.5);">min</span>`;
                    document.getElementById('last-workout-display').innerText = lastWorkoutName;
                    document.getElementById('last-workout-time').innerText = lastWorkoutTime;
                }

                // ==========================================
                // --- Fetch Nutrition (Calories) ---
                // ==========================================
                const nutritionResponse = await fetch(`http://localhost:5000/api/nutrition/${today}`, {
                    method: 'GET',
                    headers: { 'x-session-id': session }
                });

                if (nutritionResponse.ok) {
                    const nutritionData = await nutritionResponse.json();
                    
                    let totalCalories = 0;
                    if (nutritionData && nutritionData.log && nutritionData.log.length > 0) {
                        nutritionData.log.forEach(item => { 
                            totalCalories += Number(item.cal); 
                        });
                    }

                    // Extract dynamic goal from MongoDB database (defaults to 2000 if not set)
                    let goal = 2000;
                    if (nutritionData && nutritionData.goal && nutritionData.goal.cal) {
                        goal = Number(nutritionData.goal.cal);
                    }

                    // Update UI numbers
                    document.getElementById('calorie-number-display').innerText = totalCalories;
                    const goalDisplay = document.getElementById('calorie-goal-display');
                    if (goalDisplay) {
                        goalDisplay.innerText = goal;
                    }

                    // Calculate SVG progress ring using dynamic goal
                    const percentage = Math.min(totalCalories / goal, 1); 
                    const dashoffset = 364.4 - (364.4 * percentage);
                    document.getElementById('calorie-progress-circle').style.strokeDashoffset = dashoffset;
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        }

        // Run the data fetching cycle!
        loadDashboardData();
    }
});