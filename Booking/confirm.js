import { getScheduleById, cancelBooking } from './cancellation.js';

document.getElementById("cancel-btn").addEventListener("click", () => {
  const scheduleId = selectedTrainId; 
  const tickets = Number(document.getElementById("ticket-count").value);

  const schedule = getScheduleById(scheduleId);
  const result = cancelBooking(schedule, tickets);

  alert(result.message);
});
