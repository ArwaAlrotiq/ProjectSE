let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

const now = new Date();
const weekStart = new Date();
weekStart.setDate(now.getDate() - 7);

let weeklyCount = bookings.filter(b => {
    let bookingDate = new Date(b.date);
    return bookingDate >= weekStart && bookingDate <= now;
});

document.getElementById("weeklyReport").textContent = weeklyCount.length;