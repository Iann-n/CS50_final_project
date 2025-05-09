document.addEventListener("DOMContentLoaded", function() {
    let currentDate = new Date(); // Calls the instructor function to return the date instance which is allowed due to new
    day = currentDate.getDay();
    day_idx = document.querySelectorAll('[data-index]');
    date = currentDate.getDate();

    calendar_dates = document.getElementsByClassName("date");

    for (let i = 0; i< day_idx.length; i++) {
        const column = day_idx[i];
        const index = parseInt(column.getAttribute('data-index'));


        if (index === day) {
            // Change CSS style to highlight today's column
            column.style.backgroundColor = 'crimson';

            // calculate the date for the start day
            start_day = date - i;
            //Loop over all the 7 days
            for (let i = 0; i< 7; i++) {
                calendar_date = calendar_dates[i];
                calendar_date.textContent = start_day;
                start_day +=1;
            }

        }
    }


div = document.getElementsByClassName("day-column");
const addtask_button = document.getElementsByClassName("add-task");

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

prevBtn = document.getElementById("prevBtn");
nextBtn = document.getElementById("nextBtn");

function renderColumns() {
  // Calculate Sunday of the current week
  const sunday = new Date(currentDate);
  sunday.setDate(currentDate.getDate() - currentDate.getDay());

  // Update all date cells
  document.querySelectorAll('.date').forEach((el, i) => {
    const dayDate = new Date(sunday);
    dayDate.setDate(sunday.getDate() + i);
    el.textContent = dayDate.getDate();
  });
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
});