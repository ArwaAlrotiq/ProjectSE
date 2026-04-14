import { getScheduleById, bookTickets } from './booking.js';

// =====================================
// Get selected train ID from URL
// =====================================
function getSelectedTrainId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

const selectedTrainId = getSelectedTrainId();

// =====================================
// Render seats in the UI
// =====================================
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

    if (!schedule) {
        alert("Train schedule not found.");
        return;
    }

    const result = bookTickets(schedule, tickets, "Passenger");

    alert(result.message);

    if (result.success) {
        renderSeats(result.schedule);

        const lastBooking = {
            id: Date.now().toString(),
            trainId: schedule.id,
            train: schedule.trainName,
            date: schedule.departureTime,
            seat: tickets,
            passengerName: "Passenger",
            totalPrice: schedule.ticketPrice * tickets,
            status: "Confirmed"
        };

        localStorage.setItem("lastBooking", JSON.stringify(lastBooking));

        window.location.href = "confirm.html";
    }
});

// =====================================
// Live seat availability display
// =====================================
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