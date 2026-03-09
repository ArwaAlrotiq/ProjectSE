
const role = localStorage.getItem("role");

if (!role) {
    alert("No role selected. Please choose your role first.");
    window.location.href = "login.html";
}


console.log("Logged in as:", role);