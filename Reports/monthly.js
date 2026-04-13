function generateMonthlyReport() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let totalRevenue = 0;
    const monthlyStats = {};

    bookings.forEach(booking => {
        if (booking.status === "Confirmed") {
            const date = new Date(booking.bookingTime);
            const monthLabel = date.toLocaleString('default', { month: 'long', year: 'numeric' });

            if (!monthlyStats[monthLabel]) {
                monthlyStats[monthLabel] = 0;
            }
            monthlyStats[monthLabel] += 1;

            const price = booking.price || 0;
            const seats = booking.seat || 1;
            totalRevenue += price * seats;
        }
    });

    document.getElementById("totalRevenueMonth").textContent = totalRevenue + " SAR";
    const labels = Object.keys(monthlyStats);
    const data = Object.values(monthlyStats);
    renderMonthlyChart(labels, data);
}

function renderMonthlyChart(labels, data) {
    const ctx = document.getElementById("monthlyReportChart").getContext("2d");
    if (window.myMonthlyChart) { window.myMonthlyChart.destroy(); }
    window.myMonthlyChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Monthly Bookings",
                data: data,
                fill: true,
                backgroundColor: "rgba(155, 89, 182, 0.2)",
                borderColor: "#8e44ad",
                tension: 0.4
            }]
        },
        options: { responsive: true }
    });
}