import { checkAuth } from '../Login/auth.js';
checkAuth();
let schedules = [];

const form = document.getElementById('schedule-form');
const trainNameInput = document.getElementById('train-name');
const departureTimeInput = document.getElementById('departure-time');
const arrivalTimeInput = document.getElementById('arrival-time');
const destinationInput = document.getElementById('destination');
const trainIdInput = document.getElementById('train-id');
const capacity = document.getElementById("seat-capacity");
const price = document.getElementById("ticket-price");
const btnCreate = document.getElementById('btn-create');
const btnUpdate = document.getElementById('btn-update');
const tableBody = document.getElementById('schedule-body');

function loadSchedules() {
  const stored = localStorage.getItem('trainSchedules');
  schedules = stored ? JSON.parse(stored) : [];
}

function saveSchedules() {
  localStorage.setItem('trainSchedules', JSON.stringify(schedules));
}

function saveToHistory(schedule) {
  const history = JSON.parse(localStorage.getItem("historicalSchedules")) || [];
  history.push(schedule);
  localStorage.setItem("historicalSchedules", JSON.stringify(history));
}

function createSchedule(newTrain) {
    newTrain.id = Date.now().toString(); 
    
    newTrain.seatCapacity = Number(newTrain.seatCapacity);
    newTrain.availableSeats = newTrain.seatCapacity;
    newTrain.ticketPrice = Number(newTrain.ticketPrice);

    loadSchedules(); 

    schedules.push(newTrain);
    
    saveSchedules();
    localStorage.setItem('lastCreatedTrainId', newTrain.id);
}

function updateSchedule(id, updatedData) {
  const index = schedules.findIndex(s => String(s.id) === String(id));

  if (index !== -1) {
    const old = schedules[index];

    saveToHistory({ ...old, status: "Updated" });

    schedules[index] = {
      ...old,
      trainName: updatedData.trainName,
      departureTime: updatedData.departureTime,
      arrivalTime: updatedData.arrivalTime,
      destination: updatedData.destination,
      ticketPrice: Number(updatedData.ticketPrice),
      seatCapacity: Number(updatedData.seatCapacity),
      availableSeats: Math.min(old.availableSeats, Number(updatedData.seatCapacity))
    };

    saveSchedules();
    renderTable();
  }
}

window.deleteSchedule = function (id) {
  if (confirm("Are you sure you want to delete this train?")) {
    const schedule = schedules.find(s => String(s.id) === String(id));
    if (schedule) {
      saveToHistory({ ...schedule, status: "Deleted" });
      schedules = schedules.filter(s => String(s.id) !== String(id));
      saveSchedules();
      renderTable();
    }
  }
};

function renderTable() {
  tableBody.innerHTML = '';

  if (schedules.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="empty-message">No trains available.</td></tr>`;
    return;
  }

  schedules.forEach(schedule => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${schedule.trainName}</td>
            <td>${schedule.departureTime}</td>
            <td>${schedule.arrivalTime}</td>
            <td>${schedule.destination}</td>
            <td>${schedule.ticketPrice} SAR</td>
            <td>${schedule.seatCapacity}</td>
            <td>
                <button class="btn-delete" onclick="deleteSchedule('${schedule.id}')">Delete</button>
                <button class="btn-edit" onclick="editSchedule('${schedule.id}')">Edit</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const newSchedule = {
    trainName: trainNameInput.value.trim(),
    departureTime: departureTimeInput.value,
    arrivalTime: arrivalTimeInput.value,
    destination: destinationInput.value.trim(),
    ticketPrice: price.value,
    seatCapacity: capacity.value
  };

  createSchedule(newSchedule);
  renderTable();
  form.reset();
});

window.editSchedule = function (id) {
  const schedule = schedules.find(s => String(s.id) === String(id));
  if (schedule) {
    trainNameInput.value = schedule.trainName;
    departureTimeInput.value = schedule.departureTime;
    arrivalTimeInput.value = schedule.arrivalTime;
    destinationInput.value = schedule.destination;
    price.value = schedule.ticketPrice;
    capacity.value = schedule.seatCapacity;
    trainIdInput.value = schedule.id;

    btnCreate.style.display = 'none';
    btnUpdate.style.display = 'inline-block';
  }
};

btnUpdate.addEventListener('click', function () {
  const id = trainIdInput.value;
  if (!id) return;

  const updatedData = {
    trainName: trainNameInput.value.trim(),
    departureTime: departureTimeInput.value,
    arrivalTime: arrivalTimeInput.value,
    destination: destinationInput.value.trim(),
    ticketPrice: price.value,
    seatCapacity: capacity.value
  };

  updateSchedule(id, updatedData);

  form.reset();
  trainIdInput.value = '';
  btnCreate.style.display = 'inline-block';
  btnUpdate.style.display = 'none';
});

function moveFinishedTrainsToHistory() {
  const now = new Date();
  const active = [];
  const history = JSON.parse(localStorage.getItem("historicalSchedules")) || [];

  schedules.forEach(schedule => {
    const arrival = new Date(schedule.arrivalTime);
    if (arrival < now) {
      history.push({ ...schedule, status: "Completed" });
    } else {
      active.push(schedule);
    }
  });

  schedules = active;
  saveSchedules();
  localStorage.setItem("historicalSchedules", JSON.stringify(history));
}

function init() {
  loadSchedules();
  moveFinishedTrainsToHistory();
  renderTable();
}
window.addEventListener("pageshow", (event) => {
    renderTrains();
});

window.addEventListener('storage', (e) => {
    if (e.key === 'trainSchedules') {
        renderTrains();
    }
});
init();
document.addEventListener("DOMContentLoaded", renderTrains);