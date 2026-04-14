// ================================
// Import schedules + functions
// ================================
import * as FormModule from './form.js';

// Access internal schedules array
const schedules = FormModule.__getSchedules();

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

    // Reset before testing
    schedules.length = 0;
    localStorage.clear();

    // Test 1: Create schedule
    FormModule.createSchedule({
        trainName: "Riyadh - Dammam",
        departureTime: "08:00",
        arrivalTime: "10:00",
        destination: "Dammam",
        seatCapacity: "120",
        ticketPrice: "150"
    });

    runTest("Create schedule saves correctly", schedules.length === 1);
    runTest("Train name saved correctly", schedules[0].trainName === "Riyadh - Dammam");

    // Test 2: Update schedule
    const id = schedules[0].id;
    FormModule.updateSchedule(id, { ticketPrice: "200" });

    runTest("Update changes ticket price", schedules[0].ticketPrice === 200);

    // Test 3: Update with non-existing id does nothing
    const lengthBefore = schedules.length;
    FormModule.updateSchedule("non-existing-id", { ticketPrice: "999" });

    runTest("Update non-existing id changes nothing", schedules.length === lengthBefore);

    // Test 4: Create second schedule
    FormModule.createSchedule({
        trainName: "Riyadh - Jeddah",
        departureTime: "10:00",
        arrivalTime: "14:00",
        destination: "Jeddah",
        seatCapacity: "80",
        ticketPrice: "200"
    });

    runTest("Two schedules exist", schedules.length === 2);

    // Test 5: Delete schedule
    FormModule.__deleteDirect(0); // bypass confirm()

    runTest("Delete removes schedule", schedules.length === 1);
}

// ================================
// RUN ALL TESTS
// ================================
testScheduleFeatures();
console.log("All schedule tests completed.");