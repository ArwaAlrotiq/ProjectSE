let selectedRole = null;

function selectRole(element, role) {
    selectedRole = role;

    document.querySelectorAll(".role-card").forEach(card => {
        card.classList.remove("selected");
    });

    element.classList.add("selected");
}

function nextButton() {
    if (!selectedRole) {
        alert("Please select a role first");
        return;
    }

    localStorage.setItem("selectedRole", selectedRole);

    document.getElementById("role-gateway").style.display = "none";
    document.getElementById("login-form").style.display = "block";

    document.getElementById("role-display").textContent =
        "Logging in as: " + selectedRole.replace("_", " ");
}

function backButtn() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("role-gateway").style.display = "block";
}