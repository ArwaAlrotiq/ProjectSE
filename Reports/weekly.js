function generateWeeklyReport() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let totalRevenue = 0;
    let confirmedBookings = 0;
    const weeklyStats = {};

    bookings.forEach(booking => {
        if (booking.status === "Confirmed") {
            confirmedBookings++;
            const date = new Date(booking.bookingTime);
            
            // Calculate ISO Week Number
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
            const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            
            const weekLabel = `Week ${weekNumber} (${date.getFullYear()})`;

            if (!weeklyStats[weekLabel]) {
                weeklyStats[weekLabel] = 0;
            }
            weeklyStats[weekLabel] += 1;
            
            const price = booking.price || 0;
            const seats = booking.seat || booking.numberOfSeats || 1;
            totalRevenue += price * seats;
        }
    });

    document.getElementById("totalRevenue").textContent = totalRevenue + " SAR";
    document.getElementById("totalBookings").textContent = confirmedBookings;

    const labels = Object.keys(weeklyStats);
    const data = Object.values(weeklyStats);

    renderWeeklyChart(labels, data);
}

function renderWeeklyChart(labels, data) {
    const ctx = document.getElementById("weeklyReportChart").getContext("2d");

    if (window.myWeeklyChart) {
        window.myWeeklyChart.destroy();
    }

    window.myWeeklyChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Number of Bookings",
                data: data,
                backgroundColor: "#2ecc71",
                borderColor: "#27ae60",
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: "Weekly Booking Trends" }
            },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
    });
}