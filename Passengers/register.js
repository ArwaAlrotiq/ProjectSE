/**
 * Passenger Registration Management
 * Handles creating and managing passenger profiles using localStorage
 */

const STORAGE_KEY = 'passengerProfiles';

// ========================
// Storage Helpers
// ========================

function loadPassengers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function savePassengers(passengers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passengers));
}

// ========================
// API-style Functions
// ========================

function createPassenger(data) {
  const passengers = loadPassengers();
  const passenger = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString()
  };
  passengers.push(passenger);
  savePassengers(passengers);
  return passenger;
}

function updatePassenger(id, data) {
  const passengers = loadPassengers();
  const index = passengers.findIndex(p => p.id === id);
  if (index === -1) return null;
  passengers[index] = { ...passengers[index], ...data };
  savePassengers(passengers);
  return passengers[index];
}

function deletePassenger(id) {
  const passengers = loadPassengers().filter(p => p.id !== id);
  savePassengers(passengers);
}

function getAllPassengers() {
  return loadPassengers();
}

// ========================
// DOM References
// ========================

const modal = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const form = document.getElementById('passenger-form');
const tableBody = document.getElementById('table-body');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const toast = document.getElementById('toast');

const btnOpenForm = document.getElementById('btn-open-form');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancel = document.getElementById('btn-cancel');
const btnSubmit = document.getElementById('btn-submit');

const actionPanel = document.getElementById('action-buttons');
const selectedLabel = document.getElementById('selected-passenger-label');

let selectedPassengerId = localStorage.getItem("selectedPassengerId") || null;

const fields = {
  id: document.getElementById('passenger-id'),
  firstName: document.getElementById('first-name'),
  lastName: document.getElementById('last-name'),
  gender: document.getElementById('gender'),
  dob: document.getElementById('dob'),
  nationality: document.getElementById('nationality'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  passport: document.getElementById('passport'),
  emergencyContact: document.getElementById('emergency-contact'),
};

const errors = {
  firstName: document.getElementById('err-first-name'),
  lastName: document.getElementById('err-last-name'),
  gender: document.getElementById('err-gender'),
  dob: document.getElementById('err-dob'),
  nationality: document.getElementById('err-nationality'),
  email: document.getElementById('err-email'),
  phone: document.getElementById('err-phone'),
  passport: document.getElementById('err-passport'),
};

// ========================
// Toast
// ========================

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast toast-show toast-${type}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = 'toast';
  }, 3200);
}

// ========================
// Validation
// ========================

function clearErrors() {
  Object.keys(errors).forEach(k => {
    errors[k].textContent = '';
    if (fields[k]) fields[k].classList.remove('input-error');
  });
}

function validateForm() {
  clearErrors();
  let valid = true;

  const required = [
    { key: 'firstName', label: 'First Name', el: fields.firstName },
    { key: 'lastName', label: 'Last Name', el: fields.lastName },
    { key: 'gender', label: 'Gender', el: fields.gender },
    { key: 'dob', label: 'Date of Birth', el: fields.dob },
    { key: 'nationality', label: 'Nationality', el: fields.nationality },
    { key: 'email', label: 'Email', el: fields.email },
    { key: 'phone', label: 'Phone', el: fields.phone },
    { key: 'passport', label: 'Passport / ID', el: fields.passport },
  ];

  required.forEach(({ key, label, el }) => {
    if (!el.value.trim()) {
      errors[key].textContent = `${label} is required.`;
      el.classList.add('input-error');
      valid = false;
    }
  });

  // Email format check
  if (fields.email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
    errors.email.textContent = 'Please enter a valid email address.';
    fields.email.classList.add('input-error');
    valid = false;
  }

  // Duplicate passport check
  const passengers = loadPassengers();
  const currentId = fields.id.value;
  const dup = passengers.find(
    p => p.passport.toLowerCase() === fields.passport.value.trim().toLowerCase() && p.id !== currentId
  );
  if (dup) {
    errors.passport.textContent = 'This Passport / ID is already registered.';
    fields.passport.classList.add('input-error');
    valid = false;
  }

  return valid;
}

// ========================
// Modal Control
// ========================

function openForm(passenger = null) {
  clearErrors();
  form.reset();
  fields.id.value = '';

  if (passenger) {
    modalTitle.textContent = 'Edit Passenger Profile';
    btnSubmit.textContent = 'Save Changes';
    fields.id.value = passenger.id;
    fields.firstName.value = passenger.firstName;
    fields.lastName.value = passenger.lastName;
    fields.gender.value = passenger.gender;
    fields.dob.value = passenger.dob;
    fields.nationality.value = passenger.nationality;
    fields.email.value = passenger.email;
    fields.phone.value = passenger.phone;
    fields.passport.value = passenger.passport;
    fields.emergencyContact.value = passenger.emergencyContact || '';
  } else {
    modalTitle.textContent = 'Register New Passenger';
    btnSubmit.textContent = 'Register Passenger';
  }

  modal.style.display = 'flex';
  fields.firstName.focus();
}

