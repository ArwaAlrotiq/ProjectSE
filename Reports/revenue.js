import { checkAuth } from '../Login/auth.js';
checkAuth();

function calculateRevenuePerTrain() {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const confirmed = bookings.filter(b => b.status === 'Confirmed');

  const revenueByTrain = {};

  confirmed.forEach(booking => {
    const train = booking.train || 'Unknown';
    const price = Number(booking.totalPrice) || 0;

    if (!revenueByTrain[train]) {
      revenueByTrain[train] = 0;
    }
    revenueByTrain[train] += price;
  });

  return revenueByTrain;
}

function renderRevenueChart() {
  const data = calculateRevenuePerTrain();
  const labels = Object.keys(data);
  const values = Object.values(data);

  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

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
      }
    }
  });
}

renderRevenueChart();