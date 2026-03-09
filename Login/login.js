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
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function handleSignup() {
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
    const hashed = await hashPassword(password);
    localStorage.setItem("user_" + username, hashed);
    alert("Signup successful!");
}