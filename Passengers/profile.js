if (window.location.pathname.includes('register.html')) {
    document.addEventListener('click', (e) => {
        
        if (e.target && e.target.textContent.trim() === 'Passenger Profile') {
            
            
            const selectedRadio = document.querySelector('input[type="radio"]:checked');
            
            if (selectedRadio) {
                
                const row = selectedRadio.closest('tr');
                const rowId = row.getAttribute('data-testid')?.replace('row-passenger-', '');
                
                if (rowId) {
                    window.location.href = `profile.html?id=${rowId}`;
                }
            } else {
                alert("Please select a passenger first!");
            }
        }
    });
}
import { showUpdateConfirmation, showDeleteConfirmation } from './validation.js';

const STORAGE_KEY = 'passengerProfiles';

document.addEventListener('DOMContentLoaded', () => {
    
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

   
    function loadCurrentProfile() {
        
        const urlParams = new URLSearchParams(window.location.search);
        const passengerId = urlParams.get('id');

        const passengers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
       
        
        const p = passengers.find(passenger => passenger.id === passengerId) || passengers[passengers.length - 1];

        if (p) {
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
        } else {
            console.log("No passenger found!");
        }
    }

    loadCurrentProfile();

    // Update
    document.getElementById('btn-update').addEventListener('click', () => {
        let passengers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const currentId = fields.id.value;
        const index = passengers.findIndex(p => p.id === currentId);

        if (index !== -1) {
            
            passengers[index] = {
                ...passengers[index],
                firstName: fields.firstName.value,
                lastName:  fields.lastName.value,
                gender:    fields.gender.value,
                dob:       fields.dob.value,
                nationality: fields.nationality.value,
                email:     fields.email.value,
                phone:     fields.phone.value,
                passport:  fields.passport.value,
                emergencyContact: fields.emergency.value
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(passengers));
            
            
            showUpdateConfirmation();
        }
    });

    // Delete
    document.getElementById('btn-delete').addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this profile?")) {
            let passengers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const currentId = fields.id.value;
            
            
            const filteredList = passengers.filter(p => p.id !== currentId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredList));
            
            showDeleteConfirmation();

            
            setTimeout(() => {
                window.location.href = "register.html";
            }, 1000);
        }
    });
});