import { checkAuth } from '../Login/auth.js';
checkAuth();
function generateMonthlyReport() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    let totalRevenue = 0;
    let totalSeats = 0;
    let totalConfirmed = 0;
    const trainIds = new Set();

    const monthlyStats = new Array(12).fill(0);

    bookings.forEach(booking => {
        if (booking.status === "Confirmed") {
            totalConfirmed++;

            const date = booking.date ? new Date(booking.date) : new Date();
            const monthIndex = date.getMonth(); // 0 → Jan ... 11 → Dec

            monthlyStats[monthIndex]++;

            const price = Number(booking.totalPrice) || 0;
            totalRevenue += price;

            const seats = Number(booking.seat) || 1;
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

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    renderMonthlyChart(labels, monthlyStats);
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
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderColor: "#3b82f6",
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: "#3b82f6"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}
window.addEventListener('load', generateMonthlyReport);