import { getScheduleById, bookTickets } from './booking.js';
import { checkAuth } from '../Login/auth.js';
checkAuth();

const currentUserName = localStorage.getItem("selectedPassengerName") || "Passenger";
const currentPassengerId = localStorage.getItem("selectedPassengerId") || null;

function updateDisplay(trainId) {
    const display = document.getElementById('available-seats-count');
    const schedule = getScheduleById(trainId);

    if (schedule && display) {
        display.textContent = schedule.availableSeats;
        display.style.color = "#27ae60";
        renderSeats(schedule);
    } else if (display) {
        display.textContent = "Not found";
        display.style.color = "#e74c3c";
        const container = document.getElementById("seats-container");
        if (container) container.innerHTML = "";
    }
}

function renderSeats(schedule) {
    const container = document.getElementById("seats-container");
    if (!container || !schedule) return;

    container.innerHTML = "";
    const totalSeats = Number(schedule.seatCapacity);
    const availableSeats = Number(schedule.availableSeats);

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

document.addEventListener("DOMContentLoaded", () => {
    const trainId = localStorage.getItem("selectedTrainId");
    if (trainId) {
        const inputField = document.getElementById('train-id-input');
        if (inputField) inputField.value = trainId;

        const schedule = getScheduleById(trainId);
        const display = document.getElementById('available-seats-count');

        if (schedule && display) {
            display.textContent = schedule.availableSeats;
            display.style.color = "#27ae60";
            renderSeats(schedule);
        } else if (display) {
            display.textContent = "Not found";
            display.style.color = "#e74c3c";
        }
    }
});

document.getElementById("reserve-btn").addEventListener("click", () => {
    const trainId = document.getElementById('train-id-input').value.trim();
    const tickets = Number(document.getElementById("ticket-count").value);

    if (!trainId) {
        alert("Please enter a Train ID");
        return;
    }

    const schedule = getScheduleById(trainId);
    if (!schedule) {
        alert("Train schedule not found in storage!");
        return;
    }

    const result = bookTickets(trainId, tickets, currentUserName, currentPassengerId);

    if (result.success) {
    window.location.href = "confirm.html?bookingId=" + result.booking.id;
}
    else {
        alert(result.message);
    }
});
document.getElementById('train-id-input').addEventListener('input', (e) => {
    const trainId = e.target.value.trim();
    localStorage.setItem("selectedTrainId", trainId);
    updateDisplay(trainId);
});