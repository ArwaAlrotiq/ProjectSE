// Validates role selection
function validateRoleSelection(role) {
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

// Handles role selection UI
let selectedRole = null;

function selectRole(card, role) {
    document.querySelectorAll(".role-card")
        .forEach(c => c.classList.remove("selected"));

    card.classList.add("selected");
    selectedRole = role;
    sessionStorage.setItem("role", role);
}

// Moves from role selection to login form
function goNext() {
    const validation = validateRoleSelection(selectedRole);

    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    if (selectedRole === "admin") {
        window.location.href = "admin-dashboard.html";
    }
    if (selectedRole === "manager") {
        window.location.href = "manager-dashboard.html";
    }
    if (selectedRole === "staff") {
        window.location.href = "staff-dashboard.html";
    }
}
function nextButton() {
    if (!selectedRole) {
        alert("Please select a role first!");
        return;
    }
    document.getElementById('role-gateway').style.display = 'none';
    const loginForm = document.getElementById('login-form');
    loginForm.style.display = 'block';
    document.getElementById('role-display').innerText = "Logging in as: " + selectedRole;
}
