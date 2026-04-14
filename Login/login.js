function handleLogin() {
    const role = localStorage.getItem("selectedRole");
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-msg");

    if (!username || !password) {
        errorMsg.textContent = "Please enter username and password";
        errorMsg.classList.remove("hidden");
        return;
    }

    // Fake credentials per role
    const credentials = {
        administrator: { user: "admin", pass: "admin123" },
        manager: { user: "manager", pass: "manager123" },
        reservation_agent: { user: "agent", pass: "agent123" }
    };

    const correct = credentials[role];

    if (username === correct.user && password === correct.pass) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("loggedRole", role);

        window.location.href = "../Dashboard/dashboard.html";
    } else {
        errorMsg.textContent = "Invalid username or password";
        errorMsg.classList.remove("hidden");
    }
}