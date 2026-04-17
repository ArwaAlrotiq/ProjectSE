import { checkAuth } from '../Login/auth.js';
checkAuth();
window.loadConfirmation = loadConfirmation;
window.printConfirmation = printConfirmation;
window.downloadConfirmationPDF = downloadConfirmationPDF;

function loadConfirmation() {
  const booking = JSON.parse(localStorage.getItem('latestBooking'));

  if (!booking) {
    document.getElementById('confirmation-box').innerHTML =
      '<p style="text-align:center;color:red;">No booking found.</p>';
    return;
  }

  const storedPassengerName = localStorage.getItem('selectedPassengerName');

  document.getElementById('passenger-name').textContent =
    booking.passengerName && booking.passengerName !== "Passenger"
      ? booking.passengerName
      : storedPassengerName || '—';

  document.getElementById('train-name').textContent =
    booking.trainName || '—';

  document.getElementById('booking-date').textContent =
    booking.date || '—';

  document.getElementById('seat-count').textContent =
    booking.seat ?? '—';

  document.getElementById('total-price').textContent =
    booking.totalPrice != null ? booking.totalPrice + ' SAR' : '—';

  document.getElementById('booking-id').textContent =
    booking.id || '—';

  const statusEl = document.getElementById('status');
  statusEl.textContent = booking.status;

  statusEl.classList.remove('status-confirmed', 'status-cancelled');

  if (booking.status === "Cancelled") {
    statusEl.classList.add('status-cancelled');
  } else {
    statusEl.classList.add('status-confirmed');
  }

}

function printConfirmation() {
  window.print();
}

async function downloadConfirmationPDF() {
  const booking = JSON.parse(localStorage.getItem('latestBooking'));
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