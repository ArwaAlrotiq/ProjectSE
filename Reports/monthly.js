let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
const now = new Date();

let monthlyCount = bookings.filter(b => {
    let bookingDate = new Date(b.date);
    return bookingDate.getMonth() === now.getMonth() &&
           bookingDate.getFullYear() === now.getFullYear();
});

document.getElementById("monthlyReport").textContent = monthlyCount.length;