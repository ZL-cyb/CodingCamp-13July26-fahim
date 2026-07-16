/* ==========================================================
   LIFE DASHBOARD
   SCRIPT.JS

   Author : Fahima Izzul
   Version : 2.0
========================================================== */


/* ==========================================================
   DOM ELEMENT
========================================================== */

const greeting = document.getElementById("greeting");
const displayName = document.getElementById("displayName");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

const themeToggle = document.getElementById("themeToggle");

const toast = document.getElementById("toast");

const nameInput = document.getElementById("nameInput");
const saveNameBtn = document.getElementById("saveNameBtn");

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const progressFill = document.getElementById("progressFill");
const taskCounter = document.getElementById("taskCounter");
const emptyTask = document.getElementById("emptyTask");

const linkName = document.getElementById("linkName");
const linkURL = document.getElementById("linkURL");
const addLinkBtn = document.getElementById("addLinkBtn");
const linksContainer = document.getElementById("linksContainer");


/* ==========================================================
   GLOBAL DATA
========================================================== */

let timer = null;
let timeLeft = 25 * 60;

let tasks = [];
let links = [];


/* ==========================================================
   TOAST NOTIFICATION
========================================================== */

function showToast(message, color = "#22c55e") {

    toast.textContent = message;

    toast.style.background = color;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ==========================================================
   DATE & CLOCK
========================================================== */

function updateDateTime() {

    const now = new Date();

    const options = {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    };

    currentDate.textContent =
        now.toLocaleDateString("en-US", options);

    currentTime.textContent =
        now.toLocaleTimeString("en-US");

    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {

        greeting.textContent = "Good Morning ☀️";

    }

    else if (hour >= 12 && hour < 17) {

        greeting.textContent = "Good Afternoon 🌤";

    }

    else if (hour >= 17 && hour < 21) {

        greeting.textContent = "Good Evening 🌙";

    }

    else {

        greeting.textContent = "Good Night 🌌";

    }

}

updateDateTime();

setInterval(updateDateTime, 1000);


/* ==========================================================
   USER NAME
========================================================== */

function loadUserName() {

    const savedName = localStorage.getItem("username");

    if (savedName) {

        displayName.textContent = savedName;

    }

}

function saveUserName() {

    const name = nameInput.value.trim();

    if (name === "") {

        showToast("Please enter your name", "#ef4444");

        return;

    }

    localStorage.setItem("username", name);

    displayName.textContent = name;

    nameInput.value = "";

    showToast("Name saved successfully");

}

saveNameBtn.addEventListener("click", saveUserName);


/* ==========================================================
   DARK MODE
========================================================== */

function loadTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeToggle.textContent = "☀️";

    } else {

        themeToggle.textContent = "🌙";

    }

}

function toggleTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeToggle.textContent = "☀️";

        showToast("Dark Mode Enabled");

    } else {

        localStorage.setItem("theme", "light");

        themeToggle.textContent = "🌙";

        showToast("Light Mode Enabled");

    }

}

themeToggle.addEventListener("click", toggleTheme);


/* ==========================================================
   INITIALIZE
========================================================== */

loadTheme();

loadUserName();

/* ==========================================================
   POMODORO TIMER
========================================================== */

const DEFAULT_TIME = 25 * 60;

