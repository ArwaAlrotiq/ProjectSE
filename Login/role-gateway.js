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

    localStorage.setItem("role", role);
}

// Moves from role selection to login form
function goNext() {
    const validation = validateRoleSelection(selectedRole);

    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    document.getElementById("role-gateway").style.display = "none";
    document.getElementById("login-form").style.display = "block";

    document.getElementById("role-display").innerText =
        "Selected Role: " + selectedRole;
}
