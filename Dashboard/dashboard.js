/* ================================
   Dashboard Initialization
================================ */
function initDashboard() {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const schedules = JSON.parse(localStorage.getItem("trainSchedules") || []);

    updateSummaryCards(bookings, schedules);
    renderUtilizationCharts(bookings, schedules);
    renderUtilizationTable();
    renderOccupancyChart();
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
   UTILIZATION TABLE
================================ */
function calculateUtilization() {
    const schedules = JSON.parse(localStorage.getItem("trainSchedules") || "[]");
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    return schedules.map(schedule => {
        const bookedSeats = bookings
            .filter(b => b.trainId == schedule.id && b.status === "Confirmed")
            .reduce((sum, b) => sum + Number(b.seat), 0);

        const capacity = Number(schedule.seatCapacity);
        const percentage = ((bookedSeats / capacity) * 100).toFixed(1);

        return {
            trainName: schedule.trainName,
            bookedSeats,
            capacity,
            percentage,
            level: getUtilizationLevel(percentage)
        };
    });
}

function getUtilizationLevel(percentage) {
    percentage = Number(percentage);
    if (percentage >= 75) return "high";
    if (percentage >= 40) return "medium";
    return "low";
}

function renderUtilizationTable() {
    const data = calculateUtilization();
    const container = document.getElementById("utilization-table");

    if (!container) return;

    if (data.length === 0) {
        container.innerHTML = `<p class="empty-msg">No schedule data available.</p>`;
        return;
    }

    const rows = data.map(item => `
        <tr class="utilization-${item.level}">
            <td>${item.trainName}</td>
            <td>${item.percentage}%</td>
            <td class="level-badge ${item.level}">${item.level.toUpperCase()}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Train</th>
                    <th>Utilization</th>
                    <th>Level</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

/* ================================
   OCCUPANCY CHART
================================ */
function renderOccupancyChart() {
    const data = calculateUtilization();
    const canvas = document.getElementById("occupancyChart");

    if (!canvas) return;

    const labels = data.map(item => item.trainName);
    const percentages = data.map(item => Number(item.percentage));

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Occupancy Rate (%)",
                data: percentages,
                backgroundColor: "#007bff",
                borderColor: "#0056b3",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}

/* ================================
   Initialize Dashboard
================================ */
document.addEventListener("DOMContentLoaded", initDashboard);