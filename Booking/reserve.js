import { getScheduleById, bookTickets } from './booking.js';

// =====================================
// 1) Render seats in the UI
// =====================================
function renderSeats(schedule) {
    const container = document.getElementById("seats-container");
    container.innerHTML = "";

    const totalSeats = schedule.seatCapacity;
    const availableSeats = schedule.availableSeats;

    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement("button");
        seat.classList.add("seat");
        seat.textContent = i;

        // Mark unavailable seats in the UI
        if (i > availableSeats) {
            seat.classList.add("unavailable");
            seat.disabled = true; // Block user interaction
        }

        container.appendChild(seat);
    }
}

// =====================================
// 2) Load seats when the page opens
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    const schedule = getScheduleById(selectedTrainId);
    renderSeats(schedule);
});

// =====================================
// 3) Reserve button logic
// =====================================
document.getElementById("reserve-btn").addEventListener("click", () => {
    const scheduleId = selectedTrainId; 
    const tickets = Number(document.getElementById("ticket-count").value);

    const schedule = getScheduleById(scheduleId);
    const result = bookTickets(schedule, tickets);

    if (!result.success) {
        alert(result.message);
    } else {
        alert(result.message);
    }
});
