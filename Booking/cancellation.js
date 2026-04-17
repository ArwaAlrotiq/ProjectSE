import { checkAuth } from '../Login/auth.js';
import { cancelBooking } from './booking.js';
checkAuth();

document.addEventListener("DOMContentLoaded", () => {

  const bookingInput = document.getElementById("booking-id-input");
  const cancelBtn = document.getElementById("cancel-btn");
  const messageArea = document.getElementById("message-area");

  const directId = localStorage.getItem("directBookingId");
  if (directId) {
    bookingInput.value = directId;
  }

  cancelBtn.addEventListener("click", () => {

    const bookingId = bookingInput.value.trim();
    const ticketsToCancel = Number(document.getElementById("ticket-count").value);

    if (!bookingId || ticketsToCancel <= 0) {
      messageArea.innerHTML = `<p class="error">Please enter a valid number of tickets.</p>`;
      return;
    }

    const result = cancelBooking(bookingId, ticketsToCancel);

    if (result.success) {

      if (result.booking.seat === 0 || result.booking.status === "Cancelled") {
        window.location.href = "../Passengers/passenger-bookings.html"; 
        return;
      }

      localStorage.setItem("latestBooking", JSON.stringify(result.booking));
      window.location.href = "confirm.html";
    }
    else {
      messageArea.innerHTML = `<p class="error">${result.message}</p>`;
    }

  });

});