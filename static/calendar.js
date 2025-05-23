
    // Initializing variables
    let currentDate = new Date(); // Calls the instructor function to return the date instance which is allowed due to new
    day = currentDate.getDay();
    day_idx = document.querySelectorAll('[data-index]');
    date = currentDate.getDate();
    console.log(date);
    calendar_dates = document.getElementsByClassName("date");

    //Implementing an algorithm that sets up the dates in each field:

    // For each day, check if their index (0-6) match with the index attribute. If match then change css property
    for (let i = 0; i< day_idx.length; i++) {
        const column = day_idx[i];
        const index = parseInt(column.getAttribute('data-index'));
        if (index === day) {
            // Change CSS style to highlight today's column
            column.style.backgroundColor = 'crimson';

            // calculate the date for the start day
            start_day = date - i;
            //Loop over all the 7 days to display the date correctly
            for (let i = 0; i< 7; i++) {
                calendar_date = calendar_dates[i];
                calendar_date.textContent = start_day;
                start_day +=1;
            }
        }
    }

// Initialising task div and add task button
div = document.getElementsByClassName("day-column");
const addtask_button = document.getElementsByClassName("add-task");

// Setting css property for each div
for (let i = 0; i < div.length; i++) {
    const div_item = div[i];
    const button = addtask_button[i]; 

    div_item.addEventListener("mouseenter", () => {
        button.style.opacity = "1";
    });

    div_item.addEventListener("mouseleave", () => {
        button.style.opacity = "0";
    });
}

document.querySelectorAll('.month').forEach((el, i) => {
  const sunday = new Date(currentDate)
  const refmonth = sunday.getMonth() + 1;
  el.textContent = refmonth; 
})

// Implementing algorithm to change the date values when you press the arrow buttons:

prevBtn = document.getElementById("prevBtn");
nextBtn = document.getElementById("nextBtn");

month = document.querySelectorAll(".month");
dateElems = document.querySelectorAll(".date");
console.log(month);
console.log(date);
function renderColumns() {
  const sunday = new Date(currentDate); // cloning current date to allow reproducability
  sunday.setDate(currentDate.getDate() - currentDate.getDay()); // Set base date to sunday so the rest of the dates could be easily looped
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date - ignore time component and ensure we only focus on the dates

  document.querySelectorAll('.date').forEach((el, i) => { //el = current DOM element being processed, i = index of element
    // Generate the date for this column
    const dayDate = new Date(sunday);
    dayDate.setDate(sunday.getDate() + i); // Set the date value la basically
    el.textContent = dayDate.getDate();

    // Highlight if this date is today
    dayDate.setHours(0, 0, 0, 0); // Normalize
    const column = el.closest('.day-column'); // finds the closest day-column class element
    column.style.backgroundColor = 
      dayDate.getTime() === today.getTime() ? 'crimson' : '';
  });

    document.querySelectorAll('.month').forEach((el, i) => {
    const reffmonth = sunday.getMonth() + 1;
    el.textContent = reffmonth; 

  let refmonth = new Date(sunday).getMonth() + 1; // Initialize the month from the base date
  console.log("Initial refmonth: ", refmonth);
for (let i = 0; i < 7; i++) {
  const dayDate = new Date(sunday); // clone fresh every time
  dayDate.setDate(sunday.getDate() + i); // offset by i days

  const day = dayDate.getDate();
  const currentMonth = dayDate.getMonth() + 1;

  monthItem = month[i];
  const dateItem = dateElems[i];

  dateItem.textContent = day;
  monthItem.textContent = currentMonth;

  console.log(`Day ${i}: Date = ${day}, Month = ${currentMonth}`);

  if (day === 1 && currentMonth !== refmonth) {
    refmonth = currentMonth; // update reference month
    for (let j = i; j < month.length; j++) {
      month[j].textContent = refmonth;
    }
  }
}

  })
}

prevBtn.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 7);
  console.log("Previous week:", currentDate.toDateString());
  renderColumns();
});

nextBtn.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 7);
  console.log("Next week:", currentDate.toDateString());
  renderColumns();
});

// Implementing algorithm to get month:
console.log(currentDate)
const curMonth = currentDate.getMonth() + 1;
console.log(curMonth);


// Implementing opertaion to show popup
let selectedDayIndex = null;
removePopup = document.getElementById("closeTaskPopup");
addTaskPopup = document.getElementById("addTaskPopup");
taskFormPopup = document.getElementById("taskFormPopup")

document.querySelectorAll(".add-task").forEach(button => {
  button.addEventListener("click", function () {
    // Show the popup
    document.getElementById("taskPopup").style.display = "block";
    document.getElementById("popupOverlay").style.display = "block";

    // Get column index from parent
    const column = this.closest(".day-column");
    selectedDayIndex = column.getAttribute("data-index");

    document.getElementById("dayIndexInput").value = selectedDayIndex;
  });
});

function closeTaskPopup() {
  document.getElementById("taskPopup").style.display = "none";
  document.getElementById("popupOverlay").style.display = "none";
  selectedDayIndex = null;
}

removePopup.addEventListener("click", closeTaskPopup);

function addTask(taskName, noPomodoros, selectedDayIndex, taskId) {
  // Create a new task div
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.innerHTML = 
  `<span>${taskName}</span>
  <p> Pomodoros: ${noPomodoros}</p>
  <button class="deleteTaskButton">delete task</button>`;

  const deleteTaskButton = taskDiv.querySelector(".deleteTaskButton");

  // Initially hide the button via CSS (not with inline style)
  deleteTaskButton.style.opacity = "0";
  deleteTaskButton.style.visibility = "hidden";
  deleteTaskButton.style.transition = "opacity 0.3s ease, visibility 0.3s ease";

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
  deleteTaskButton.addEventListener("click", async () => {
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
  const targetColumn = document.querySelector(`.day-column[data-index="${selectedDayIndex}"]`)
  const addButton = targetColumn.querySelector(".add-task");
  targetColumn.insertBefore(taskDiv, addButton);

  // Clear inputs and close popup
  document.getElementById('taskNameInput').value = '';
  document.getElementById('pomoCountInput').value = 1;
  closeTaskPopup();
}

taskFormPopup.addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the form from submitting normally

  const taskName = document.getElementById("taskNameInput").value.trim(); 
  const noPomodoros = document.getElementById("pomoCountInput").value;
  const taskDayIdx = parseInt(document.getElementById("dayIndexInput").value);

  // Create a json object to send to flask serverside
  const response = await fetch('/addtask', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task_name: taskName,
      pomodoro_count: noPomodoros,
      day_index: taskDayIdx,
    }),
  });

  const data = await response.json();
  console.log(data);
  if (data.success) {
    taskId = data.task_id;
    addTask(taskName, noPomodoros, taskDayIdx, taskId);
    alert("Task added successfully!");
  }
  else {
    alert("Failed to add task. Please try again.")
  }
})



window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/gettask");
    const data = await response.json();

    if (data.success) {
      data.tasks.forEach(task => {
        addTask(task.task, task.pomocount, task.day, task.id);  // reuse your existing function
      });
    } else {
      alert("Failed to load tasks.");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    alert("Error loading tasks")
  }
});