import { checkAuth } from '../Login/auth.js';
checkAuth();

// ================================
// Calculate utilization percentage
// for each train
// ================================
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

// ================================
// Determine utilization level
// ================================
function getUtilizationLevel(percentage) {
  if (percentage >= 75) return 'high';
  if (percentage >= 40) return 'medium';
  return 'low';
}

// ================================
// Render utilization table
// with color highlights
// ================================
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

// ================================
// Run on load
// ================================
renderUtilizationTable();