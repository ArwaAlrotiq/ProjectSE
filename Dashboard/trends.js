import { checkAuth } from '../Login/auth.js';
checkAuth();
/* ================================
   Build Trends UI
================================ */
function setupTrendsUI() {
    const container = document.createElement('div');
    container.id = 'trends-section';
    container.style.cssText = `
        margin: 20px; padding: 20px; border: 1px solid #ddd;
        border-radius: 10px; background: #fff; font-family: sans-serif;
    `;
    
    container.innerHTML = `
        <h2 style="text-align:center;">Reservation Trends</h2>
        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
            <button id="btnDaily" class="trend-btn">Daily</button>
            <button id="btnWeekly" class="trend-btn">Weekly</button>
            <button id="btnMonthly" class="trend-btn">Monthly</button>
        </div>
        <canvas id="reservationTrendsChart"></canvas>
    `;

    document.body.appendChild(container);

    document.getElementById('btnDaily').onclick = () => updateTrends('daily');
    document.getElementById('btnWeekly').onclick = () => updateTrends('weekly');
    document.getElementById('btnMonthly').onclick = () => updateTrends('monthly');

    updateTrends('weekly');
}

let trendsChart;

/* ================================
   Extract Real Booking Data
================================ */
function getBookings() {
    return JSON.parse(localStorage.getItem("bookings") || "[]")
        .filter(b => b.status === "Confirmed");
}

/* ================================
   DAILY TREND (Today)
================================ */
function getDailyTrend() {
    const bookings = getBookings();
    const hours = ["8 AM", "12 PM", "4 PM", "8 PM"];
    const counts = [0, 0, 0, 0];

    bookings.forEach(b => {
        const hour = new Date(b.date).getHours();

        if (hour < 10) counts[0]++;
        else if (hour < 14) counts[1]++;
        else if (hour < 18) counts[2]++;
        else counts[3]++;
    });

    return { labels: hours, data: counts };
}

/* ================================
   WEEKLY TREND (Last 7 Days)
================================ */
function getWeeklyTrend() {
    const bookings = getBookings();
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    bookings.forEach(b => {
        const day = new Date(b.date).getDay();
        counts[day]++;
    });

    return { labels, data: counts };
}

/* ================================
   MONTHLY TREND (Last 4 Months)
================================ */
function getMonthlyTrend() {
    const bookings = getBookings();
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const counts = new Array(12).fill(0);

    bookings.forEach(b => {
        const month = new Date(b.date).getMonth();
        counts[month]++;
    });

    return { labels, data: counts };
}

/* ================================
   Update Chart
================================ */
function updateTrends(type) {
    const ctx = document.getElementById('reservationTrendsChart').getContext('2d');

    let trendData;

    if (type === "daily") trendData = getDailyTrend();
    else if (type === "weekly") trendData = getWeeklyTrend();
    else trendData = getMonthlyTrend();

    if (trendsChart) trendsChart.destroy();

    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trendData.labels,
            datasets: [{
                label: `Reservations (${type})`,
                data: trendData.data,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                fill: true,
                tension: 0.3
            }]
        }
    });
}

/* ================================
   Run on load
================================ */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTrendsUI);
} else {
    setupTrendsUI();
}