function closeForm() {
  modal.style.display = 'none';
}

// ========================
// Table Render
// ========================

function renderTable(query = '') {
  const passengers = getAllPassengers();
  const q = query.toLowerCase();

  const filtered = passengers.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
    p.email.toLowerCase().includes(q) ||
    p.passport.toLowerCase().includes(q)
  );

  tableBody.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'flex';
    document.getElementById('passenger-table').style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    document.getElementById('passenger-table').style.display = 'table';

    filtered.forEach((p, index) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td class="radio-col">
          <input type="radio" name="selectPassenger" class="radio-select" value="${p.id}">
        </td>
        <td>${index + 1}</td>
        <td><strong>${p.firstName} ${p.lastName}</strong></td>
        <td>${p.gender}</td>
        <td>${formatDate(p.dob)}</td>
        <td>${p.nationality}</td>
        <td>${p.email}</td>
        <td>${p.phone}</td>
        <td><code>${p.passport}</code></td>
        <td class="td-actions">
          <button class="btn-edit-row" onclick="handleEdit('${p.id}')">Edit</button>
          <button class="btn-delete-row" onclick="handleDelete('${p.id}')">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  updateStats(passengers);
  attachRadioEvents();

  // Restore selected passenger
  const savedId = localStorage.getItem("selectedPassengerId");
  if (savedId) {
    const radio = document.querySelector(`input.radio-select[value="${savedId}"]`);
    if (radio) {
      radio.checked = true;
      selectedPassengerId = savedId;
      updateActionPanel();
    }
  }
}

function attachRadioEvents() {
  document.querySelectorAll('.radio-select').forEach(radio => {
    radio.addEventListener('change', () => {
      selectedPassengerId = radio.value;
      localStorage.setItem("selectedPassengerId", selectedPassengerId);
      updateActionPanel();
    });
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ========================
// Stats
// ========================

function updateStats(passengers) {
  document.getElementById('stat-total').textContent = passengers.length;
  document.getElementById('stat-male').textContent = passengers.filter(p => p.gender === 'Male').length;
  document.getElementById('stat-female').textContent = passengers.filter(p => p.gender === 'Female').length;
}

// ========================
// Action Panel
// ========================

function updateActionPanel() {
  if (!selectedPassengerId) {
    actionPanel.style.display = 'none';
    return;
  }

  const passenger = getAllPassengers().find(p => p.id === selectedPassengerId);

  selectedLabel.textContent = `Selected: ${passenger.firstName} ${passenger.lastName}`;

  actionPanel.style.display = 'flex';

  document.getElementById('btn-profile').onclick =
    () => window.location.href = `../Passengers/profile.html?id=${selectedPassengerId}`;

  document.getElementById('btn-cancel-booking').onclick =
    () => window.location.href = `../Booking/cancellation.html?id=${selectedPassengerId}`;

  document.getElementById('btn-booking').onclick =
    () => window.location.href = `../Booking/reserve.html?id=${selectedPassengerId}`;

  document.getElementById('btn-extra-seats').onclick =
    () => window.location.href = `../Booking/booking.html?id=${selectedPassengerId}`;

  document.getElementById('btn-confirm').onclick =
    () => window.location.href = `../Booking/confirm.html?id=${selectedPassengerId}`;
}

// ========================
// Event Handlers
// ========================

window.handleEdit = function (id) {
  const passenger = getAllPassengers().find(p => p.id === id);
  if (passenger) openForm(passenger);
};

window.handleDelete = function (id) {
  if (confirm('Are you sure you want to delete this passenger profile?')) {
    deletePassenger(id);
    renderTable(searchInput.value);
    showToast('Passenger profile deleted.', 'error');
  }
};

// ========================
// Event Listeners
// ========================

btnOpenForm.addEventListener('click', () => openForm());
btnCloseModal.addEventListener('click', closeForm);
btnCancel.addEventListener('click', closeForm);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeForm();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const data = {
    firstName: fields.firstName.value.trim(),
    lastName: fields.lastName.value.trim(),
    gender: fields.gender.value,
    dob: fields.dob.value,
    nationality: fields.nationality.value.trim(),
    email: fields.email.value.trim(),
    phone: fields.phone.value.trim(),
    passport: fields.passport.value.trim(),
    emergencyContact: fields.emergencyContact.value.trim(),
  };

  const id = fields.id.value;

  if (id) {
    updatePassenger(id, data);
    showToast('Passenger profile updated successfully.', 'success');
  } else {
    createPassenger(data);
    showToast('Passenger registered successfully.', 'success');
  }

  closeForm();
  renderTable(searchInput.value);
});

// ========================
// Init
// ========================

renderTable();
updateActionPanel();