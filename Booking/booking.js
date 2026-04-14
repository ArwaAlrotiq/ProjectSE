// ================================================
// STORAGE HELPERS
// ================================================
function loadSchedules() {
  return JSON.parse(localStorage.getItem("trainSchedules") || "[]");
}

function saveSchedules(schedules) {
  localStorage.setItem("trainSchedules", JSON.stringify(schedules));
}

export function getScheduleById(id) {
  const schedules = loadSchedules();
  return schedules.find(s => s.id == id);
}

export function updateScheduleInStorage(updatedSchedule) {
  const schedules = loadSchedules();
  const index = schedules.findIndex(s => s.id == updatedSchedule.id);

  if (index !== -1) {
    schedules[index] = updatedSchedule;
    saveSchedules(schedules);
  }
}

// ================================================
// CHECK AVAILABILITY
// ================================================
export function checkAvailability(schedule) {
  if (!schedule) {
    return { available: false, message: "Schedule not found" };
  }

  if (schedule.availableSeats <= 0) {
    return { available: false, message: "Sold Out" };
  }

  return { available: true, message: "Seats available" };
}

// ================================================
// SAVE BOOKING HISTORY
// ================================================
function saveBookingToHistory(schedule, numberOfTickets, passengerName = "Passenger") {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  const booking = {
    id: Date.now().toString(),
    trainId: schedule.id,
    train: schedule.trainName,
    date: schedule.departureTime,
    seat: numberOfTickets,
    passengerName,
    status: "Confirmed"
  };

  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

// ================================================
// BOOK TICKETS (MAIN FUNCTION)
// ================================================
export function bookTickets(schedule, numberOfTickets = 1, passengerName = "Passenger") {
  if (!schedule) {
    return { success: false, message: "Schedule not found" };
  }

  if (numberOfTickets <= 0) {
    return { success: false, message: "Invalid ticket count" };
  }

  if (numberOfTickets > schedule.availableSeats) {
    return { success: false, message: `Not enough seats. Available: ${schedule.availableSeats}` };
  }

  const updatedSchedule = { ...schedule };
  updatedSchedule.availableSeats -= numberOfTickets;

  updatedSchedule.status =
    updatedSchedule.availableSeats === 0 ? "Sold Out" : "Available";

  updateScheduleInStorage(updatedSchedule);
  saveBookingToHistory(updatedSchedule, numberOfTickets, passengerName);

  return {
    success: true,
    message: `Booked ${numberOfTickets} seat(s). Remaining: ${updatedSchedule.availableSeats}`,
    schedule: updatedSchedule
  };
}

// ================================================
// CANCEL BOOKING
// ================================================
export function cancelBooking(schedule, numberOfTickets = 1) {
  if (!schedule) {
    return { success: false, message: "Schedule not found" };
  }

  if (numberOfTickets <= 0) {
    return { success: false, message: "Invalid ticket count" };
  }

  const updatedSchedule = { ...schedule };
  updatedSchedule.availableSeats += numberOfTickets;

  if (updatedSchedule.availableSeats > updatedSchedule.seatCapacity) {
    updatedSchedule.availableSeats = updatedSchedule.seatCapacity;
  }

  updatedSchedule.status =
    updatedSchedule.availableSeats === 0 ? "Sold Out" : "Available";

  updateScheduleInStorage(updatedSchedule);

  return {
    success: true,
    message: `Cancelled ${numberOfTickets} seat(s). Available now: ${updatedSchedule.availableSeats}`,
    schedule: updatedSchedule
  };
}

// ================================================
// REBOOK EXISTING TICKET
// ================================================
export function rebookExistingTicket(bookingId, additionalTickets) {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const bookingIndex = bookings.findIndex(b => b.id == bookingId);

  if (bookingIndex === -1) {
    return { success: false, message: "Booking ID not found." };
  }

  const booking = bookings[bookingIndex];
  const schedule = getScheduleById(booking.trainId);

  if (!schedule) {
    return { success: false, message: "Schedule not found." };
  }

  if (schedule.availableSeats < additionalTickets) {
    return { success: false, message: `Not enough seats. Available: ${schedule.availableSeats}` };
  }

  schedule.availableSeats -= additionalTickets;
  schedule.status =
    schedule.availableSeats === 0 ? "Sold Out" : "Available";

  booking.seat += additionalTickets;

  updateScheduleInStorage(schedule);
  bookings[bookingIndex] = booking;
  localStorage.setItem("bookings", JSON.stringify(bookings));

  return {
    success: true,
    message: `Added ${additionalTickets} seats. Total now: ${booking.seat}`,
    booking
  };
}

// ================================================
// ROLLBACK BOOKING
// ================================================
export function bookWithRollback(scheduleId, numberOfTickets = 1) {
  const backupSchedules = localStorage.getItem("trainSchedules");
  const backupBookings = localStorage.getItem("bookings");

  try {
    const schedule = getScheduleById(scheduleId);
    const result = bookTickets(schedule, numberOfTickets);

    if (!result.success) throw new Error(result.message);

    return result;

  } catch (err) {
    localStorage.setItem("trainSchedules", backupSchedules);
    localStorage.setItem("bookings", backupBookings);

    return { success: false, message: "Booking failed: " + err.message };
  }
}