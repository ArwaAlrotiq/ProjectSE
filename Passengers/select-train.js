import { checkAuth } from '../Login/auth.js';
checkAuth();
function forceUpdateTable() {
    console.log("Auto-refreshing table data...");
    if (typeof renderTrains === "function") {
        renderTrains();
    }
}

window.onpageshow = function(event) {
    forceUpdateTable();
};

window.addEventListener('storage', (e) => {
    if (e.key === 'trainSchedules') {
        forceUpdateTable();
    }
});
function loadSchedules() {
  return JSON.parse(localStorage.getItem("trainSchedules") || "[]");
}

const tableBody = document.getElementById("train-table-body");

function renderTrains() {
  const schedules = loadSchedules();

  if (schedules.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7">No trains available.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";

schedules.forEach(schedule => {
    const trainId = schedule.id || "N/A"; 
    const availableSeats = Number(schedule.availableSeats ?? schedule.seatCapacity);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${schedule.trainName}</td>
      <td>${schedule.departureTime}</td>
      <td>${schedule.arrivalTime}</td>
      <td>${schedule.destination}</td>
      <td>${schedule.ticketPrice} SAR</td>
      <td>${availableSeats}/${schedule.seatCapacity}</td>
      <td>
        <button class="btn" onclick="selectTrain('${trainId}')" 
          ${availableSeats <= 0 ? "disabled" : ""}>
          ${availableSeats <= 0 ? "Full" : "Select"}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
});}

window.selectTrain = function (trainId) {
  const passengerId = localStorage.getItem("selectedPassengerId");

  if (!passengerId) {
    alert("Please select a passenger first.");
    return;
  }

  const passenger = JSON.parse(localStorage.getItem("passengerProfiles") || "[]")
    .find(p => String(p.id).trim() === String(passengerId).trim());

  if (passenger) {
    localStorage.setItem(
      "selectedPassengerName",
      `${passenger.firstName} ${passenger.lastName}`
    );
  } else {
    console.error("Passenger profile not found for ID:", passengerId);
  }

  localStorage.setItem("selectedTrainId", String(trainId));

  window.dispatchEvent(new Event('storage'));

  window.location.href = `../Booking/reserve.html?t=${Date.now()}`;
};

document.addEventListener("DOMContentLoaded", () => {
  renderTrains();
});
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        renderTrains();
    }
});

window.addEventListener('storage', (event) => {
    if (event.key === 'trainSchedules') {
        renderTrains();
    }
});
window.addEventListener("pageshow", (event) => {
    console.log("Page shown, re-rendering trains...");
    if (typeof renderTrains === "function") {
        renderTrains(); 
    }
});