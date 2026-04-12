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

console.log("Kadi's Module: Data Analysis Ready", getCalculatedOccupancy());
