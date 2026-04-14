/* ============================================================
   Imports
============================================================ */
import { updateScheduleInStorage, getScheduleById } from './booking.js';

/* ============================================================
   Max Capacity Check
============================================================ */
function checkMaxCapacity(schedule, additionalSeats) {
  const maxCapacity = schedule.maxCapacity || schedule.totalSeats;
  const newAvailableSeats = schedule.availableSeats + additionalSeats;

  if (newAvailableSeats > maxCapacity) {
    return {
      exceedsMax: true,
      message: `Warning: seats after increment (${newAvailableSeats}) exceed max capacity (${maxCapacity})`,
      adjustedSeats: maxCapacity
    };
  }

  return {
    exceedsMax: false,
    adjustedSeats: newAvailableSeats
  };
}

/* ============================================================
   Cancel Booking (Main Logic)
============================================================ */
export function cancelBooking(schedule, numberOfTickets = 1) {
  if (numberOfTickets <= 0) {
    return {
      success: false,
      message: 'Number of tickets must be greater than zero'
    };
  }

  if (!schedule) {
    return {
      success: false,
      message: 'Schedule not found'
    };
  }

  const updatedSchedule = { ...schedule };
  const capacityCheck = checkMaxCapacity(updatedSchedule, numberOfTickets);

  updatedSchedule.availableSeats = capacityCheck.adjustedSeats;

  if (schedule.status === 'Sold Out' || schedule.status === 'Full') {
    updatedSchedule.status = 'Available';
  }

  updateScheduleInStorage(updatedSchedule);

  return {
    success: true,
    message: `Successfully cancelled ${numberOfTickets} ticket(s)! Available seats now: ${updatedSchedule.availableSeats}`,
    schedule: updatedSchedule
  };
}

/* ============================================================
   Update Booking History
============================================================ */
function updateBookingHistory(bookingId, countToRemove) {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
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

  const scheduleId = typeof selectedTrainId !== "undefined" ? selectedTrainId : "1";
  const schedule = getScheduleById(scheduleId);

  const result = cancelBooking(schedule, ticketsToCancel);

  if (result.success) {
    const updateResult = updateBookingHistory(bookingIdInput, ticketsToCancel);

    if (updateResult.success) {
      alert(updateResult.message);
    } else {
      alert("Error: " + updateResult.message);
    }
  } else {
    alert("Error: " + result.message);
  }
});