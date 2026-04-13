function setupTrendsUI() {
    const container = document.createElement('div');
    container.id = 'trends-section';
    container.style.cssText = 'margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #fff; font-family: sans-serif;';
    
    container.innerHTML = `
        <h2 style="text-align:center;">Reservation Trends</h2>
        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
            <button id="btnDaily" style="padding: 10px 20px; cursor: pointer; border-radius: 5px; border: 1px solid #ccc;">Daily</button>
            <button id="btnWeekly" style="padding: 10px 20px; cursor: pointer; border-radius: 5px; border: 1px solid #ccc;">Weekly</button>
            <button id="btnMonthly" style="padding: 10px 20px; cursor: pointer; border-radius: 5px; border: 1px solid #ccc;">Monthly</button>
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
function updateTrends(type) {
    const ctx = document.getElementById('reservationTrendsChart').getContext('2d');
    
    const configs = {
        daily: { labels: ['8am', '12pm', '4pm', '8pm'], data: [10, 25, 15, 30] },
        weekly: { labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], data: [100, 120, 90, 150, 130, 180, 200] },
        monthly: { labels: ['Jan', 'Feb', 'Mar', 'Apr'], data: [500, 700, 650, 900] }
    };

    if (trendsChart) trendsChart.destroy();

    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: configs[type].labels,
            datasets: [{
                label:`Reservations (${type})` ,
                data: configs[type].data,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                fill: true,
                tension: 0.3
            }]
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTrendsUI);
} else {
    setupTrendsUI();
}