import { checkAuth } from '../Login/auth.js';
checkAuth();
function getBookings() {
  return JSON.parse(localStorage.getItem("bookings") || "[]");
}

function loadHistory() {
  const tableBody = document.getElementById("historyBody");
  const bookings = getBookings();
  const schedules = JSON.parse(localStorage.getItem("trainSchedules") || "[]");

  tableBody.innerHTML = "";

  if (bookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6">No booking history found</td></tr>`;
    return;
  }

  bookings.forEach(booking => {
    const schedule = schedules.find(s => s.id == booking.trainId);

    const trainName = schedule ? schedule.trainName : "—";
    const seats = booking.seat;  
    const price = booking.totalPrice;  
    const date = booking.date || "—";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${booking.id}</td>
      <td>${trainName}</td>
      <td>${date}</td>
      <td>${seats}</td>
      <td>${price} SAR</td>
      <td>${booking.status}</td>
    `;
    tableBody.appendChild(row);
  });
}
function clearBookingHistory() {
  if (confirm("Are you sure you want to delete all booking history?")) {
    localStorage.removeItem("bookings");
    loadHistory();
  }
}

document.addEventListener("DOMContentLoaded", loadHistory);