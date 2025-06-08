window.addEventListener("DOMContentLoaded", () => {
    loadUncompletedTask();
})

async function loadUncompletedTask() {
    const response = await fetch("/loadUncompletedTask")
    const data = await response.json()

    if (data.success) {

        const activeTasks = data.tasks.filter(task => task.completed === 0);
        activeTasks.array.forEach(task => {
            addTask(task.name,task.pomocount, task.month, task.date)
        });
    }
}

function addTask(taskName, noPomodoros, selectedMonthIndex, selectedDateIndex, taskId) {
  console.log(taskName, noPomodoros, selectedMonthIndex, selectedDateIndex, taskId)
  // Create a new task div
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.innerHTML = 
  `<span>${taskName}</span>
  <p> Pomodoros: ${noPomodoros}</p>
  <button class="deleteTaskButton">delete</button>`;

  const deleteTaskButton = taskDiv.querySelector(".deleteTaskButton");

  // Initially hide the button via CSS (not with inline style)
  deleteTaskButton.style.opacity = "0";
  deleteTaskButton.style.visibility = "hidden";
  deleteTaskButton.style.transition = "all 0.3s ease;";

  // Show button on hover (only for this taskDiv)
  taskDiv.addEventListener("mouseenter", () => {
    deleteTaskButton.style.opacity = "1";
    deleteTaskButton.style.visibility = "visible";
  });
  taskDiv.addEventListener("mouseleave", () => {
    deleteTaskButton.style.opacity = "0";
    deleteTaskButton.style.visibility = "hidden";
  });

  // Add event listener to delete button
  deleteTaskButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    new Audio('/static/button-click.mp3').play()
    try {
    const response = await fetch ('/deletetask', {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_id : taskId,
      }),
    });

    const result = await response.json();
    if (result.success) {
      taskDiv.remove();  
      alert("Task deleted successfully.");
    } else {
      alert("Failed to delete task.");
    }}
      catch (error) {
    console.error("Error deleting task:", error);
    alert("An error occurred.");
      }
  })

  // Insert the task div into the correct column above the add task button
  const allColumns = document.querySelectorAll(".day-column");
  let targetColumn = null;

  allColumns.forEach(column => {
    const datespan = column.querySelector(".date");
    const monthspan = column.querySelector(".month");

    if (datespan && monthspan) {
      const columnDate = parseInt(datespan.textContent.trim());
      const columnMonth = parseInt(monthspan.textContent.trim());

      if (columnDate === selectedDateIndex && columnMonth === selectedMonthIndex) {
        targetColumn = column;
      }
    }
  })

  if (!targetColumn) {
    console.error("Target column not found for date:", selectedDateIndex, "month:", selectedMonthIndex);
    return;
  }

  const addButton = targetColumn.querySelector(".add-task");
  targetColumn.insertBefore(taskDiv, addButton);

  taskDiv.addEventListener("click", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/view-task";

    const data = {
      task_name: taskName,
      no_pomodoros: noPomodoros,
      date_idx: selectedDateIndex,
      month_idx: selectedMonthIndex
    };

    for (const key in data) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
    }

    localStorage.setItem("currentTask", JSON.stringify({
      taskName,
      noPomodoros,
      taskId,
      date_idx: selectedDateIndex,
      month_idx: selectedMonthIndex
    }));

    document.body.appendChild(form);
    form.submit();
  })

}