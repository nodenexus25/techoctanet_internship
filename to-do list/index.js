document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-button');
    const toggleThemeButton = document.getElementById('toggle-theme');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filter = 'all';

    const renderTasks = () => {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.dataset.id = task.id;

            const span = document.createElement('span');
            span.textContent = task.text;
            li.appendChild(span);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editTask(task.id);
            actionsDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteTask(task.id);
            actionsDiv.appendChild(deleteButton);

            const toggleButton = document.createElement('button');
            toggleButton.textContent = task.completed ? 'Uncomplete' : 'Complete';
            toggleButton.onclick = () => toggleTask(task.id);
            actionsDiv.appendChild(toggleButton);

            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        });
    };

    const addTask = () => {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
        };

        tasks.push(task);
        newTaskInput.value = '';
        saveTasks();
        renderTasks();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    const toggleTask = (id) => {
        const task = tasks.find(task => task.id === id);
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    };

    const editTask = (id) => {
        const li = taskList.querySelector(`li[data-id="${id}"]`);
        const span = li.querySelector('span');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        li.classList.add('editing');
        li.insertBefore(input, span);
        li.removeChild(span);

        input.addEventListener('blur', () => {
            li.classList.remove('editing');
            const newText = input.value.trim();
            if (newText !== '') {
                const task = tasks.find(task => task.id === id);
                task.text = newText;
                saveTasks();
                renderTasks();
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });

        input.focus();
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const toggleTheme = () => {
        document.body.classList.toggle('dark');
        document.body.classList.toggle('light');
        document.querySelector('.container').classList.toggle('dark');
        document.querySelector('.container').classList.toggle('light');
    };

    const setFilter = (newFilter) => {
        filter = newFilter;
        filterButtons.forEach(button => button.classList.remove('active'));
        document.getElementById(`filter-${newFilter}`).classList.add('active');
        renderTasks();
    };

    addTaskButton.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => setFilter(button.id.split('-')[1]));
    });

    toggleThemeButton.addEventListener('click', toggleTheme);

    // Initial render
    document.body.classList.add('light');
    document.querySelector('.container').classList.add('light');
    renderTasks();
});