/* Format waktu menjadi MM:SS */
function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainSeconds).padStart(2, "0")}`;

}

/* Update tampilan timer */
function updateTimerDisplay() {

    timerDisplay.textContent = formatTime(timeLeft);

}

/* Jalankan timer */
function startTimer() {

    // Mencegah timer berjalan dua kali
    if (timer !== null) {

        return;

    }

    timer = setInterval(() => {

        timeLeft--;

        updateTimerDisplay();

        if (timeLeft <= 0) {

            clearInterval(timer);

            timer = null;

            showToast("🎉 Pomodoro Completed!", "#22c55e");

            // Bunyi notifikasi sederhana
            try {

                const audio = new Audio(
                    "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
                );

                audio.play();

            } catch (error) {

                console.log("Audio tidak tersedia.");

            }

        }

    }, 1000);

}

/* Pause timer */
function pauseTimer() {

    clearInterval(timer);

    timer = null;

    showToast("⏸ Timer Paused", "#f59e0b");

}

/* Reset timer */
function resetTimer() {

    clearInterval(timer);

    timer = null;

    timeLeft = DEFAULT_TIME;

    updateTimerDisplay();

    showToast("🔄 Timer Reset", "#6366f1");

}

/* Event Button */
startBtn.addEventListener("click", startTimer);

pauseBtn.addEventListener("click", pauseTimer);

resetBtn.addEventListener("click", resetTimer);

/* Inisialisasi Timer */
updateTimerDisplay();

/* ==========================================================
   TODO LIST
   PART 3A
========================================================== */

/* Load Tasks */

function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {

        tasks = JSON.parse(savedTasks);

    }

}

/* Save Tasks */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

/* Empty State */

function updateEmptyState() {

    if (tasks.length === 0) {

        emptyTask.style.display = "flex";
        taskList.style.display = "none";

    }

    else {

        emptyTask.style.display = "none";
        taskList.style.display = "flex";

    }

}

/* Progress */

function updateProgress() {

    const completed = tasks.filter(task => task.completed).length;

    taskCounter.textContent =
        `${completed} / ${tasks.length} Completed`;

    let percentage = 0;

    if (tasks.length > 0) {

        percentage =
            (completed / tasks.length) * 100;

    }

    progressFill.style.width =
        `${percentage}%`;

}

/* Render */

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        li.innerHTML = `

            <div class="task-info">

                <input
                    type="checkbox"
                    class="complete-checkbox"
                    ${task.completed ? "checked" : ""}>

                <span class="${
                    task.completed ? "completed" : ""
                }">

                    ${task.text}

                </span>

            </div>

            <div class="task-actions">

                <button
                    class="edit-btn">

                    ✏️

                </button>

                <button
                    class="delete-btn">

                    🗑️

                </button>

            </div>

        `;

        taskList.appendChild(li);

    });

    updateProgress();

    updateEmptyState();

}

/* Duplicate */

function isDuplicateTask(text) {

    return tasks.some(task =>

        task.text.toLowerCase()
        === text.toLowerCase()

    );

}

/* Add Task */

function addTask() {

    const text =
        taskInput.value.trim();

    if (text === "") {

        showToast(
            "Task cannot be empty",
            "#ef4444"
        );

        return;

    }

    if (isDuplicateTask(text)) {

        showToast(
            "Task already exists",
            "#ef4444"
        );

        return;

    }

    tasks.push({

        id: Date.now(),

        text: text,

        completed: false

    });

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskInput.focus();

    showToast(
        "Task Added"
    );

}

/* Events */

addTaskBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keypress",
    function(e){

        if(e.key==="Enter"){

            addTask();

        }

    }
);

/* Initial */

loadTasks();

renderTasks();
/* ==========================================================
   TODO LIST
   PART 3B
========================================================== */

/* Complete Task */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id == id) {

            task.completed = !task.completed;

        }

        return task;

    });

    saveTasks();

    renderTasks();

}


/* Delete Task */

function deleteTask(id) {

    const confirmDelete = confirm(
        "Delete this task?"
    );

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id != id);

    saveTasks();

    renderTasks();

    showToast(
        "Task Deleted",
        "#ef4444"
    );

}


/* Edit Task */

function editTask(id) {

    const task = tasks.find(
        task => task.id == id
    );

    if (!task) return;

    const newText = prompt(
        "Edit Task",
        task.text
    );

    if (newText === null) return;

    const text = newText.trim();

    if (text === "") {

        showToast(
            "Task cannot be empty",
            "#ef4444"
        );

        return;

    }

    const duplicate = tasks.some(item =>

        item.id != id &&
        item.text.toLowerCase() ===
        text.toLowerCase()

    );

    if (duplicate) {

        showToast(
            "Task already exists",
            "#ef4444"
        );

        return;

    }

    task.text = text;

    saveTasks();

    renderTasks();

    showToast(
        "Task Updated"
    );

}


/* ==========================================================
   EVENT DELEGATION
========================================================== */

taskList.addEventListener(
    "click",
    function (event) {

        const li = event.target.closest("li");

        if (!li) return;

        const id = Number(li.dataset.id);

        if (
            event.target.classList.contains(
                "complete-checkbox"
            )
        ) {

            toggleTask(id);

        }

        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            editTask(id);

        }

        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            deleteTask(id);

        }

    }
);

/* ==========================================================
   QUICK LINKS
   PART 4
========================================================== */

/* ---------- Load Links ---------- */

function loadLinks() {

    const savedLinks = localStorage.getItem("links");

    if (savedLinks) {

        links = JSON.parse(savedLinks);

    }

}


/* ---------- Save Links ---------- */

function saveLinks() {

    localStorage.setItem(
        "links",
        JSON.stringify(links)
    );

}


/* ---------- Render Links ---------- */

function renderLinks() {

    linksContainer.innerHTML = "";

    if (links.length === 0) {

        linksContainer.innerHTML = `
            <div class="empty-state">
                <p>🔗</p>
                <h3>No Links Yet</h3>
                <span>Add your favorite websites.</span>
            </div>
        `;

        return;

    }

    links.forEach(link => {

        const card = document.createElement("div");

        card.className = "link-card";

        card.dataset.id = link.id;

        card.innerHTML = `

            <a
                href="${link.url}"
                target="_blank"
                title="${link.url}"
            >

                ${link.name}

            </a>

            <button
                class="delete-link">

                ✖

            </button>

        `;

        linksContainer.appendChild(card);

    });

}


/* ---------- Add Link ---------- */

function addLink() {

    const name = linkName.value.trim();

    let url = linkURL.value.trim();

    if (name === "" || url === "") {

        showToast(
            "Please fill all fields",
            "#ef4444"
        );

        return;

    }

    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {

        url = "https://" + url;

    }

    const duplicate = links.some(link =>

        link.url.toLowerCase() ===
        url.toLowerCase()

    );

    if (duplicate) {

        showToast(
            "Link already exists",
            "#ef4444"
        );

        return;

    }

    links.push({

        id: Date.now(),

        name,

        url

    });

    saveLinks();

    renderLinks();

    linkName.value = "";

    linkURL.value = "";

    showToast("Link Added");

}


/* ---------- Delete Link ---------- */

function deleteLink(id) {

    links = links.filter(link =>

        link.id != id

    );

    saveLinks();

    renderLinks();

    showToast(
        "Link Deleted",
        "#ef4444"
    );

}


/* ---------- Event ---------- */

addLinkBtn.addEventListener(
    "click",
    addLink
);

linkURL.addEventListener(
    "keypress",
    function(e){

        if(e.key==="Enter"){

            addLink();

        }

    }
);

linksContainer.addEventListener(
    "click",
    function(e){

        if(
            !e.target.classList.contains(
                "delete-link"
            )
        ) return;

        const card =
            e.target.closest(".link-card");

        deleteLink(card.dataset.id);

    }
);


/* ==========================================================
   INITIALIZE APP
========================================================== */

function initializeApp() {

    loadTheme();

    loadUserName();

    loadTasks();

    loadLinks();

    renderTasks();

    renderLinks();

    updateTimerDisplay();

    updateDateTime();

}


/* ==========================================================
   START APPLICATION
========================================================== */

initializeApp();

showToast(
    "Welcome Back 🚀"
);