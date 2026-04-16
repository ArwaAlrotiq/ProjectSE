function loadSchedules() {
    return JSON.parse(localStorage.getItem("trainSchedules") || "[]");
}

function getBookedSeats(trainId) {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    return bookings
        .filter(b => b.trainId == trainId && b.status === "Confirmed")
        .reduce((sum, b) => sum + Number(b.seat), 0);
}

const tableBody = document.getElementById("train-table-body");

function renderTrains() {
    const schedules = loadSchedules();

    if (schedules.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">No trains available.</td></tr>`;
        return;
    }

    tableBody.innerHTML = "";

    schedules.forEach(schedule => {
        const bookedSeats = getBookedSeats(schedule.id);
        const availableSeats = schedule.seatCapacity - bookedSeats;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${schedule.trainName}</td>
            <td>${schedule.departureTime}</td>
            <td>${schedule.arrivalTime}</td>
            <td>${schedule.destination}</td>
            <td>${schedule.ticketPrice} SAR</td>
<td>${availableSeats}/${schedule.seatCapacity}</td>
            <td>
                <button class="btn" onclick="selectTrain('${schedule.id}')"
                    ${availableSeats <= 0 ? "disabled" : ""}>
                    ${availableSeats <= 0 ? "Full" : "Select"}
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

window.selectTrain = function (trainId) {
    const passengerId = localStorage.getItem("selectedPassengerId");

    if (!passengerId) {
        alert("Please select a passenger first.");
        return;
    }

    const passenger = JSON.parse(localStorage.getItem("passengerProfiles"))
        .find(p => p.id === passengerId);

    if (passenger) {
        localStorage.setItem(
            "selectedPassengerName",
            passenger.firstName + " " + passenger.lastName
        );
    }

    localStorage.setItem("selectedTrainId", trainId);

    window.location.href = "../Booking/reserve.html";
};

renderTrains();