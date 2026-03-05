// Task 14: Update occupancy data when the page is refreshed
window.addEventListener('DOMContentLoaded', () => {
    updateOccupancy();
});

function updateOccupancy() {
    
    let occupancyData = JSON.parse(localStorage.getItem('occupancy')) || {};

    const container = document.getElementById('occupancy-container'); 
    container.innerHTML = ''; 

   
    for (let train in occupancyData) {
        let p = document.createElement('p');
        p.textContent = `${train}: ${occupancyData[train]} seats occupied`;
        container.appendChild(p);
    }
}


function bookSeat(train, seats) {
    let occupancyData = JSON.parse(localStorage.getItem('occupancy')) || {};
    occupancyData[train] = (occupancyData[train] || 0) + seats;
    localStorage.setItem('occupancy', JSON.stringify(occupancyData));
}