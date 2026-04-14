import { getScheduleById, bookTickets } from './booking.js';

// =====================================
// 1) Render seats in the UI
// =====================================
function renderSeats(schedule) {
    const container = document.getElementById("seats-container");
    if(!container) return;
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

const trainInput = document.getElementById('train-id-input');
const seatsDisplay = document.getElementById('available-seats-count');

if (trainInput) {
    trainInput.addEventListener('input', () => {
        const trainId = trainInput.value.trim();
        
        
        const schedule = getScheduleById(trainId);
        
        if (schedule) {
            seatsDisplay.textContent = schedule.availableSeats;
            
            seatsDisplay.style.color = schedule.availableSeats > 0 ? "#27ae60" : "#e74c3c";
        } else {
            seatsDisplay.textContent = trainId === "" ? "-" : "Not found";
            seatsDisplay.style.color = "#e74c3c";
        }
    });
}