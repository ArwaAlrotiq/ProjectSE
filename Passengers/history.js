let bookings = [
{
id: 1,
train: "Train A",
date: "2026-03-10",
seat: 12,
status: "Confirmed"
},
{
id: 2,
train: "Train B",
date: "2026-03-12",
seat: 5,
status: "Cancelled"
}
];

function loadHistory(){

const table = document.getElementById("historyBody");

table.innerHTML = "";

bookings.forEach(function(b){

const row = document.createElement("tr");

row.innerHTML = `
<td>${b.id}</td>
<td>${b.train}</td>
<td>${b.date}</td>
<td>${b.seat}</td>
<td>${b.status}</td>
`;

table.appendChild(row);

});

}

document.addEventListener("DOMContentLoaded", loadHistory);


function addBooking(train, seat){

const booking = {
id: bookings.length + 1,
train: train,
date: new Date().toLocaleDateString(),
seat: seat,
status: "Confirmed"
};

bookings.push(booking);

loadHistory();

}


function cancelBooking(id){

const booking = bookings.find(b => b.id === id);

if(booking){
booking.status = "Cancelled";
}

loadHistory();

}