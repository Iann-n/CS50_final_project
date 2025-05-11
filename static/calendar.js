document.addEventListener("DOMContentLoaded", function() {
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

// set current date to curMonth. If value resets to 1, curmonth + 1, if value fall below 1, curmonth -1
});