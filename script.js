document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const themeToggle = document.getElementById('theme-toggle');
    const filterButtons = document.querySelectorAll('.filter-button');
    const progressBar = document.querySelector('.progress');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Function to render tasks based on filter
    function renderTasks() {
        taskList.innerHTML = ''; // Clear the list
        let filteredTasks = tasks;

        if (currentFilter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <div>
                    <i class="fas fa-check ${task.completed ? 'completed' : ''}" data-index="${index}"></i>
                    <i class="fas fa-edit" data-index="${index}"></i>
                    <i class="fas fa-trash" data-index="${index}"></i>
                </div>
            `;
            taskList.appendChild(li);
        });

        updateProgressBar();
    }

    // Function to update progress bar
    function updateProgressBar() {
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = (tasks.length === 0) ? 0 : (completedTasks / tasks.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            renderTasks();
        }
    }

    // Function to toggle task completion
    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Function to delete a task
    function deleteTask(index) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Function to edit a task
    function editTask(index) {
        const newText = prompt('Enter new task text:', tasks[index].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }

    // Event listeners
    addTaskButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    taskList.addEventListener('click', function(event) {
        const index = event.target.dataset.index;
        if (event.target.classList.contains('fa-check')) {
            toggleComplete(index);
        } else if (event.target.classList.contains('fa-trash')) {
            deleteTask(index);
        } else if (event.target.classList.contains('fa-edit')) {
            editTask(index);
        }
    });

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    // Initial render
    renderTasks();
});