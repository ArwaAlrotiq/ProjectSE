/**
 * Cancellation Management Module
 * Handles seat increment after booking cancellation
 */
import { updateScheduleInStorage, getScheduleById } from './booking.js';

function checkMaxCapacity(schedule, additionalSeats) {
  const maxCapacity = schedule.maxCapacity || schedule.totalSeats;
  const newAvailableSeats = schedule.availableSeats + additionalSeats;

  if (newAvailableSeats > maxCapacity) {
    return {
      exceedsMax: true,
      message: `Warning: seats after increment (${newAvailableSeats}) exceeds max capacity (${maxCapacity})`,
      adjustedSeats: maxCapacity
    };
  }

  return {
    exceedsMax: false,
    adjustedSeats: newAvailableSeats
  };
}

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
