function loadBookings() {
  return JSON.parse(localStorage.getItem("bookings") || "[]");
}

const passengerId = localStorage.getItem("selectedPassengerId");
const tableBody = document.getElementById("booking-table-body");

function renderBookings() {
  const bookings = loadBookings().filter(
    b => String(b.passengerId) === String(passengerId)
  );

  if (bookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6">No bookings found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";

  bookings.forEach(b => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${b.trainName || "—"}</td>
      <td>${b.date || "—"}</td>
      <td>${b.seat ?? "—"}</td>
      <td>${b.totalPrice != null ? b.totalPrice + " SAR" : "—"}</td>
      <td>${b.status || "—"}</td>
      <td>
        <button class="btn-cancel" onclick="cancelDirect('${b.id}')">Cancel Seats</button>
        <button class="btn-extra" onclick="extraDirect('${b.id}')">Add Seats</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

window.cancelDirect = function (bookingId) {
  localStorage.setItem("directBookingId", bookingId);
  window.location.href = "../Booking/cancellation.html";
};

window.extraDirect = function (bookingId) {
  localStorage.setItem("directBookingId", bookingId);
  window.location.href = "../Booking/booking.html";
};

renderBookings();