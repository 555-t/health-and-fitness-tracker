// =====================================================================
//  LOCAL MEALS DATABASE (Phase 2 - local JSON, no API needed)
// =====================================================================
const MEALS_DB = [
    // ── Breakfast ──
    { id: 1, name: "Grilled Chicken Breast", desc: "Lean protein powerhouse with minimal fat. Perfect post-workout.", emoji: "🍗", cal: 165, protein: 31, carbs: 0, fat: 3.6, serving: 100, mealType: "Lunch", tags: ["High Protein", "Low Carb", "Cutting"] },
    { id: 2, name: "Brown Rice & Tuna Bowl", desc: "Complex carbs with high protein for sustained energy.", emoji: "🍚", cal: 320, protein: 28, carbs: 42, fat: 4, serving: 300, mealType: "Lunch", tags: ["High Protein", "Bulking"] },
    { id: 3, name: "Greek Yogurt Parfait", desc: "High protein breakfast with probiotics and antioxidants.", emoji: "🫙", cal: 180, protein: 17, carbs: 20, fat: 3, serving: 200, mealType: "Breakfast", tags: ["High Protein", "Cutting", "Vegetarian"] },
    { id: 4, name: "Oatmeal & Banana", desc: "Slow-release carbs for long-lasting morning energy.", emoji: "🥣", cal: 290, protein: 8, carbs: 58, fat: 5, serving: 250, mealType: "Breakfast", tags: ["Bulking", "Vegetarian"] },
    { id: 5, name: "Egg White Omelette", desc: "Ultra-lean protein breakfast with veggies.", emoji: "🍳", cal: 120, protein: 22, carbs: 3, fat: 1.5, serving: 200, mealType: "Breakfast", tags: ["High Protein", "Low Carb", "Cutting"] },
    { id: 6, name: "Salmon & Asparagus", desc: "Omega-3 rich fish with low-cal greens.", emoji: "🐟", cal: 280, protein: 34, carbs: 6, fat: 13, serving: 250, mealType: "Dinner", tags: ["High Protein", "Low Carb", "Cutting"] },
    { id: 7, name: "Beef & Sweet Potato", desc: "Nutrient-dense combo for muscle building.", emoji: "🥩", cal: 420, protein: 35, carbs: 45, fat: 10, serving: 350, mealType: "Dinner", tags: ["High Protein", "Bulking"] },
    { id: 8, name: "Protein Smoothie", desc: "Whey protein, banana, milk & peanut butter.", emoji: "🥤", cal: 380, protein: 38, carbs: 40, fat: 9, serving: 400, mealType: "Snack", tags: ["High Protein", "Bulking"] },
    { id: 9, name: "Mixed Nuts & Seeds", desc: "Healthy fats and micronutrients in a convenient snack.", emoji: "🥜", cal: 200, protein: 6, carbs: 8, fat: 17, serving: 40, mealType: "Snack", tags: ["Low Carb", "Vegetarian"] },
    { id: 10, name: "Lentil & Veggie Soup", desc: "Plant-based protein with fibre-rich vegetables.", emoji: "🥣", cal: 230, protein: 16, carbs: 38, fat: 2, serving: 350, mealType: "Dinner", tags: ["Vegetarian", "Cutting"] },
    { id: 11, name: "Cottage Cheese Bowl", desc: "Slow-digesting casein protein, great before bed.", emoji: "🧀", cal: 150, protein: 20, carbs: 7, fat: 4, serving: 200, mealType: "Snack", tags: ["High Protein", "Low Carb", "Cutting", "Vegetarian"] },
    { id: 12, name: "Chicken Rice Meal Prep", desc: "Bodybuilder classic – bulk of protein and clean carbs.", emoji: "🍱", cal: 480, protein: 45, carbs: 55, fat: 7, serving: 400, mealType: "Lunch", tags: ["High Protein", "Bulking"] },
    // ── Everyday / Malaysian foods ──
    { id: 13, name: "Nasi Lemak", desc: "Coconut rice with sambal, egg and anchovies — a Malaysian staple.", emoji: "🍛", cal: 644, protein: 17, carbs: 72, fat: 32, serving: 300, mealType: "Breakfast", tags: ["Bulking"] },
    { id: 14, name: "Roti Canai", desc: "Flaky flatbread with dhal or curry sauce.", emoji: "🫓", cal: 301, protein: 7, carbs: 43, fat: 12, serving: 150, mealType: "Breakfast", tags: ["Vegetarian"] },
    { id: 15, name: "Milo (Hot / Cold)", desc: "Chocolate malt drink — popular Malaysian energy drink.", emoji: "☕", cal: 124, protein: 3, carbs: 22, fat: 3, serving: 250, mealType: "Breakfast", tags: ["Vegetarian"] },
    { id: 16, name: "Char Kway Teow", desc: "Stir-fried flat rice noodles with egg, prawns and bean sprouts.", emoji: "🍜", cal: 490, protein: 18, carbs: 62, fat: 19, serving: 300, mealType: "Lunch", tags: ["Bulking"] },
    { id: 17, name: "Nasi Goreng", desc: "Malaysian fried rice with egg, vegetables and kecap manis.", emoji: "🍳", cal: 430, protein: 12, carbs: 65, fat: 14, serving: 300, mealType: "Lunch", tags: ["Bulking"] },
    { id: 18, name: "Teh Tarik", desc: "Pulled milk tea — sweet and creamy Malaysian favourite.", emoji: "🧋", cal: 145, protein: 4, carbs: 22, fat: 4, serving: 250, mealType: "Snack", tags: ["Vegetarian"] },
    { id: 19, name: "Ayam Goreng", desc: "Malaysian fried chicken — crispy on outside, juicy inside.", emoji: "🍗", cal: 290, protein: 27, carbs: 8, fat: 17, serving: 150, mealType: "Dinner", tags: ["High Protein"] },
    { id: 20, name: "White Rice (steamed)", desc: "Plain steamed white rice — everyday Malaysian carb staple.", emoji: "🍚", cal: 206, protein: 4, carbs: 45, fat: 0, serving: 150, mealType: "Lunch", tags: ["Bulking", "Vegetarian"] },
    { id: 21, name: "Boiled Egg", desc: "Simple whole egg — great protein source for any meal.", emoji: "🥚", cal: 78, protein: 6, carbs: 1, fat: 5, serving: 50, mealType: "Snack", tags: ["High Protein", "Low Carb", "Cutting", "Vegetarian"] },
    { id: 22, name: "Banana", desc: "Quick natural energy boost, rich in potassium.", emoji: "🍌", cal: 105, protein: 1, carbs: 27, fat: 0, serving: 120, mealType: "Snack", tags: ["Bulking", "Vegetarian"] },
    { id: 23, name: "Tofu Stir-fry", desc: "High-protein plant-based dish with mixed vegetables.", emoji: "🥗", cal: 180, protein: 14, carbs: 10, fat: 9, serving: 200, mealType: "Dinner", tags: ["High Protein", "Low Carb", "Vegetarian", "Cutting"] },
    { id: 24, name: "Whole Wheat Bread (2 slices)", desc: "Fibre-rich bread great for a balanced breakfast.", emoji: "🍞", cal: 138, protein: 6, carbs: 26, fat: 2, serving: 60, mealType: "Breakfast", tags: ["Vegetarian"] },
];

