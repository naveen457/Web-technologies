let taskId = 0;

// Allow dropping
function allowDrop(event) {
    event.preventDefault();
}

// Drag start
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Drop task
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const task = document.getElementById(data);
    const targetColumn = event.currentTarget;

    targetColumn.appendChild(task);

    // If dropped in Completed column
    if (targetColumn.id === "completed") {
        task.classList.add("completed");
        document.getElementById("message").textContent =
            "✅ Task Completed Successfully";
    } else {
        task.classList.remove("completed");
        document.getElementById("message").textContent = "";
    }
}

// Add new task
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task name");
        return;
    }

    taskId++;

    const task = document.createElement("div");
    task.className = "task";
    task.id = "task" + taskId;
    task.draggable = true;
    task.ondragstart = drag;

    const date = new Date().toLocaleDateString();

    task.innerHTML = `
        <strong>${taskName}</strong><br>
        <small>${date}</small>
    `;

    document.getElementById("todo").appendChild(task);
    taskInput.value = "";
}
