let selectedRole = null;

function selectRole(card, role) {
    document.querySelectorAll(".role-card")
        .forEach(c => c.classList.remove("selected"));

    card.classList.add("selected");
    selectedRole = role;
    localStorage.setItem("role", role);
}

function goNext() {
    if (!selectedRole) {
        alert("Please select a role first");
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