// =====================================================================
//  STORAGE KEYS
// =====================================================================
const KEY_LOG = "buff_nutrition_log";
const KEY_GOAL = "buff_nutrition_goal";
const KEY_DATE = "buff_nutrition_date";
const KEY_BURNED = "buff_nutrition_burned";

// =====================================================================
//  STATE
// =====================================================================
let state = {
    goal: { cal: 2000, prot: 150, carb: 200, fat: 65 },
    log: [],   // { name, mealType, serving, cal, prot, carb, fat }
    burned: 0,
    activeFilter: "all",
};

function isLoggedIn() {
    return !!localStorage.getItem('buff_session');
}

// =====================================================================
//  API HELPERS (MongoDB)
// =====================================================================
async function saveToStorage() {
    const session = localStorage.getItem('buff_session');
    if (!session) return; // Guest check already handled upstream

    const today = getTodayStr();
    try {
        await fetch('/api/nutrition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-id': session
            },
            body: JSON.stringify({
                date: today,
                goal: state.goal,
                log: state.log,
                burned: state.burned
            })
        });
    } catch (err) {
        console.error("Failed to save nutrition log:", err);
    }
}

async function loadFromStorage() {
    const session = localStorage.getItem('buff_session');
    if (!session) return; // Not logged in

    const today = getTodayStr();
    try {
        const res = await fetch(`/api/nutrition/${today}`, {
            headers: {
                'x-session-id': session
            }
        });

        if (res.ok) {
            const data = await res.json();
            if (data && data.goal) {
                state.goal = data.goal;
                state.log = data.log || [];
                state.burned = data.burned || 0;
            }
        }
    } catch (err) {
        console.error("Failed to load nutrition log:", err);
    }
}

