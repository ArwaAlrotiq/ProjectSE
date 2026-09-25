import { showUpdateConfirmation, showDeleteConfirmation } from './validation.js';
import { checkAuth } from '../Login/auth.js';
checkAuth();

const STORAGE_KEY = 'passengerProfiles';

/* ============================================================
   HANDLE "Passenger Profile" BUTTON IN register.html
============================================================ */
if (window.location.pathname.includes('register.html')) {
    document.addEventListener('click', (e) => {

        if (e.target && e.target.matches('.btn-profile')) {

            const selectedRadio = document.querySelector('input[type="radio"]:checked');

            if (!selectedRadio) {
                alert("Please select a passenger first!");
                return;
            }

            const row = selectedRadio.closest('tr');
            const passengerId = row.dataset.id;

            if (passengerId) {
                window.location.href = `profile.html?id=${passengerId}`;
            }
        }
    });
}

/* ============================================================
   PROFILE PAGE LOGIC
============================================================ */
document.addEventListener('DOMContentLoaded', () => {

    if (!window.location.pathname.includes('profile.html')) return;

    const fields = {
        id:          document.getElementById('p-id'),
        firstName:   document.getElementById('p-first-name'),
        lastName:    document.getElementById('p-last-name'),
        gender:      document.getElementById('p-gender'),
        dob:         document.getElementById('p-dob'),
        nationality: document.getElementById('p-nationality'),
        email:       document.getElementById('p-email'),
        phone:       document.getElementById('p-phone'),
        passport:    document.getElementById('p-passport'),
        emergency:   document.getElementById('p-emergency')
    };

    /* -------------------------------
       Load Profile Data
    -------------------------------- */
    function loadCurrentProfile() {
        const urlParams = new URLSearchParams(window.location.search);
        const passengerId = urlParams.get('id');

        const passengers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        if (!passengerId) {
            alert("Invalid passenger ID");
            return;
        }

        const p = passengers.find(passenger => passenger.id === passengerId);

        if (!p) {
            alert("Passenger not found!");
            return;
        }

        fields.id.value = p.id;
        fields.firstName.value = p.firstName;
        fields.lastName.value = p.lastName;
        fields.gender.value = p.gender;
        fields.dob.value = p.dob;
        fields.nationality.value = p.nationality;
        fields.email.value = p.email;
        fields.phone.value = p.phone;
        fields.passport.value = p.passport;
        fields.emergency.value = p.emergencyContact || '';
    }

    loadCurrentProfile();

    /* -------------------------------
       UPDATE PROFILE
    -------------------------------- */
    document.getElementById("btn-update").addEventListener("click", () => {
      const passengers = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const currentId = fields.id.value;

      const index = passengers.findIndex((p) => p.id === currentId);

      if (index === -1) return alert("Passenger not found!");

      const requiredFields = [
        [fields.firstName, "First name"],
        [fields.lastName, "Last name"],
        [fields.nationality, "Nationality"],
        [fields.email, "Email address"],
        [fields.phone, "Phone number"],
        [fields.passport, "Passport / ID"],
      ];

      for (const [field, label] of requiredFields) {
        if (!field.value.trim()) return alert(`${label} is required`);
      }

      if (new Date(fields.dob.value) > new Date())
        return alert("Date of birth cannot be in the future");

      passengers[index] = {
        ...passengers[index],
        firstName: fields.firstName.value.trim(),
        lastName: fields.lastName.value.trim(),
        gender: fields.gender.value,
        dob: fields.dob.value,
        nationality: fields.nationality.value.trim(),
        email: fields.email.value.trim(),
        phone: fields.phone.value.trim(),
        passport: fields.passport.value.trim(),
        emergencyContact: fields.emergency.value.trim(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(passengers));

      showUpdateConfirmation();
    });

    /* -------------------------------
       DELETE PROFILE
    -------------------------------- */
    document.getElementById('btn-delete').addEventListener('click', () => {

        if (!confirm("Are you sure you want to delete this profile?")) return;

        let passengers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const currentId = fields.id.value;

        const filteredList = passengers.filter(p => p.id !== currentId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredList));

        showDeleteConfirmation();

        setTimeout(() => {
            window.location.href = "register.html";
        }, 1000);
    });
});