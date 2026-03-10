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
}
