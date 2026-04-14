import { checkAuth } from '../Login/auth.js';
checkAuth();

// ================================
// Calculate total revenue from
// all confirmed bookings
// ================================
function calculateTotalRevenue() {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  const confirmed = bookings.filter(b => b.status === 'Confirmed');

  const total = confirmed.reduce((sum, booking) => {
    return sum + (Number(booking.totalPrice) || 0);
  }, 0);

  return total;
}

// ================================
// Display total revenue
// on the dashboard
// ================================
function renderTotalRevenue() {
  const total = calculateTotalRevenue();

  const element = document.getElementById('total-revenue');
  if (element) {
    element.textContent = total.toFixed(2) + ' SAR';
  }
}

// ================================
// Run on load
// ================================
renderTotalRevenue();