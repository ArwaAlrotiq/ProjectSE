import { getScheduleById, bookTickets } from './booking.js';

document.getElementById("reserve-btn").addEventListener("click", () => {
  const scheduleId = selectedTrainId; 
  const tickets = Number(document.getElementById("ticket-count").value);

  const schedule = getScheduleById(scheduleId);
  const result = bookTickets(schedule, tickets);

  alert(result.message);
});
