document.addEventListener("DOMContentLoaded", function() {
    let currentDate = new Date(); // Calls the instructor function to return the date instance which is allowed due to new
    day = currentDate.getDay();
    day_idx = document.querySelectorAll('[data-index]');
    date = currentDate.getDate();
    console.log(date);

    let calendar_dates = [];
    date_div = document.getElementsByClassName("date");

    let daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    console.log(daysInMonth);

    console.log(calendar_dates);
    let emptyDaysBefore = day;
    console.log(emptyDaysBefore);

    for (let i = 0; i< day_idx.length; i++) {
        const column = day_idx[i];
        const index = parseInt(column.getAttribute('data-index'));
        calendar_date = calendar_dates[i];

        if (index === day) {
            // Change CSS style to highlight today's column
            column.style.backgroundColor = 'crimson';
            
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

})