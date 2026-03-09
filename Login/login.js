
export function validateRoleSelection(role) {
    if (!role || role.trim() === "") {
        return {
            valid: false,
            message: "Please select a role first"
        };
    }

    return {
        valid: true,
        message: "Role selection is valid"
    };
}

function UnitTests() {
    console.log("Running Unit Tests...");

    let test1 = validateRoleSelection("");
    console.assert(test1.valid === false, "Test 1 Failed: empty role should be invalid");

    let test2 = validateRoleSelection(null);
    console.assert(test2.valid === false, "Test 2 Failed: null role should be invalid");

    let test3 = validateRoleSelection("admin");
    console.assert(test3.valid === true, "Test 3 Failed: admin role should be valid");

    console.log("Unit Tests Completed");
}

function IntegrationTest() {
    console.log("Running Integration Test...");

    const selectedRole = "manager";
    const validation = validateRoleSelection(selectedRole);

    if (validation.valid) {
        console.log("Integration Test Passed: " + validation.message);
    } else {
        console.log("Integration Test Failed: " + validation.message);
    }
}

UnitTests();
IntegrationTest();

function selectRole(role) {
    sessionStorage.setItem("role", role);
    console.log("Role selected:", role);
    window.location.href = "dashboard.html";
}

window.addEventListener("load", () => {
    const role = sessionStorage.getItem("role");
    if (!role) {
        alert("No role selected. Please choose your role first.");
        window.location.href = "login.html";
    } else {
        console.log("Logged in as:", role);
    }
});
