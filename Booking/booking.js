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

function saveBookingToHistory(schedule, numberOfTickets){

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