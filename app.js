const API_URL = `${window.location.origin}/api`; // Replace with your FastAPI backend URL
// const API_URL = "http://localhost:8000"; // Replace with your FastAPI backend URL

const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskList = document.getElementById("task-list");

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskTitle.value;
  const description = taskDescription.value;

  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description, completed: false }),
  });

  const { task } = await response.json();
  addTaskToList(task);
  taskTitle.value = "";
  taskDescription.value = "";
});

async function fetchTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  const { tasks } = await response.json();
  tasks.forEach(addTaskToList);
}

function addTaskToList(task) {
  const li = document.createElement("li");
  li.dataset.key = task.key;

  const title = document.createElement("span");
  title.textContent = `${task.value.title} - ${task.value.description}`;
  li.appendChild(title);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    deleteTask(task.key);
  });
  li.appendChild(deleteButton);

  taskList.appendChild(li);
}

async function deleteTask(taskKey) {
  await fetch(`${API_URL}/tasks/${taskKey}`, {
    method: "DELETE",
  });
  const task = document.querySelector(`[data-key="${taskKey}"]`);
  task.remove();
}

// Fetch existing tasks on page load
fetchTasks();
