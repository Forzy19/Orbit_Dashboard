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
        const mybox = document.getElementById('mybox');
        const dailytime = document.getElementById('list1');
        const weektime = document.getElementById('list2');
        let timerInterval = null;
        let starttime = null;
        let elapsedTime = 0; 
        let username='';
        let selectedtask= null;
        let taskTimes = JSON.parse(localStorage.getItem('task_times')) || {};
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
        function updatetimerdisplay(){
            let hrs = Math.floor(elapsedTime / 3600);
            let mins = Math.floor((elapsedTime % 3600) / 60);
            let secs = elapsedTime % 60;
            const timerelement = document.getElementById('timer-display');
            if (timerelement) {
            timerelement.textContent =`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;}
        }
        function updatestats(){
            dailytime.innerHTML=`Total Time today:${totalTimeToday}`
            weektime.innerHTML=`Total Time of the week:${totalTimeToday}`

        }
        function saveTasks() {
            const tasks = [];
            document.querySelectorAll('.task span').forEach((span) => {
            tasks.push(span.textContent.replace('•', '').trim());
            });
            storage.set('task_list', tasks);
        }
        function loadTasks() {
            const tasks = storage.get('task_list') || [];
            tasks.forEach((taskText) => {
                taskmaker(taskText);
            });
        }
        function addtask(){
            const taskText = taskInput.value.trim();
            if (taskText === '') {
                alert('Please enter a task!');
                return;
            }
            taskmaker(taskText);
            taskInput.value = '';
            saveTasks();
        }
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
                loadTasks();
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
            if(!selectedtask){
                alert("Please select a task first");
                return;
            }
            if (timerInterval) clearInterval(timerInterval); 
            starttime = Date.now() - elapsedTime * 1000;
            timerInterval = setInterval(() => {
                const now = Date.now();
                elapsedTime = Math.floor((now - starttime) / 1000);
                updatetimerdisplay();
            }, 1000);
        });
        stopBtn.textContent='Pause';
        stopBtn.addEventListener('click', () => {
            if (!selectedtask) return;
            clearInterval(timerInterval);
            timerInterval = null;
        });
        resetBtn.addEventListener('click', () => {
            if (!selectedtask) return;
            clearInterval(timerInterval);
            timerInterval = null;
            const previousTime = taskTimes[selectedtask.name] || 0;
            const newTotal = previousTime + elapsedTime;
            totalTimeToday = totalTimeToday + newTotal;
             // Save total before resetting
            taskTimes[selectedtask.name] = newTotal;
            localStorage.setItem('task_times', JSON.stringify(taskTimes));
            // Reset timer display
            elapsedTime = 0;
            updatetimerdisplay();
            updatestats();
            if (selectedtask.element) {
                selectedtask.element.textContent = `${selectedtask.name}: ${newTotal}s`;
            }
        });

    // Load stats when page starts
        updatetimerdisplay();
        updatestats();
        const backgroundBtn = document.querySelector('.background');
        let isFirstBackground = localStorage.getItem('isFirstBackground');
        if (isFirstBackground === null) {
            isFirstBackground = true;
        }
        else{
            isFirstBackground = JSON.parse(isFirstBackground);
        }
            
        function applyBackground() {
            const image1 = "url('cosmic-symmetry-3840x2160-20464.jpg')";
            const image2 = "url('smooth-wave-gradient-mesh-background-abstract-design-illustration-on-soft-yellow-dark-orange-black-vibrant-blend-template-free-vector.jpg')";
            if (isFirstBackground) {
                document.body.style.backgroundImage = `${image1}`;

            } else {
                document.body.style.backgroundImage = `${image2}`;
            }
        }
        applyBackground();
        backgroundBtn.addEventListener('click', () => {
            isFirstBackground = !isFirstBackground;
            localStorage.setItem('isFirstBackground', JSON.stringify(isFirstBackground));
            applyBackground();
        });

        function taskmaker(taskText){  
            const para = document.createElement('p');
            para.textContent = `${taskText}: ${taskTimes[taskText] || 0}s`;
            para.classList.add('paragraph');
            const selectbutton = document.createElement('button');
            selectbutton.textContent='Select';
            selectbutton.classList.add('select-btn');
            selectbutton.addEventListener('click',()=>{
                // Stop any running timer before switching
                if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
                }
                document.querySelectorAll('.task').forEach(t=>t.classList.remove('selectedtask'));
                taskDiv.classList.add('selectedtask');
                selectedtask = { name: taskText, element: para };
                elapsedTime = 0;
                updatetimerdisplay();

            })
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.innerHTML = `<span class="point"><strong>•</strong> ${taskText}</span>`;
            const timerdisplay= document.createElement('p');
            timerdisplay.classList.add('task-timer');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn','theme-btn');
            deleteBtn.addEventListener('click', () => {
                clearInterval(timerInterval);
                taskDiv.remove();
                para.remove();
                saveTasks(); // Update localStorage after deletion
            });
            const controls = document.createElement('div');
            controls.classList.add('task-controls');
            taskDiv.append( controls,selectbutton,deleteBtn);
            taskContainer.appendChild(taskDiv);
            mybox.append(para);



        }


        

})

