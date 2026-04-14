//S10: test booking and cancellation flow
let mockRemainingSeats = 10;
function testBookSeat() {
    if (mockRemainingSeats > 0) {
        mockRemainingSeats--;
        return { success: true, remaining: mockRemainingSeats };
    }
    return { success: false, message: "No seats available" };
}

function testCancelSeat() {
    mockRemainingSeats++;
    return { success: true, remaining: mockRemainingSeats };
}
function runTest(testName, condition) {
    if (condition) {
        console.log("✅ PASS: " + testName);
    } else {
        console.error("❌ FAIL: " + testName);
    }
}
function runBookingAndCancellationTest() {
    console.log("--- Starting Booking & Cancellation Flow Test ---");
    const res1 = testBookSeat();
    runTest("First booking reduces seats to 9", mockRemainingSeats === 9);
    testBookSeat();
    runTest("Second booking reduces seats to 8", mockRemainingSeats === 8);
    const resCancel = testCancelSeat();
    runTest("Cancellation increases seats back to 9", mockRemainingSeats === 9);
    mockRemainingSeats = 0;
    const resFail = testBookSeat();
    runTest("Booking fails when seats are 0", resFail.success === false);
    console.log("--- Test Flow Completed ---");
}
runBookingAndCancellationTest();