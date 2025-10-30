

document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('name-modal');
        const nameInput = document.getElementById('name-input');
        const saveNameBtn = document.getElementById('save-name-btn');
        const mainContent = document.getElementById('main-content');
        const greeting = document.getElementById('greeting');
        const addBtn = document.getElementById('add-btn');
        const taskInput = document.getElementById('task-input');
        const taskContainer = document.getElementById('task-container');
        const startBtn = document.querySelector('.start');
        const stopBtn = document.querySelector('.stop');
        const resetBtn = document.querySelector('.reset');
        const timerDisplay = document.getElementById('timer-display');
        const totalTodayEl = document.getElementById('total-today');
        const weeklyAverageEl = document.getElementById('weekly-average');
        let timerInterval = null;
        let elapsedTime = 0; 
        let username='';
        function updatetimerdisplay(){
            let hrs = Math.floor(elapsedTime / 3600);
            let mins = Math.floor((elapsedTime % 3600) / 60);
            let secs = elapsedTime % 60;
            timerDisplay.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        function updateStats() {
            const box3 = document.querySelector('.box3 ul');
            box3.innerHTML = `<li>Total time today: ${totalTimeToday}s</li><li>Total time spent this week: ${totalTimeToday}s</li>`;
        }
        function addtask(){
            const taskText = taskInput.value.trim();
            if (taskText === '') {
                alert('Please enter a task!');
                return;
            }
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.innerHTML = `<span><strong>Task:</strong>${taskText}</span>`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
                taskDiv.remove();
            });
            taskDiv.appendChild(deleteBtn);
            taskContainer.appendChild(taskDiv);
            taskInput.value='';
        }

        const storage = {
                get: (key) => {
                    const item = localStorage.getItem(key);
                    try {
                        return item ? JSON.parse(item) : null;
                    } catch (e) {
                        return item; // Return as string if not JSON
                    }
                },
                set: (key, value) => {
                    localStorage.setItem(key, JSON.stringify(value));
                }
        };
        let totalTimeToday = storage.get('total_time_today') || 0;
        function init(){
            const savedName = storage.get('dashboard_user');
                if (savedName) {
                    username = savedName;
                    initializeDashboard();
                } else {
                    modal.classList.remove('hidden');
                    nameInput.focus();
                }
        }
        function initializeDashboard() {
                modal.classList.add('hidden');
                mainContent.classList.remove('hidden');
                updateGreeting();
        }
        function updateGreeting() {
                const hour = new Date().getHours();
                let greetingText = '';
                if (hour < 12) {
                    greetingText = 'Good morning';
                } else if (hour < 18) {
                    greetingText = 'Good afternoon';
                } else {
                    greetingText = 'Good evening';
                }
                greeting.textContent = `${greetingText}, ${username}!`;
        }
        function saveName() {
                const name = nameInput.value.trim();
                if (name) {
                    username = name;
                    storage.set('dashboard_user', username);
                    initializeDashboard();
                }
        }
        saveNameBtn.addEventListener('click', saveName);
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveName();
        });
        init()
        addBtn.addEventListener('click', addtask);
        taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addtask();
        });
        startBtn.addEventListener('click', () => {
                if (timerInterval) return; 
                timerInterval = setInterval(() => {
                    elapsedTime++;
                    updatetimerdisplay();
                    }, 1000);
        });
        stopBtn.textContent='Pause';
        stopBtn.addEventListener('click', () => {
            if (!timerInterval) return;
            clearInterval(timerInterval);
            timerInterval = null;
        });
        resetBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
            totalTimeToday += elapsedTime;
            storage.set('total_time_today', totalTimeToday);
            elapsedTime = 0;
            updatetimerdisplay();
            updateStats();
        });

    // Load stats when page starts
        updateStats();
        updatetimerdisplay();
        


        

})