export function checkAuth() {
    const loggedIn = localStorage.getItem("loggedIn");

    if (!loggedIn) {
        window.location.href = "../Login/login.html";
    }
}

export function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedRole");
    window.location.href = "../Login/login.html";
}