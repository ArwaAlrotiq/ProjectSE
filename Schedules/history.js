const today=new Date();
const allSchedules=[{id: "TR-101", route:"Riyadh - Dammam", date:"2024-05-10", status:"completed"},
    {id: "TR-102", route:"Jeddah - Makkah", date:"2025-11-10", status:"completed"},
    {id: "TR-103", route:"Dammam - Riyadh", date:"2027-01-01", status:"upcoming"},
    {id: "TR-104", route:"Dammam - Riyadh", date:"2024-01-01", status:"cancelled"}
];
const tableBody=document.getElementById("tableBody");
allSchedules.forEach(train => {
    const trainDate=new Date(train.date);
    if(trainDate< today){
        let statusColor=" ";
        if(train.status.toLowerCase()==="completed"){
            statusColor="green";
        }else {
            statusColor="red";
        }
        const row=`<tr>
        <td>${train.id}</td>
        <td>${train.route}</td>
        <td>${train.date}</td>
        <td>--:--</td>       
        <td style="color: ${statusColor}; font-weight: bold;">${train.status}</td>
        </tr>`;
        tableBody.innerHTML +=row;
    }       
});
