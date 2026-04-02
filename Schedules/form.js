let schedules = [];

const form = document.getElementById('schedule-form');
const tripNameInput = document.getElementById('trip-name');
const departureTimeInput = document.getElementById('departure-time');
const arrivalTimeInput = document.getElementById('arrival-time');
const destinationInput = document.getElementById('destination');
const tripIdInput = document.getElementById('trip-id');
const capacity = document.getElementById("seat-capacity");
const price = document.getElementById("ticket-price");
const btnCreate = document.getElementById('btn-create');
const btnUpdate = document.getElementById('btn-update');
const tableBody = document.getElementById('schedule body');

function loadSchedules() {
  const stored = localStorage.getItem('trainSchedules');
  schedules = stored ? JSON.parse(stored) : [];
}

function saveSchedules() {
  localStorage.setItem('trainSchedules', JSON.stringify(schedules));
}

function createSchedule(schedule) {
  schedule.id = Date.now().toString();
  schedules.push(schedule);
  saveSchedules();
  renderTable();
}

function updateSchedule(id, updatedData) {
  const index = schedules.findIndex(s => s.id === id);
  if (index !== -1) {
    schedules[index] = { ...schedules[index], ...updatedData };
    saveSchedules();
    renderTable();
  }
}

window.deleteSchedule = function(id) {
  if (confirm("Are you sure you want to delete this trip?")) {
    schedules = schedules.filter(s => s.id !== id);
    saveSchedules();
    renderTable();
  }
};

function renderTable() {
  tableBody.innerHTML = '';
  
  if (schedules.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="empty-message">No trips available.</td></tr>`;
    return;
  }
  
  schedules.forEach(schedule => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${schedule.tripName}</td>
      <td>${schedule.departureTime}</td>
      <td>${schedule.arrivalTime}</td>
      <td>${schedule.destination}</td>
      <td>${schedule.ticketPrice}</td>
      <td>${schedule.seatCapacity}</td>
      <td>
        <button class="btn-delete" onclick="deleteSchedule('${schedule.id}')">Delete</button>
        <button class="btn-edit" onclick="editSchedule('${schedule.id}')">Edit / Update</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const newSchedule = {
    tripName: tripNameInput.value,
    departureTime: departureTimeInput.value,
    arrivalTime: arrivalTimeInput.value,
    destination: destinationInput.value,
    ticketPrice: price.value,
    seatCapacity: capacity.value 
  };
  
  createSchedule(newSchedule);
  form.reset();
});

window.editSchedule = function(id) {
  const schedule = schedules.find(s => s.id === id);
  if (schedule) {
    tripNameInput.value = schedule.tripName;
    departureTimeInput.value = schedule.departureTime;
    arrivalTimeInput.value = schedule.arrivalTime;
    destinationInput.value = schedule.destination;
    capacity.value = schedule.seatCapacity;
    price.value = schedule.ticketPrice;
    tripIdInput.value = schedule.id;
    
    btnCreate.style.display = 'none';
    btnUpdate.style.display = 'inline-block';
  }
};

btnUpdate.addEventListener('click', function() {
  const id = tripIdInput.value;
  if (!id) return;
  
  const updatedData = {
    tripName: tripNameInput.value,
    departureTime: departureTimeInput.value,
    arrivalTime: arrivalTimeInput.value,
    destination: destinationInput.value,
    seatCapacity: capacity.value,
    ticketPrice: price.value
  };
  
  updateSchedule(id, updatedData);
  
  form.reset();
  tripIdInput.value = '';
  btnCreate.style.display = 'inline-block';
  btnUpdate.style.display = 'none';
});

function init() {
  loadSchedules();
  renderTable();
}

init();
