function generateWeeklyReport() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    let totalRevenue = 0;
    let totalSeats = 0;
    let totalConfirmed = 0;
    const trainIds = new Set();
    const weeklyStats = {};

    bookings.forEach(booking => {
        if (booking.status === "Confirmed") {
            totalConfirmed++;

            const date = booking.bookingTime
                ? new Date(booking.bookingTime)
                : new Date();

            const firstDay = new Date(date.getFullYear(), 0, 1);
            const weekNum = Math.ceil(
                ((date - firstDay) / 86400000 + firstDay.getDay() + 1) / 7
            );

            const weekLabel = "Week " + weekNum;

            if (!weeklyStats[weekLabel]) weeklyStats[weekLabel] = 0;
            weeklyStats[weekLabel] += 1;

            const price = parseFloat(booking.totalPrice) || 0;

            const seats =
                parseInt(booking.seatCount) ||
                parseInt(booking.numberOfSeats) ||
                1;

            totalRevenue += price;
            totalSeats += seats;

            if (booking.trainId) trainIds.add(booking.trainId);
        }
    });

    document.getElementById("totalRevenueWeek").textContent =
        totalRevenue.toLocaleString('en-US') + " SAR";

    document.getElementById("totalSeatsWeek").textContent =
        totalSeats.toLocaleString('en-US');

    document.getElementById("totalBookingsWeek").textContent =
        totalConfirmed.toLocaleString('en-US');

    document.getElementById("totalTrainsWeek").textContent =
        trainIds.size.toLocaleString('en-US');

    const labels = Object.keys(weeklyStats);
    const data = Object.values(weeklyStats);

    renderWeeklyChart(labels, data);
}

function renderWeeklyChart(labels, data) {
    const ctx = document.getElementById("weeklyReportChart").getContext("2d");

    if (window.myWeeklyChart) window.myWeeklyChart.destroy();

    window.myWeeklyChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Weekly Bookings",
                data: data,
                backgroundColor: "#10b981",
                borderRadius: 5
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (value % 1 === 0) return value;
                        }
                    }
                }
            }
        }
    });
}