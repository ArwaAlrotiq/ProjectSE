let schedules = [];

const form = document.getElementById('schedule-form');
const tripNameInput = document.getElementById('trip-name');
const departureTimeInput = document.getElementById('departure-time');
const destinationInput = document.getElementById('destination');
const tripIdInput = document.getElementById('trip-id');

const btnCreate = document.getElementById('btn-create');
const btnUpdate = document.getElementById('btn-update');
const tableBody = document.getElementById('table-body');

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
  if (confirm("هل أنت متأكد من حذف هذه الرحلة؟")) {
    schedules = schedules.filter(s => s.id !== id);
    saveSchedules();
    renderTable();
  }
};

function renderTable() {
  tableBody.innerHTML = '';
  
  if (schedules.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="empty-message">لا توجد رحلات مضافة حالياً.</td></tr>`;
    return;
  }
  
  schedules.forEach(schedule => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${schedule.tripName}</td>
      <td dir="ltr">${schedule.departureTime}</td>
      <td>${schedule.destination}</td>
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
    destination: destinationInput.value
  };
  
  createSchedule(newSchedule);
  form.reset();
});

window.editSchedule = function(id) {
  const schedule = schedules.find(s => s.id === id);
  if (schedule) {
    tripNameInput.value = schedule.tripName;
    departureTimeInput.value = schedule.departureTime;
    destinationInput.value = schedule.destination;
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
    destination: destinationInput.value
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
