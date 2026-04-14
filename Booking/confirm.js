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
// Download confirmation as PDF
// ================================
async function downloadConfirmationPDF() {
  const booking = JSON.parse(localStorage.getItem('lastBooking'));
  if (!booking) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Booking Confirmation", 20, 20);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  const lines = [
    `Booking ID    : ${booking.id}`,
    `Passenger     : ${booking.passengerName}`,
    `Train         : ${booking.train}`,
    `Date          : ${booking.date}`,
    `Seats Booked  : ${booking.seat}`,
    `Total Price   : ${booking.totalPrice} SAR`,
    `Status        : ${booking.status}`
  ];

  let y = 40;
  lines.forEach(line => {
    doc.text(line, 20, y);
    y += 10;
  });

  doc.save(`booking_${booking.id}.pdf`);
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