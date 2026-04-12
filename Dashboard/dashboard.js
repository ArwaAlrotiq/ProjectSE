function initDashboard() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const schedules = JSON.parse(localStorage.getItem("trainSchedules")) || [];

    updateSummaryCards(bookings, schedules.length);

    const chartsContainer = document.getElementById("chartsContainer");
    chartsContainer.innerHTML = "";

    schedules.forEach((train, index) => {
        const booked = bookings
            .filter(b => b.train === train.name && b.status === "Confirmed")
            .reduce((sum, b) => sum + (b.seat * b.numberOfSeats || 1), 0);

        const capacity = train.capacity || 50;
        const utilization = ((booked / capacity) * 100).toFixed(1);

        const chartWrapper = document.createElement("div");
        chartWrapper.className = "chart-wrapper";
        chartWrapper.innerHTML = `<h4>${train.name}</h4>`;

        const canvas = document.createElement("canvas");
        const canvasId = `chart_${index}`;
        canvas.id = canvasId;

        chartWrapper.appendChild(canvas);
        chartsContainer.appendChild(chartWrapper);

        renderDoughnut(canvasId, booked, capacity, utilization);
    });
}

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

function updateSummaryCards(bookings, trainCount) {
    let revenue = 0;
    let confirmedCount = 0;

    bookings.forEach(b => {
        if (b.status === "Confirmed") {
            confirmedCount++;
            revenue += (b.price * (b.seat || 1));
        }
    });

    document.getElementById("totalTrains").textContent = trainCount;
    document.getElementById("totalBookings").textContent = confirmedCount;
    document.getElementById("totalRevenue").textContent = revenue + " SAR";
}