function getTodayStr() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// =====================================================================
//  INIT
// =====================================================================
async function init() {
    await loadFromStorage();

    // Prefill goal inputs from saved values
    document.getElementById("calGoalInput").value = state.goal.cal;
    document.getElementById("protGoal").value = state.goal.prot;
    document.getElementById("carbGoal").value = state.goal.carb;
    document.getElementById("fatGoal").value = state.goal.fat;

    // Prefill burned calories input
    const burnedInput = document.getElementById("burnedInput");
    if (burnedInput) burnedInput.value = state.burned || "";

    // Set today's date
    const d = new Date();
    document.getElementById("logDate").textContent =
        d.toLocaleDateString("en-MY", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    renderMeals();
    renderLog();
    updateSummary();

    // Filter pills
    document.querySelectorAll(".filter-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            state.activeFilter = pill.dataset.filter;
            renderMeals();
        });
    });
}

// =====================================================================
//  GOAL
// =====================================================================
function setGoal() {
    if (!isLoggedIn()) { showGuestModal("Oh no! Log in to save your progress!"); return; }
    const cal = parseInt(document.getElementById("calGoalInput").value) || 2000;
    const prot = parseInt(document.getElementById("protGoal").value) || 150;
    const carb = parseInt(document.getElementById("carbGoal").value) || 200;
    const fat = parseInt(document.getElementById("fatGoal").value) || 65;
    state.goal = { cal, prot, carb, fat };
    saveToStorage();
    updateSummary();
    showToast("✅ Daily goal saved!");
}

// =====================================================================
//  BURNED CALORIES
// =====================================================================
function updateBurned() {
    if (!isLoggedIn()) { showGuestModal("Oh no! Log in to save your progress!"); return; }
    const val = parseInt(document.getElementById("burnedInput").value) || 0;
    state.burned = val;
    saveToStorage();
    updateSummary();
}

// =====================================================================
//  ADD FROM SUGGESTION
// =====================================================================
function addMealToLog(id) {
    if (!isLoggedIn()) { showGuestModal("Oh no! Log in to save your progress!"); return; }
    const meal = MEALS_DB.find(m => m.id === id);
    if (!meal) return;
    state.log.push({
        name: meal.name, mealType: meal.mealType, serving: meal.serving,
        cal: meal.cal, prot: meal.protein, carb: meal.carbs, fat: meal.fat
    });
    saveToStorage();
    renderLog();
    updateSummary();
    showToast(`🍽️ ${meal.name} added to log`);
}

