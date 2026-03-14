// S24: Restore data functionality
function restoreData() {
    const savedBookings = JSON.parse(localStorage.getItem("savedBookings")) || [];
    if(savedBookings.length === 0) {
        alert("No saved data to restore.");
        return;
    }
    localStorage.setItem("bookings", JSON.stringify(savedBookings));
    alert("Data restored successfully!");
}

/**
 * Booking Management Module
 * Handles seat decrement after successful booking
 */
export function checkAvailability(schedule) {
  if (!schedule) {
    console.error('Schedule not found');
    return { available: false, message: 'Schedule not found' };
  }
  if (schedule.availableSeats <= 0) {
    return { 
      available: false, 
      message: 'Sorry, this trip is sold out. No seats available.' 
    };
  }
  return { available: true, message: 'Seats available' };
}

export function bookTickets(schedule, numberOfTickets = 1) {
  if (numberOfTickets <= 0) {
    return {
      success: false,
      message: 'Number of tickets must be greater than zero',
      schedule: schedule
    };
  }

  const availability = checkAvailability(schedule);
  if (!availability.available) {
    return {
      success: false,
      message: availability.message,
      schedule: schedule
    };
  }

  if (numberOfTickets > schedule.availableSeats) {
    return {
      success: false,
      message: `Available seats (${schedule.availableSeats}) is less than requested tickets (${numberOfTickets})`,
      schedule: schedule
    };
  }

  const updatedSchedule = { ...schedule };
  updatedSchedule.availableSeats -= numberOfTickets;

  if (updatedSchedule.availableSeats === 0) {
    updatedSchedule.status = 'Sold Out';
  } else {
    updatedSchedule.status = 'Available';
  }

  updateScheduleInStorage(updatedSchedule);
  saveBookingToHistory(updatedSchedule, numberOfTickets);
  
  return {
    success: true,
    message: `Booking successful! ${numberOfTickets} ticket(s) booked. Remaining seats: ${updatedSchedule.availableSeats}`,
    schedule: updatedSchedule,
    bookingDetails: {
      ticketsBooked: numberOfTickets,
      remainingSeats: updatedSchedule.availableSeats,
      bookingTime: new Date().toISOString()
    }
  };
}

function updateScheduleInStorage(updatedSchedule) {
  const schedules = JSON.parse(localStorage.getItem('trainSchedules') || '[]');
  const index = schedules.findIndex(s => s.id === updatedSchedule.id);
  if (index !== -1) {
    schedules[index] = updatedSchedule;
    localStorage.setItem('trainSchedules', JSON.stringify(schedules));
  }
}

export function getScheduleById(scheduleId) {
  const schedules = JSON.parse(localStorage.getItem('trainSchedules') || '[]');
  return schedules.find(s => s.id === scheduleId);
}

function saveBookingToHistory(schedule, numberOfTickets) {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const booking = {
    id: Date.now(),
    train: schedule.trainName || "Train",
    date: schedule.departureTime || new Date().toLocaleDateString(),
    seat: numberOfTickets,
    status: "Confirmed"
  };
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

// ================================
// S10: Transactional Integrity & Rollback 
// ================================
export function bookWithRollback(scheduleId, numberOfTickets = 1) {
  // Step 1: Get current state (backup)
  const schedules = JSON.parse(localStorage.getItem('trainSchedules') || '[]');
  const backupSchedules = JSON.stringify(schedules);
  const backupBookings = localStorage.getItem("bookings");

  try {
    // Step 2: Get the schedule
    const schedule = getScheduleById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    // Step 3: Try to book
    const result = bookTickets(schedule, numberOfTickets);
    if (!result.success) {
      throw new Error(result.message);
    }

    // Step 4: Success
    return { success: true, message: result.message };

  } catch (error) {
    // Step 5: Something went wrong — rollback everything
    localStorage.setItem('trainSchedules', backupSchedules);
    if (backupBookings) {
      localStorage.setItem("bookings", backupBookings);
    }
    return { success: false, message: "Booking failed: " + error.message };
  }
}