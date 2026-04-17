import { checkAuth } from '../Login/auth.js';
checkAuth();
// ================================
// Calculate total revenue
// ================================
function calculateTotalRevenue() {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const schedules = JSON.parse(localStorage.getItem("trainSchedules") || []);

  let total = 0;

  bookings.forEach(booking => {
    if (booking.status === "Confirmed") {
      const schedule = schedules.find(s => s.id == booking.trainId);

      if (schedule) {
total += Number(booking.totalPrice || 0);
      }
    }
  });

  return total;
}

// ================================
// Display total revenue
// ================================
function renderTotalRevenue() {
  const total = calculateTotalRevenue();

  const element = document.getElementById("total-revenue");
  if (element) {
    element.textContent = total.toFixed(2) + " SAR";
  }
}

// ================================
// Run on load
// ================================
document.addEventListener("DOMContentLoaded", renderTotalRevenue);