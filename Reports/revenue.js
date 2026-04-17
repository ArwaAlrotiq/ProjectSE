import { checkAuth } from '../Login/auth.js';
checkAuth();
function calculateRevenuePerTrain() {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const confirmed = bookings.filter(b => b.status === 'Confirmed');

  const revenueByTrain = {};

  confirmed.forEach(booking => {
    const trainName = booking.trainName || "Unknown Train";
    const price = Number(booking.totalPrice) || 0;

    if (!revenueByTrain[trainName]) {
      revenueByTrain[trainName] = 0;
    }

    revenueByTrain[trainName] += price;
  });

  return revenueByTrain;
}

function renderRevenueChart() {
  const data = calculateRevenuePerTrain();
  const labels = Object.keys(data);
  const values = Object.values(data);

  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  if (labels.length === 0) {
    ctx.parentElement.innerHTML = "<p>No revenue data available</p>";
    return;
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue (SAR)',
        data: values,
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

renderRevenueChart();
window.addEventListener('load', generateWeeklyReport);