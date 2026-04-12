/**
 * Cancellation Management Module
 * Handles seat increment after booking cancellation
 */

import { updateScheduleInStorage, getScheduleById } from './booking.js';

/**
 * Checks if adding seats after cancellation exceeds the maximum capacity
 */
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

/**
 * Cancels tickets and updates the schedule accordingly
 */
export function cancelBooking(schedule, numberOfTickets = 1) {
  if (numberOfTickets <= 0) {
    return {
      success: false,
      message: 'Number of tickets must be greater than zero',
      schedule: schedule
    };
  }

  if (!schedule) {
    return {
      success: false,
      message: 'Schedule not found',
      schedule: null
    };
  }

  const updatedSchedule = { ...schedule };

  const capacityCheck = checkMaxCapacity(updatedSchedule, numberOfTickets);

  if (capacityCheck.exceedsMax) {
    updatedSchedule.availableSeats = capacityCheck.adjustedSeats;
    console.warn(capacityCheck.message);
  } else {
    updatedSchedule.availableSeats = capacityCheck.adjustedSeats;
  }

  // Update status if needed
  if (schedule.status === 'Sold Out' || schedule.status === 'Full') {
    updatedSchedule.status = 'Available';
  } else if (schedule.status !== 'Available') {
    updatedSchedule.status = 'Available';
  }

  updateScheduleInStorage(updatedSchedule);

  return {
    success: true,
    message: `Successfully cancelled ${numberOfTickets} ticket(s)! Available seats now: ${updatedSchedule.availableSeats}`,
    schedule: updatedSchedule,
    cancellationDetails: {
      ticketsCancelled: numberOfTickets,
      availableSeatsAfterCancellation: updatedSchedule.availableSeats,
      statusUpdated: schedule.status !== updatedSchedule.status,
      newStatus: updatedSchedule.status,
      cancellationTime: new Date().toISOString()
    }
  };
}

/**
 * Returns remaining seats and status information
 */
export function getRemainingSeats(schedule) {
  if (!schedule) {
    return {
      seats: 0,
      status: 'Unknown'
    };
  }

  return {
    seats: schedule.availableSeats,
    totalCapacity: schedule.maxCapacity || schedule.totalSeats,
    status: schedule.status,
    isSoldOut: schedule.availableSeats === 0
  };
}

/* ============================================================
   Cancel Button Handler
   ============================================================ */

/**
 * Handles the cancellation button click event
 */
document.getElementById("cancel-btn").addEventListener("click", () => {
  const scheduleId = selectedTrainId;
  const tickets = Number(document.getElementById("ticket-count").value);

  const schedule = getScheduleById(scheduleId);
  const result = cancelBooking(schedule, tickets);

  alert(result.message);
});