
function loadRevenueData() {

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const revenueByTrain = {};

    bookings.forEach(booking => {

        const train = booking.trip || "Unknown";
        const revenue = booking.totalPrice || 0;

        if (!revenueByTrain[train]) {
            revenueByTrain[train] = 0;
        }

        revenueByTrain[train] += revenue;

    });

    return revenueByTrain;
}

function renderRevenueChart() {

    const data = loadRevenueData();

    const labels = Object.keys(data);
    const values = Object.values(data);

    const ctx = document.getElementById("revenueChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Revenue",
                data: values
            }]
        }
    });

}

renderRevenueChart();