// =====================================================================
//  ADD MANUAL
// =====================================================================
function addManualFood() {
    if (!isLoggedIn()) { showGuestModal("Oh no! Log in to save your progress!"); return; }
    const name = document.getElementById("manualName").value.trim();
    const cal = parseInt(document.getElementById("manualCal").value) || 0;
    const serving = parseInt(document.getElementById("manualServing").value) || 100;
    const prot = parseInt(document.getElementById("manualProt").value) || 0;
    const carb = parseInt(document.getElementById("manualCarb").value) || 0;
    const fat = parseInt(document.getElementById("manualFat").value) || 0;
    const mealType = document.getElementById("manualMealType").value;

    if (!name) { showToast("⚠️ Please enter a food name", true); return; }
    if (cal <= 0) { showToast("⚠️ Please enter calories", true); return; }

    state.log.push({ name, mealType, serving, cal, prot, carb, fat });
    saveToStorage();
    renderLog();
    updateSummary();
    showToast(`🍽️ ${name} logged!`);

    ["manualName", "manualCal", "manualServing", "manualProt", "manualCarb", "manualFat"]
        .forEach(id => document.getElementById(id).value = "");
}

// =====================================================================
//  REMOVE
// =====================================================================
function removeEntry(i) {
    if (!isLoggedIn()) { showGuestModal("Oh no! Log in to save your progress!"); return; }
    state.log.splice(i, 1);
    saveToStorage();
    renderLog();
    updateSummary();
}

function clearLog() {
    if (!isLoggedIn()) { showGuestModal("Oh no! Log in to save your progress!"); return; }
    if (state.log.length === 0) return;
    if (!confirm("Clear today's entire food log?")) return;
    state.log = [];
    state.burned = 0;
    const burnedInput = document.getElementById("burnedInput");
    if (burnedInput) burnedInput.value = "";
    saveToStorage();
    renderLog();
    updateSummary();
    showToast("🗑️ Log cleared");
}

// =====================================================================
//  RENDER LOG
// =====================================================================
function renderLog() {
    const body = document.getElementById("foodLogBody");
    const empty = document.getElementById("logEmpty");
    const table = document.getElementById("foodLogTable");

    if (state.log.length === 0) {
        body.innerHTML = "";
        empty.style.display = "block";
        table.style.display = "none";
        return;
    }
    empty.style.display = "none";
    table.style.display = "table";

    body.innerHTML = state.log.map((item, i) => `
        <tr>
          <td><strong style="color:var(--white)">${item.name}</strong></td>
          <td><span style="font-size:0.72rem;color:rgba(247,247,247,0.5)">${item.mealType}</span></td>
          <td style="color:rgba(247,247,247,0.6)">${item.serving}g</td>
          <td><span class="cal-badge">${item.cal}</span></td>
          <td style="color:#4db8ff;font-weight:600">${item.prot}g</td>
          <td style="color:#f5c842;font-weight:600">${item.carb}g</td>
          <td style="color:#f5c842;font-weight:600">${item.fat}g</td>
          <td><button class="btn-remove" onclick="removeEntry(${i})"><i class="fas fa-times"></i></button></td>
        </tr>
      `).join("");
}

