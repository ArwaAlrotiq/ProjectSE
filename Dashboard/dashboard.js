/* ================================
   Dashboard Initialization
================================ */
function initDashboard() {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const schedules = JSON.parse(localStorage.getItem("trainSchedules") || []);

    updateSummaryCards(bookings, schedules);
    renderUtilizationCharts(bookings, schedules);
}

/* ================================
   Summary Cards
================================ */
function updateSummaryCards(bookings, schedules) {
    let totalRevenue = 0;
    let confirmedBookings = 0;

    bookings.forEach(b => {
        if (b.status === "Confirmed") {
            confirmedBookings++;

            const schedule = schedules.find(s => s.id == b.trainId);
            if (schedule) {
                totalRevenue += schedule.ticketPrice * b.seat;
            }
        }
    });

    document.getElementById("totalTrains").textContent = schedules.length;
    document.getElementById("totalBookings").textContent = confirmedBookings;
    document.getElementById("totalRevenue").textContent = totalRevenue + " SAR";
}

/* ================================
   Render Train Utilization Charts
================================ */
function renderUtilizationCharts(bookings, schedules) {
    const chartsContainer = document.getElementById("chartsContainer");
    chartsContainer.innerHTML = "";

    schedules.forEach((train, index) => {
        const bookedSeats = bookings
            .filter(b => b.trainId == train.id && b.status === "Confirmed")
            .reduce((sum, b) => sum + b.seat, 0);

        const capacity = Number(train.seatCapacity);
        const utilization = ((bookedSeats / capacity) * 100).toFixed(1);

        const chartWrapper = document.createElement("div");
        chartWrapper.className = "chart-wrapper";
        chartWrapper.innerHTML = `<h4>${train.trainName}</h4>`;

        const canvas = document.createElement("canvas");
        const canvasId = `chart_${index}`;
        canvas.id = canvasId;

        chartWrapper.appendChild(canvas);
        chartsContainer.appendChild(chartWrapper);

        renderDoughnut(canvasId, bookedSeats, capacity, utilization);
    });
}

/* ================================
   Doughnut Chart Renderer
================================ */
function renderDoughnut(id, booked, total, percent) {
    const ctx = document.getElementById(id).getContext("2d");
    const empty = Math.max(0, total - booked);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Booked', 'Available'],
            datasets: [{
                data: [booked, empty],
                backgroundColor: ['#3498db', '#ecf0f1'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: percent + "% Occupied" },
                legend: { display: false }
            },
            cutout: '70%'
        }
    });
}

/* ================================
   Initialize Dashboard
================================ */
document.addEventListener("DOMContentLoaded", initDashboard);