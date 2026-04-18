import { checkAuth } from '../Login/auth.js';
checkAuth();
window.loadConfirmation = loadConfirmation;
window.printConfirmation = printConfirmation;
window.downloadConfirmationPDF = downloadConfirmationPDF;

function loadConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get("bookingId");

  const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const booking = allBookings.find(b => b.id == bookingId);

  if (!booking) {
    document.getElementById('confirmation-box').innerHTML =
      '<p style="text-align:center;color:red;">No booking found.</p>';
    return;
  }

  document.getElementById('passenger-name').textContent = booking.passengerName || '—';
  document.getElementById('train-name').textContent = booking.trainName || '—';
  document.getElementById('booking-date').textContent = booking.date || '—';
  document.getElementById('seat-count').textContent = booking.seat ?? '—';
  document.getElementById('total-price').textContent =
    booking.totalPrice != null ? booking.totalPrice + ' SAR' : '—';
  document.getElementById('booking-id').textContent = booking.id || '—';

  const statusEl = document.getElementById('status');
  statusEl.textContent = booking.status;

  statusEl.classList.remove('status-confirmed', 'status-cancelled');
  statusEl.classList.add(booking.status === "Cancelled" ? 'status-cancelled' : 'status-confirmed');
}
function printConfirmation() {
  window.print();
}

async function downloadConfirmationPDF() {
  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get("bookingId");

  const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const booking = allBookings.find(b => b.id == bookingId);
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
    `Train         : ${booking.trainName}`,
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

window.addEventListener('load', loadConfirmation);