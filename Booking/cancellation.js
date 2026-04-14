/* ============================================================
   Imports
============================================================ */
import { getScheduleById, cancelBooking } from './booking.js';

/* ============================================================
   Update Booking History
============================================================ */
function updateBookingHistory(bookingId, countToRemove) {
  let bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  let found = false;
  let message = "";

  bookings = bookings.map(booking => {
    if (booking.id == bookingId) {
      found = true;

      if (countToRemove > booking.seat) {
        message = `You only have ${booking.seat} seats booked. Cannot cancel ${countToRemove}.`;
        return booking;
      }

      booking.seat -= countToRemove;

      if (booking.seat === 0) {
        booking.status = "Cancelled";
        message = "All seats cancelled successfully.";
      } else {
        message = `${countToRemove} seats cancelled. Remaining: ${booking.seat}`;
      }
    }
    return booking;
  });

  if (!found) {
    return { success: false, message: "Booking ID not found." };
  }

  if (message.includes("Cannot cancel")) {
    return { success: false, message: message };
  }

  localStorage.setItem("bookings", JSON.stringify(bookings));
  return { success: true, message: message };
}

/* ============================================================
   Cancel Button Handler
============================================================ */
document.getElementById("cancel-btn").addEventListener("click", () => {
  const bookingIdInput = document.getElementById("booking-id-input").value.trim();
  const ticketsToCancel = Number(document.getElementById("ticket-count").value);

  if (!bookingIdInput || ticketsToCancel <= 0) {
    alert("Please enter a valid Booking ID and number of tickets.");
    return;
  }

  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const booking = bookings.find(b => b.id == bookingIdInput);

  if (!booking) {
    alert("Booking ID not found.");
    return;
  }

  const schedule = getScheduleById(booking.trainId);

  if (!schedule) {
    alert("Train schedule not found.");
    return;
  }

  const result = cancelBooking(schedule, ticketsToCancel);

  if (!result.success) {
    alert("Error: " + result.message);
    return;
  }

  const updateResult = updateBookingHistory(bookingIdInput, ticketsToCancel);

  if (updateResult.success) {
    alert(updateResult.message);
  } else {
    alert("Error: " + updateResult.message);
  }
});