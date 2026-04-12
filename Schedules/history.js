// Load historical schedules only
document.addEventListener("DOMContentLoaded", displayHistoricalSchedules);

// ===============================
// Display Historical Schedules
// ===============================
function displayHistoricalSchedules() {
    const schedules = JSON.parse(localStorage.getItem("historicalSchedules")) || [];
    const tableBody = document.getElementById("historicalTableBody");
    const noDataMessage = document.getElementById("noDataMessage");

    tableBody.innerHTML = "";

    if (schedules.length === 0) {
        noDataMessage.textContent = "No historical records found.";
        return;
    } else {
        noDataMessage.textContent = "";
    }

    schedules.forEach(schedule => {
        const row = `
            <tr>
                <td>${schedule.trainName}</td>
                <td>${schedule.route}</td>
                <td>${schedule.departure}</td>
                <td>${schedule.arrival}</td>
                <td>${schedule.price}</td>
                <td>${schedule.capacity}</td>
                <td>${schedule.status || "Completed"}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// ===============================
// Search Historical Schedules
// ===============================
function searchHistoricalSchedules() {
    const query = document.getElementById("searchTrain").value.toLowerCase();
    const schedules = JSON.parse(localStorage.getItem("historicalSchedules")) || [];

    const filtered = schedules.filter(schedule =>
        schedule.trainName.toLowerCase().includes(query)
    );

    const tableBody = document.getElementById("historicalTableBody");
    const noDataMessage = document.getElementById("noDataMessage");

    tableBody.innerHTML = "";

    if (filtered.length === 0) {
        noDataMessage.textContent = "No matching records found.";
        return;
    } else {
        noDataMessage.textContent = "";
    }

    filtered.forEach(schedule => {
        const row = `
            <tr>
                <td>${schedule.trainName}</td>
                <td>${schedule.route}</td>
                <td>${schedule.departure}</td>
                <td>${schedule.arrival}</td>
                <td>${schedule.price}</td>
                <td>${schedule.capacity}</td>
                <td>${schedule.status || "Completed"}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}