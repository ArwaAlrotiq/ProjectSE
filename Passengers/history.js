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