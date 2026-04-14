let responseTimes = [];
let performanceChart;


document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Response Time (ms)',
                data: [],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
});

function testPerformance() {
   
    const start = performance.now();

    
    setTimeout(() => {
       
        const end = performance.now();
        const duration = parseFloat((end - start).toFixed(2));

        
        responseTimes.push(duration);
        if (responseTimes.length > 10) responseTimes.shift();

        updateUI(duration);
    }, Math.random() * 400); 
}

function updateUI(current) {
    
    document.getElementById('avg').innerText = current;
    const statusField = document.getElementById('status');

    
    if (current > 250) {
        statusField.innerText = "Slow (Lag)";
        statusField.style.color = "#dc3545";
        alert(`⚠️ Alert: System response is slow! (${current} ms)`);
    } else {
        statusField.innerText = "Excellent";
        statusField.style.color = "#28a745";
    }

    
    performanceChart.data.labels = responseTimes.map((_, i) => `Test ${i + 1}`);
    performanceChart.data.datasets[0].data = responseTimes;
    performanceChart.update();
}