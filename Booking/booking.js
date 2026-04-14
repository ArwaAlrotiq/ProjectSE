// ================================================
// S10: Transactional Integrity & Rollback
// ================================================
export function bookWithRollback(scheduleId, numberOfTickets = 1) {
  // Step 1: Backup current state
  const schedules = JSON.parse(localStorage.getItem('trainSchedules') || '[]');
  const backupSchedules = JSON.stringify(schedules);
  const backupBookings = localStorage.getItem("bookings");

  try {
    // Step 2: Get schedule
    const schedule = getScheduleById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    // Step 3: Attempt booking
    const result = bookTickets(schedule, numberOfTickets);
    if (!result.success) {
      throw new Error(result.message);
    }

    // Step 4: Success
    return { success: true, message: result.message };

  } catch (error) {
    // Step 5: Rollback
    localStorage.setItem('trainSchedules', backupSchedules);
    if (backupBookings) {
      localStorage.setItem("bookings", backupBookings);
    }
    return { success: false, message: "Booking failed: " + error.message };
  }
}

// ================================================
// Rebook Existing Ticket
// ================================================
export function rebookExistingTicket(bookingId, additionalTickets) {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const bookingIndex = bookings.findIndex(b => b.id == bookingId);

  if (bookingIndex === -1) {
    return { success: false, message: "Booking ID not found." };
  }

  const currentBooking = bookings[bookingIndex];

  if (currentBooking.status === "Cancelled") {
    return { 
      success: false, 
      message: "Cannot add seats to a cancelled booking. Please create a new booking." 
    };
  }

  const schedules = JSON.parse(localStorage.getItem('trainSchedules') || '[]');
  const schedule = schedules.find(s => s.trainName === currentBooking.train);

  if (!schedule) {
    return { success: false, message: "Train schedule not found." };
  }

  if (schedule.availableSeats < additionalTickets) {
    return { 
      success: false, 
      message: `Not enough seats in train. Available: ${schedule.availableSeats}` 
    };
  }

  // Update seats
  schedule.availableSeats -= additionalTickets;
  if (schedule.availableSeats === 0) {
    schedule.status = 'Sold Out';
  }

  currentBooking.seat += additionalTickets;

  updateScheduleInStorage(schedule);
  bookings[bookingIndex] = currentBooking;
  localStorage.setItem("bookings", JSON.stringify(bookings));

  return {
    success: true,
    message: `Successfully added ${additionalTickets} seats! Total seats now: ${currentBooking.seat}`,
    updatedBooking: currentBooking
  };
}

// ================================================
// S24: Restore Data
// ================================================
function restoreData() {
  const savedBookings = JSON.parse(localStorage.getItem("savedBookings")) || [];
  if (savedBookings.length === 0) {
    alert("No saved data to restore.");
    return;
  }
  localStorage.setItem("bookings", JSON.stringify(savedBookings));
  alert("Data restored successfully!");
}

// ================================================
// Check Seat Availability
// ================================================
export function checkAvailability(schedule) {
  if (!schedule) {
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

// ================================================
// Book Tickets
// ================================================
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
      message: `Not enough seats. Available: ${schedule.availableSeats}`,
      schedule: schedule
    };
  }

  const updatedSchedule = { ...schedule };
  updatedSchedule.availableSeats -= numberOfTickets;

  updatedSchedule.status = updatedSchedule.availableSeats === 0 ? 'Sold Out' : 'Available';

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

// ================================================
// Update Schedule in Storage
// ================================================
export function updateScheduleInStorage(updatedSchedule) {
  const schedules = JSON.parse(localStorage.getItem('trainSchedules') || '[]');
  const index = schedules.findIndex(s => s.id === updatedSchedule.id);
  if (index !== -1) {
    schedules[index] = updatedSchedule;
    localStorage.setItem('trainSchedules', JSON.stringify(schedules));
  }
}

// ================================================
// Get Schedule by ID
// ================================================
export function getScheduleById(scheduleId) {
  const schedules = JSON.parse(localStorage.getItem('trainSchedules') || '[]');
  return schedules.find(s => s.id === scheduleId);
}

// ================================================
// Save Booking to History
// ================================================
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