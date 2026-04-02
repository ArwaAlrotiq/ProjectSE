// Handles login validation and redirects based on role
function handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("error-msg");

    // Check for empty fields
    if (!username || !password) {
        errorDiv.classList.remove("hidden");
        errorDiv.textContent = "Please enter username and password.";
        return;
    }

    errorDiv.classList.add("hidden");

    // Validate login using checkLogin()
    const result = checkLogin(username, password);

    if (result.success) {
        // Save user session
        sessionStorage.setItem("currentUser", JSON.stringify(result.user));

        // Redirect to correct dashboard
        window.location.href = result.redirect;
    } else {
        errorDiv.classList.remove("hidden");
        errorDiv.textContent = "Invalid username or password.";
    }
    if (result.success) {
        sessionStorage.setItem("currentUser", JSON.stringify(result.user));
        const userRole = result.user.role;
        sessionStorage.setItem("userRole", userRole);
        if (userRole === "administrator") {
            window.location.href = "../Schedules/form.html";
        } else {
            window.location.href = result.redirect || "staff-dashboard.html";
        }

    } else {
        errorDiv.classList.remove("hidden");
        errorDiv.textContent = "Invalid username or password.";
    }
}
function backButtn() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('role-gateway').style.display = 'block';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('error-msg').classList.add('hidden');
}
