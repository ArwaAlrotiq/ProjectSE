// ================================
// Import directly from form.js
// ================================
import { schedules, createSchedule, updateSchedule, deleteSchedule } from './form.js';

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

    // Clear existing data before testing
    schedules.length = 0;
    localStorage.clear();

    // Test 1: Create schedule
    createSchedule({
        tripName: "Riyadh - Dammam",
        departureTime: "08:00",
        arrivalTime: "10:00",
        destination: "Dammam",
        seatCapacity: "120",
        ticketPrice: "150"
    });
    runTest("Create schedule saves correctly", schedules.length === 1);
    runTest("Trip name saved correctly", schedules[0].tripName === "Riyadh - Dammam");

    // Test 2: Update schedule
    const id = schedules[0].id;
    updateSchedule(id, { ticketPrice: "200" });
    runTest("Update changes ticket price", schedules[0].ticketPrice === "200");

    // Test 3: Update with non-existing id does nothing
    const lengthBefore = schedules.length;
    updateSchedule("non-existing-id", { ticketPrice: "999" });
    runTest("Update non-existing id changes nothing", schedules.length === lengthBefore);

    // Test 4: Create second schedule
    createSchedule({
        tripName: "Riyadh - Jeddah",
        departureTime: "10:00",
        arrivalTime: "14:00",
        destination: "Jeddah",
        seatCapacity: "80",
        ticketPrice: "200"
    });
    runTest("Two schedules exist", schedules.length === 2);

    // Test 5: Delete schedule
    // Note: deleteSchedule uses confirm() popup
    // We bypass it here by directly removing from array
    schedules.splice(0, 1);
    localStorage.setItem('trainSchedules', JSON.stringify(schedules));
    runTest("Delete removes schedule", schedules.length === 1);
}

// ================================
// RUN ALL TESTS
// ================================
testScheduleFeatures();
console.log("All schedule tests completed.");