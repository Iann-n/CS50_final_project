document.addEventListener("DOMContentLoaded", function() {
    let currentDate = new Date(); // Calls the instructor function to return the date instance which is allowed due to new
    console.log(currentDate);

    function formatDate(date) {
        return date.toISOString().split("T")[0]; //Change to a specific string and then split apart to extract date
    }
    console.log(formatDate(currentDate));

    function updateDateDisplay () {
        const dayColumns = document.querySelectorAll(".day-column");
        const start = new Date(currentDate); // Creates an instance again so that it can be modified
 
        dayColumns.forEach((column,i) => {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            const dateStr = formatDate(day);

            const dayName = column.textContent.split(" ")[0];
            column.textContent = `${dayName} (${dateStr})`;
        })
    }

    const PrevButton = document.getElementById("prevBtn");
    const NextButton = document.getElementById("nextBtn");

    if (NextButton) {
        NextButton.addEventListener("click", () => {
            currentDate.setDate(currentDate.getDate() + 7);
            updateDateDisplay();
        });
    }

    if (PrevButton) {
        PrevButton.addEventListener("click", () => {
            currentDate.setDate(currentDate.getDate() - 7);
            updateDateDisplay();
        });
    }

    updateDateDisplay();
})