// =====================================================================
//  UPDATE SUMMARY
// =====================================================================
function updateSummary() {
    const totCal = state.log.reduce((s, i) => s + (i.cal || 0), 0);
    const totProt = state.log.reduce((s, i) => s + (i.prot || 0), 0);
    const totCarb = state.log.reduce((s, i) => s + (i.carb || 0), 0);
    const totFat = state.log.reduce((s, i) => s + (i.fat || 0), 0);
    const { cal: gCal, prot: gProt, carb: gCarb, fat: gFat } = state.goal;
    const burned = state.burned || 0;

    // Quick stats bar
    document.getElementById("statCalLeft").textContent = gCal;
    document.getElementById("statCalConsumed").textContent = totCal;
    document.getElementById("statProtein").textContent = totProt + "g";
    document.getElementById("statMealsLogged").textContent = state.log.length;

    // Ring — net = consumed - burned
    const net = Math.max(0, totCal - burned);
    const left = Math.max(0, gCal - net);
    document.getElementById("ringNum").textContent = left;
    document.getElementById("ringConsumed").textContent = totCal;
    document.getElementById("ringGoal").textContent = gCal;
    document.getElementById("ringBurned").textContent = burned;

    const pct = Math.min(net / gCal, 1);
    const circ = 2 * Math.PI * 58; // 364.4
    const offset = circ - pct * circ;
    const ring = document.getElementById("ringFill");
    ring.setAttribute("stroke-dashoffset", offset.toFixed(1));
    ring.setAttribute("stroke", pct >= 1 ? "var(--green)" : "var(--orange)");

    // Macro bars
    const pPct = Math.min((totProt / gProt) * 100, 100);
    const cPct = Math.min((totCarb / gCarb) * 100, 100);
    const fPct = Math.min((totFat / gFat) * 100, 100);
    document.getElementById("barProt").style.width = pPct + "%";
    document.getElementById("barCarb").style.width = cPct + "%";
    document.getElementById("barFat").style.width = fPct + "%";
    document.getElementById("barProtVal").textContent = `${totProt} / ${gProt}g`;
    document.getElementById("barCarbVal").textContent = `${totCarb} / ${gCarb}g`;
    document.getElementById("barFatVal").textContent = `${totFat}  / ${gFat}g`;
}

// =====================================================================
//  RENDER MEALS
// =====================================================================
function renderMeals() {
    const query = (document.getElementById("mealSearch").value || "").toLowerCase();
    const filter = state.activeFilter;
    const fallback = document.getElementById("searchFallback");

    let filtered = MEALS_DB.filter(m => {
        const matchFilter = filter === "all" || m.tags.includes(filter);
        const matchSearch = !query || m.name.toLowerCase().includes(query)
            || m.desc.toLowerCase().includes(query)
            || m.tags.some(t => t.toLowerCase().includes(query));
        return matchFilter && matchSearch;
    });

    const grid = document.getElementById("mealGrid");

    if (filtered.length === 0) {
        fallback.style.display = query ? "block" : "none";
        grid.innerHTML = `<div class="col-12"><div class="empty-state"><i class="fas fa-search d-block mb-2"></i><p>No meals match "<strong>${query || filter}</strong>".</p></div></div>`;
        return;
    }

    fallback.style.display = "none";
    grid.innerHTML = filtered.map(m => `
        <div class="col-sm-6 col-md-4 mb-3">
          <div class="meal-card" onclick="addMealToLog(${m.id})">
            <div class="meal-card-img-placeholder">${m.emoji}</div>
            <div class="meal-card-body">
              <div class="meal-name">${m.name}</div>
              <div class="meal-desc">${m.desc}</div>
              <div class="meal-macros">
                <span class="meal-macro-tag tag-cal">${m.cal} kcal</span>
                <span class="meal-macro-tag tag-pro">${m.protein}g P</span>
                <span class="meal-macro-tag tag-carb">${m.carbs}g C</span>
                <span class="meal-macro-tag tag-fat">${m.fat}g F</span>
              </div>
              <button class="btn-add-meal"><i class="fas fa-plus mr-1"></i>Add to Log</button>
            </div>
          </div>
        </div>
      `).join("");
}

// =====================================================================
//  MANUAL FORM TOGGLE
// =====================================================================
let manualOpen = false;
function toggleManualForm() {
    manualOpen = !manualOpen;
    document.getElementById("manualFormBody").style.display = manualOpen ? "block" : "none";
    document.getElementById("manualToggleIcon").className = manualOpen ? "fas fa-chevron-up mr-1" : "fas fa-chevron-down mr-1";
    document.getElementById("manualToggleLabel").textContent = manualOpen ? "Collapse" : "Expand";
}

function openManualLog() {
    if (!manualOpen) toggleManualForm();
    document.getElementById("manualLogCard").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => document.getElementById("manualName").focus(), 400);
}

// =====================================================================
//  RUN
// =====================================================================
document.addEventListener("DOMContentLoaded", init);