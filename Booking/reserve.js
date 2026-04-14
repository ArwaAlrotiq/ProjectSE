import { getScheduleById, bookTickets } from './booking.js';

// =====================================
// Render seats in the UI
// =====================================
function renderSeats(schedule) {
    const container = document.getElementById("seats-container");
    if (!container) return;

    container.innerHTML = "";

    const totalSeats = schedule.seatCapacity;
    const availableSeats = schedule.availableSeats;

    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement("button");
        seat.classList.add("seat");
        seat.textContent = i;

        if (i > availableSeats) {
            seat.classList.add("unavailable");
            seat.disabled = true;
        }

        container.appendChild(seat);
    }
}

// =====================================
// Load seats on page load
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    const schedule = getScheduleById(selectedTrainId);
    renderSeats(schedule);
});

// =====================================
// Reserve button logic
// =====================================
document.getElementById("reserve-btn").addEventListener("click", () => {
    const tickets = Number(document.getElementById("ticket-count").value);

    const schedule = getScheduleById(selectedTrainId);

    const result = bookTickets(schedule, tickets);

    alert(result.message);

    if (result.success) {
        renderSeats(result.schedule);
    }
});