import { checkAuth } from '../Login/auth.js';
checkAuth();

// ================================
// Load confirmation details
// from localStorage
// ================================
function loadConfirmation() {
  const booking = JSON.parse(localStorage.getItem('lastBooking'));

  if (!booking) {
    document.getElementById('confirmation-box').innerHTML =
      '<p style="text-align:center;color:red;">No booking found.</p>';
    return;
  }

  document.getElementById('passenger-name').textContent =
    booking.passengerName || '—';
  document.getElementById('train-name').textContent =
    booking.train || '—';
  document.getElementById('booking-date').textContent =
    booking.date || '—';
  document.getElementById('seat-count').textContent =
    booking.seat || '—';
  document.getElementById('total-price').textContent =
    booking.totalPrice ? booking.totalPrice + ' SAR' : '—';
  document.getElementById('booking-id').textContent =
    booking.id || '—';
  document.getElementById('status').textContent =
    booking.status || 'Confirmed';
}

// ================================
// Print confirmation
// ================================
function printConfirmation() {
  window.print();
}

// ================================
// Download confirmation as text
// ================================
function downloadConfirmation() {
  const booking = JSON.parse(localStorage.getItem('lastBooking'));
  if (!booking) return;

  const content = `
BOOKING CONFIRMATION
====================
Booking ID    : ${booking.id}
Passenger     : ${booking.passengerName}
Train         : ${booking.train}
Date          : ${booking.date}
Seats Booked  : ${booking.seat}
Total Price   : ${booking.totalPrice} SAR
Status        : ${booking.status}
====================
  `.trim();

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `booking_${booking.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ================================
// Go back
// ================================
function goBack() {
  window.location.href = 'reserve.html';
}

// ================================
// Run on load
// ================================
loadConfirmation();