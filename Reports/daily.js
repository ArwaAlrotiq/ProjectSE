function generateComprehensiveReport() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const schedules = JSON.parse(localStorage.getItem("trainSchedules")) || [];

    let totalRevenue = 0;
    let totalSeats = 0;
    let confirmedBookings = 0;

    const dailyStats = {};

    const distinctTrainsInBookings = [
        ...new Set(bookings.map(b => b.trainName || "Unknown Train"))
    ];

    const displayTotalTrains = Math.max(schedules.length, distinctTrainsInBookings.length);

    bookings.forEach(booking => {
        if (booking.status === "Confirmed") {
            confirmedBookings++;

            const seats = booking.seatCount || booking.numberOfSeats || 1;
            const price = booking.totalPrice || booking.ticketPrice || 0;

            totalSeats += seats;
            totalRevenue += price;

            const date = booking.bookingTime
                ? new Date(booking.bookingTime).toLocaleDateString()
                : new Date().toLocaleDateString();

            if (!dailyStats[date]) {
                dailyStats[date] = 0;
            }
            dailyStats[date] += 1;
        }
    });

    document.getElementById("totalRevenue").textContent = totalRevenue + " SAR";
    document.getElementById("totalSeats").textContent = totalSeats;
    document.getElementById("totalBookings").textContent = confirmedBookings;
    document.getElementById("totalTrains").textContent = displayTotalTrains;

    const labels = Object.keys(dailyStats);
    const data = Object.values(dailyStats);

    renderChart(labels, data);
}

function renderChart(labels, data) {
    const ctx = document.getElementById("dailyReportChart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Daily Bookings",
                data: data,
                backgroundColor: "#3498db",
                borderColor: "#2c3e50",
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Daily Booking Statistics"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}