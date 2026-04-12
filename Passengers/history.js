function getBookings() {
  const bookings = localStorage.getItem("bookings");
  return bookings ? JSON.parse(bookings) : [];
}

function loadHistory() {
  const tableBody = document.getElementById("historyBody");
  if (!tableBody) return;

  const bookings = getBookings();
  tableBody.innerHTML = "";

  if (bookings.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="5">No booking history found</td>';
    tableBody.appendChild(row);
    return;
  }

  bookings.forEach(function (booking) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${booking.id}</td>
      <td>${booking.train}</td>
      <td>${booking.date}</td>
      <td>${booking.seat}</td>
      <td>${booking.status}</td>
    `;
    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", loadHistory);

const sampleBookings = [
    {
        id: 101,
        train: "Riyadh Express 505",
        date: "2024-06-01",
        seat: 3,
        status: "Confirmed"
    },
    {
        id: 102,
        train: "Jeddah Train",
        date: "2024-06-05",
        seat: 1,
        status: "Confirmed"
    },
    {
        id: 103,
        train: "Damam Train",
        date: "2024-06-10",
        seat: 2,
        status: "Cancelled" 
    }
];

const sampleSchedules = [
    {
        id: "1",
        trainName: "Riyadh Express 505",
        availableSeats: 45,
        maxCapacity: 50,
        status: "Available"
    },
    {
        id: "2",
        trainName: "Jeddah Train",
        availableSeats: 99,
        maxCapacity: 100,
        status: "Available"
    }
];
if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify(sampleBookings));
}
if (!localStorage.getItem('trainSchedules')) {
    localStorage.setItem('trainSchedules', JSON.stringify(sampleSchedules));
}