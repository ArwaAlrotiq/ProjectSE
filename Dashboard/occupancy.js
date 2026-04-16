/* ============================================================
   CALCULATE UTILIZATION (REAL DATA)
============================================================ */
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

/* ============================================================
   UTILIZATION LEVEL COLORS
============================================================ */
function getUtilizationLevel(percentage) {
  percentage = Number(percentage);
  if (percentage >= 75) return "high";
  if (percentage >= 40) return "medium";
  return "low";
}

/* ============================================================
   RENDER UTILIZATION TABLE
============================================================ */
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

    <div class="legend">
      <span class="high">■ High (75%+)</span>
      <span class="medium">■ Medium (40–74%)</span>
      <span class="low">■ Low (below 40%)</span>
    </div>
  `;
}

/* ============================================================
   RENDER OCCUPANCY CHART
============================================================ */
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

/* ============================================================
   RUN ON LOAD
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderUtilizationTable();
  renderOccupancyChart();
});