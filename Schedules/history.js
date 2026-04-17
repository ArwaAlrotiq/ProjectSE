import { checkAuth } from '../Login/auth.js';
checkAuth();
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
                <td>${schedule.destination}</td>
                <td>${schedule.departureTime}</td>
                <td>${schedule.arrivalTime}</td>
                <td>${schedule.ticketPrice} SAR</td>
                <td>${schedule.seatCapacity}</td>
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
                <td>${schedule.destination}</td>
                <td>${schedule.departureTime}</td>
                <td>${schedule.arrivalTime}</td>
                <td>${schedule.ticketPrice} SAR</td>
                <td>${schedule.seatCapacity}</td>
                <td>${schedule.status || "Completed"}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
function clearHistory() {
    if (confirm("Are you sure you want to delete all historical records?")) {
        localStorage.removeItem("historicalSchedules");
        displayHistoricalSchedules();
    }
}
