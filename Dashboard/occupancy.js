/* ============================================================
   AUTH CHECK
============================================================ */
import { checkAuth } from '../Login/auth.js';
checkAuth();

/* ============================================================
   UTILIZATION CALCULATION (from main)
============================================================ */
function calculateUtilization() {
  const schedules = JSON.parse(localStorage.getItem('trainSchedules')) || [];
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  const utilizationData = schedules.map(schedule => {
    const trainBookings = bookings.filter(
      b => b.train === schedule.tripName && b.status === 'Confirmed'
    );

    const totalSeatsBooked = trainBookings.reduce(
      (sum, b) => sum + (Number(b.seat) || 0), 0
    );

    const capacity = Number(schedule.seatCapacity) || 1;
    const percentage = Math.min((totalSeatsBooked / capacity) * 100, 100);

    return {
      train: schedule.tripName,
      percentage: percentage.toFixed(1),
      level: getUtilizationLevel(percentage)
    };
  });

  return utilizationData;
}

/* ============================================================
   UTILIZATION LEVEL COLORS
============================================================ */
function getUtilizationLevel(percentage) {
  if (percentage >= 75) return 'high';
  if (percentage >= 40) return 'medium';
  return 'low';
}

/* ============================================================
   RENDER UTILIZATION TABLE (from main)
============================================================ */
function renderUtilizationTable() {
  const data = calculateUtilization();
  const container = document.getElementById('utilization-table');

  if (!container) return;

  if (data.length === 0) {
    container.innerHTML =
      '<p class="empty-msg">No schedule data available.</p>';
    return;
  }

  const rows = data.map(item => `
    <tr class="utilization-${item.level}">
      <td>${item.train}</td>
      <td>${item.percentage}%</td>
      <td class="level-badge ${item.level}">${item.level.toUpperCase()}</td>
    </tr>
  `).join('');

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

    <div class="legend">
      <span class="high">■ High (75%+)</span>
      <span class="medium">■ Medium (40–74%)</span>
      <span class="low">■ Low (below 40%)</span>
    </div>
  `;
}

/* ============================================================
   OCCUPANCY CALCULATION (from S14)
============================================================ */
function getCalculatedOccupancy() {
  const occupancyData = JSON.parse(localStorage.getItem('occupancy')) || {};
  const schedules = JSON.parse(localStorage.getItem('trainSchedules')) || [];

  let results = [];

  for (let trainName in occupancyData) {
    let reserved = occupancyData[trainName];
    const trainInfo = schedules.find(t => t.trainName === trainName);
    let total = trainInfo && trainInfo.maxCapacity ? trainInfo.maxCapacity : 100;
    let percentage = ((reserved / total) * 100).toFixed(1);

    results.push({
      trainName: trainName,
      occupancyRate: percentage,
      reservedSeats: reserved,
      capacity: total
    });
  }

  return results;
}

/* ============================================================
   VISUALIZE OCCUPANCY RATES USING CHARTS
============================================================ */
function renderOccupancyChart() {
  const data = getCalculatedOccupancy();
  const canvas = document.getElementById('occupancyChart');

  if (!canvas) return;

  const labels = data.map(item => item.trainName);
  const percentages = data.map(item => Number(item.occupancyRate));

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Occupancy Rate (%)',
        data: percentages,
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

/* ============================================================
   RUN ON LOAD
============================================================ */
renderUtilizationTable();
renderOccupancyChart();