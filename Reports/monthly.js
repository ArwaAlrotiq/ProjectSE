function generateMonthlyReport() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    let totalRevenue = 0;
    let totalSeats = 0;
    let totalConfirmed = 0;
    const trainIds = new Set();
    const monthlyStats = {};

    bookings.forEach(booking => {
        if (booking.status === "Confirmed") {
            totalConfirmed++;

            const date = booking.bookingTime
                ? new Date(booking.bookingTime)
                : new Date();

            const monthLabel = date.toLocaleString('en-US', {
                month: 'long',
                year: 'numeric'
            });

            if (!monthlyStats[monthLabel]) monthlyStats[monthLabel] = 0;
            monthlyStats[monthLabel] += 1;

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

    document.getElementById("totalRevenueMonth").textContent =
        totalRevenue.toLocaleString('en-US') + " SAR";

    document.getElementById("totalSeatsMonth").textContent =
        totalSeats.toLocaleString('en-US');

    document.getElementById("totalBookingsMonth").textContent =
        totalConfirmed.toLocaleString('en-US');

    document.getElementById("totalTrainsMonth").textContent =
        trainIds.size.toLocaleString('en-US');

    const labels = Object.keys(monthlyStats);
    const data = Object.values(monthlyStats);

    renderMonthlyChart(labels, data);
}

function renderMonthlyChart(labels, data) {
    const ctx = document.getElementById("monthlyReportChart").getContext("2d");

    if (window.myMonthlyChart) window.myMonthlyChart.destroy();

    window.myMonthlyChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Monthly Bookings",
                data: data,
                fill: true,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "#3b82f6",
                tension: 0.4
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
                        callback: function (value) {
                            if (value % 1 === 0) return value;
                        }
                    }
                }
            }
        }
    });
}