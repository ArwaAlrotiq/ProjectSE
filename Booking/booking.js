// S24: Restore data functionality

function restoreData() {
    const savedBookings = JSON.parse(localStorage.getItem("savedBookings")) || [];

    if(savedBookings.length === 0) {
        alert("No saved data to restore.");
        return;
    }

    localStorage.setItem("bookings", JSON.stringify(savedBookings));

    alert("Data restored successfully!");
}
