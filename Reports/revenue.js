import { checkAuth } from '../Login/auth.js';
checkAuth();

/**
 * Calculate revenue per train from confirmed bookings
 */
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

/**
 * Calculate total revenue for a selected date range
 */
function calculateTotalRevenueForDuration(startDate, endDate) {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  const filtered = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    return b.status === 'Confirmed' &&
           bookingDate >= start &&
           bookingDate <= end;
  });

  const total = filtered.reduce((sum, b) => {
    return sum + (Number(b.totalPrice) || 0);
  }, 0);

  return total;
}

/**
 * Render revenue per train chart
 */
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
        label: 'Revenue per Train (SAR)',
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

/**
 * Run on page load
 */
renderRevenueChart();