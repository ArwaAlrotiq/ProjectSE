// ================================
// MOCK DATA (replaces database)
// ================================
let mockSchedules = [];

// ================================
// MOCK FUNCTIONS
// These mirror what form.js will do
// ================================
function addSchedule(schedule) {
    if (!schedule.tripName || !schedule.departureTime || 
        !schedule.arrivalTime || !schedule.destination || 
        !schedule.seatCapacity || !schedule.ticketPrice) {
        return { success: false, message: "Missing required fields" };
    }
    schedule.id = mockSchedules.length + 1;
    mockSchedules.push(schedule);
    return { success: true, schedule: schedule };
}

function updateSchedule(id, newData) {
    const index = mockSchedules.findIndex(s => s.id === id);
    if (index === -1) return { success: false, message: "Schedule not found" };
    mockSchedules[index] = { ...mockSchedules[index], ...newData };
    return { success: true };
}

function deleteSchedule(id) {
    const index = mockSchedules.findIndex(s => s.id === id);
    if (index === -1) return { success: false, message: "Not found" };
    mockSchedules.splice(index, 1);
    return { success: true };
}

// ================================
// TEST RUNNER
// ================================
function runTest(testName, condition) {
    if (condition) {
        console.log("✅ PASS: " + testName);
    } else {
        console.error("❌ FAIL: " + testName);
    }
}

// ================================
// SCHEDULE TESTS
// ================================
function testScheduleFeatures() {
    mockSchedules = [];

    // Test 1: Add complete schedule successfully
    const result1 = addSchedule({
        tripName: "Riyadh - Dammam",
        departureTime: "08:00",
        arrivalTime: "10:00",
        destination: "Dammam",
        seatCapacity: 120,
        ticketPrice: 150
    });
    runTest("Add schedule saves correctly", result1.success === true);
    runTest("Schedule list has 1 item", mockSchedules.length === 1);

    // Test 2: Add with missing fields should fail
    const result2 = addSchedule({
        tripName: "Riyadh - Jeddah"
    });
    runTest("Add fails when fields are missing", result2.success === false);

    // Test 3: Update schedule
    updateSchedule(1, { ticketPrice: 200 });
    runTest("Update changes ticket price", mockSchedules[0].ticketPrice === 200);

    // Test 4: Delete schedule
    deleteSchedule(1);
    runTest("Delete removes schedule", mockSchedules.length === 0);

    // Test 5: Delete non-existing schedule
    const result5 = deleteSchedule(999);
    runTest("Delete fails for non-existing id", result5.success === false);
}

// ================================
// RUN ALL TESTS
// ================================
testScheduleFeatures();
console.log("All schedule tests completed.");
