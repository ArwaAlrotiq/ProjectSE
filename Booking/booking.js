import { checkAuth } from '../Login/auth.js';
checkAuth();
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
  const schedules = JSON.parse(localStorage.getItem('trainSchedules') || '[]');
  return schedules.find(s => String(s.id).trim() === String(id).trim());
}

export function updateScheduleInStorage(updatedSchedule) {
  const schedules = loadSchedules();
  const index = schedules.findIndex(s => String(s.id) === String(updatedSchedule.id));


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
    date: new Date().toISOString(),
    seat: numberOfTickets,
    passengerName,
    totalPrice: (schedule.ticketPrice || 0) * numberOfTickets,
    status: "Confirmed"
  };

  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  return booking;
}

// ================================================
// BOOK TICKETS (MAIN FUNCTION)
// ================================================
export function bookTickets(trainId, tickets, passengerName, passengerId) {

  passengerName = passengerName === "Passenger"
    ? localStorage.getItem("selectedPassengerName")
    : passengerName;

  let schedules = JSON.parse(localStorage.getItem("trainSchedules") || "[]");
  let bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  const schedule = schedules.find(s => s.id == trainId);
  if (!schedule) {
    return { success: false, message: "Train schedule not found" };
  }

  if (schedule.availableSeats < tickets) {
    return { success: false, message: "Not enough seats available" };
  }

  schedule.availableSeats -= tickets;

  const booking = {
    id: Date.now(),
    passengerId: passengerId,
    passengerName: passengerName,
    trainId: trainId,
    trainName: schedule.trainName,
    date: new Date().toISOString(),
    seat: tickets,
    ticketPrice: schedule.ticketPrice,
    totalPrice: tickets * schedule.ticketPrice,
    status: "Confirmed"
  };

  bookings.push(booking);

  localStorage.setItem("trainSchedules", JSON.stringify(schedules));
  localStorage.setItem("bookings", JSON.stringify(bookings));
  localStorage.setItem("latestBooking", JSON.stringify(booking));

  return { success: true, booking };
}

// ================================================
// CANCEL BOOKING
// ================================================
export function cancelBooking(bookingId, ticketsToCancel) {
  let bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  let schedules = JSON.parse(localStorage.getItem("trainSchedules") || "[]");

  const bookingIndex = bookings.findIndex(b => b.id == bookingId);
  if (bookingIndex === -1) {
    return { success: false, message: "Booking ID not found." };
  }

  const booking = bookings[bookingIndex];
  const schedule = schedules.find(s => s.id == booking.trainId);

  if (!schedule) {
    return { success: false, message: "Train schedule not found." };
  }

  if (ticketsToCancel > booking.seat) {
    return { success: false, message: `You only booked ${booking.seat} seats.` };
  }

  schedule.availableSeats += ticketsToCancel;
  schedule.status = schedule.availableSeats === 0 ? "Sold Out" : "Available";

  booking.seat -= ticketsToCancel;
  booking.totalPrice = booking.seat * booking.ticketPrice;
  booking.status = booking.seat === 0 ? "Cancelled" : "Confirmed";

  bookings[bookingIndex] = booking;
  localStorage.setItem("bookings", JSON.stringify(bookings));
  localStorage.setItem("trainSchedules", JSON.stringify(schedules));

  return {
    success: true,
    message: `Cancelled ${ticketsToCancel} seat(s). Remaining: ${booking.seat}`,
    booking: bookings[bookingIndex]
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
if (booking.seat === 0 || booking.status === "Cancelled") {
  return {
    success: false,
    message: "This booking is fully cancelled. Please create a new booking."
  };
}

  if (!schedule) {
    return { success: false, message: "Schedule not found." };
  }

  if (schedule.availableSeats < additionalTickets) {
    return { success: false, message: `Not enough seats. Available: ${schedule.availableSeats}` };
  }

  schedule.availableSeats -= additionalTickets;
  schedule.status = schedule.availableSeats === 0 ? "Sold Out" : "Available";
  updateScheduleInStorage(schedule);

  booking.seat += additionalTickets;
  booking.totalPrice = booking.seat * (booking.ticketPrice || schedule.ticketPrice || 0);

  bookings[bookingIndex] = booking;
  localStorage.setItem("bookings", JSON.stringify(bookings));
  localStorage.setItem("latestBooking", JSON.stringify(booking));
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
// ===============================
// SUPPORT REBOOK PAGE
// ===============================
if (document.getElementById("rebook-btn")) {

  const bookingIdInput = document.getElementById("booking-id");
  const seatCountInput = document.getElementById("seat-count-rebook");
  const messageArea = document.getElementById("message-area");

  const latestBooking = JSON.parse(localStorage.getItem("latestBooking"));
  if (latestBooking) {
    bookingIdInput.value = latestBooking.id;
  }

  document.getElementById("rebook-btn").addEventListener("click", () => {
    const bookingId = bookingIdInput.value;
    const additionalSeats = Number(seatCountInput.value);

    if (!bookingId) {
      messageArea.innerHTML = `<p style="color:red;">Booking ID missing.</p>`;
      return;
    }

    if (additionalSeats < 1) {
      messageArea.innerHTML = `<p style="color:red;">Enter at least 1 seat.</p>`;
      return;
    }

    const result = rebookExistingTicket(bookingId, additionalSeats);

    if (result.success) {
      messageArea.innerHTML = `<p style="color:green;">${result.message}</p>`;
      localStorage.setItem("latestBooking", JSON.stringify(result.booking));
      setTimeout(() => {
        window.location.href = "../Booking/confirm.html";
      }, 800);

    } else {
      messageArea.innerHTML = `<p style="color:red;">${result.message}</p>`;
    }
  });
}