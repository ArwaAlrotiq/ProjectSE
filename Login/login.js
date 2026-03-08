function handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("error-msg");

    if (!username || !password) {
        errorDiv.classList.remove("hidden");
        errorDiv.textContent = "Please enter username and password.";
        return;
    }

    errorDiv.classList.add("hidden");

    const result = checkLogin(username, password);

    if (result.success) {
        sessionStorage.setItem("currentUser", JSON.stringify(result.user));
        window.location.href = result.redirect;
    } else {
        errorDiv.classList.remove("hidden");
        errorDiv.textContent = "Invalid username or password.";
    }
}