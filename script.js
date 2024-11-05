let currentUser = null;

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password === confirmPassword) {
        localStorage.setItem(email, password);
        showMessage("Sign up successfully! You can now sign in.", "green");
        this.reset(); // Reset the sign-up form
    } else {
        showMessage("Passwords do not match!", "red");
    }
});

document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    if (validateCredentials(email, password)) {
        currentUser = email;
        showMessage("Signed in successfully!");
        toggleAuth(false); // Switch to the to-do list
        initializeTodoApp();
    } else {
        showMessage("Invalid email or password!", "red");
    }
});

document.getElementById('logout-button').addEventListener('click', function() {
    currentUser = null;
    toggleAuth(true); // Switch back to authentication
    showMessage("Logged out successfully!");
    clearTasks();
});

document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;
    const category = document.getElementById('task-category').value;

    if (taskInput.value) {
        addTask(taskInput.value, dueDate, priority, category);
        taskInput.value = ''; // Clear input
        document.getElementById('task-due-date').value = ''; // Clear due date
        document.getElementById('task-category').value = ''; // Clear category
    }
});

// Search functionality
document.getElementById('search-input').addEventListener('input', function(event) {
    const searchText = event.target.value.toLowerCase();
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => {
        const taskText = task.textContent.toLowerCase();
        task.style.display = taskText.includes(searchText) ? '' : 'none';
    });
});

// Dark mode toggle
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Onboarding
document.getElementById('start-btn').addEventListener('click', function() {
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('todo-container').classList.remove('hidden');
});

function showMessage(message, color = "green") {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = color;
    messageDiv.classList.remove('hidden');
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 4000);
}

function validateCredentials(email, password) {
    return localStorage.getItem(email) === password; 
}

function toggleAuth(isAuth) {
    document.getElementById('auth').classList.toggle('hidden', !isAuth);
    document.getElementById('todo-container').classList.toggle('hidden', isAuth);
    if (isAuth) {
        document.getElementById('onboarding').classList.remove('hidden');
    } else {
        document.getElementById('onboarding').classList.add('hidden');
    }
}

function initializeTodoApp() {
    loadTasks();
}

function addTask(task, dueDate, priority, category) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${task} - Due: ${dueDate} - Priority: ${priority} - Category: ${category}</span>
        <input type="checkbox" onclick="completeTask(this)"> Complete
        <div style="display: flex; justify-content: space-between;">
            <button onclick="editTask(this)">Edit</button>
            <button onclick="deleteTask(this)">Delete</button>
        </div>
    `;
    document.getElementById('task-list').appendChild(li);
}

function completeTask(checkbox) {
    const taskItem = checkbox.parentElement.parentElement; // Navigate up to the list item
    taskItem.classList.toggle('completed', checkbox.checked);
}

function editTask(button) {
    const taskItem = button.parentElement.parentElement; // Navigate up to the list item
    const taskText = taskItem.querySelector('span').textContent;
    const details = taskText.split(' - '); // Split details
    const taskDescription = details[0]; // Task description
    const taskDueDate = details[1].replace('Due: ', ''); // Due date
    const taskPriority = details[2].replace('Priority: ', ''); // Priority
    const taskCategory = details[3].replace('Category: ', ''); // Category

    document.getElementById('task-input').value = taskDescription;
    document.getElementById('task-due-date').value = taskDueDate;
    document.getElementById('task-priority').value = taskPriority;
    document.getElementById('task-category').value = taskCategory;

    // Remove the task to edit it
    taskItem.remove();
    showMessage("Task edited successfully!");
}

function deleteTask(button) {
    const taskItem = button.parentElement.parentElement; // Navigate up to the list item
    taskItem.remove();
    showMessage("Task deleted successfully!");
}

function clearTasks() {
    const taskList = document.getElementById('task-list');
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
}

function loadTasks() {
    // In a real app, load tasks from a database or storage
}
