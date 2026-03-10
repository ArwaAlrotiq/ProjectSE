// Users list (acts as our database)
const USERS = [
    { 
        username: "admin", 
        password: "admin123", 
        role: "administrator", 
        redirect: "../Schedules/schedules.html" 
    },
    { 
        username: "agent", 
        password: "agent123", 
        role: "reservation_agent", 
        redirect: "../Booking/booking.html" 
    },
    { 
        username: "manager", 
        password: "manager123", 
        role: "manager", 
        redirect: "../Dashboard/dashboard.html" 
    }
];

// Validate login credentials
function checkLogin(username, password) {
    const hashedInput = simpleHash(password);
    
    const user = USERS.find(u => 
        u.username === username && 
        simpleHash(u.password) === hashedInput
    );

    if (user) {
        return {
            success: true,
            user: { username: user.username, role: user.role },
            redirect: user.redirect
        };
    }
    return { success: false };
}

// Protect pages — call this on every protected page
function checkAuth() {
    const user = sessionStorage.getItem("currentUser");
    if (!user) {
        window.location.href = "../Login/login.html";
    }
    return JSON.parse(user);
}
async function handleSignup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    if (!username || !password) {
        alert("Please fill both username and password");
        return;
    }

    const encryptedPassword = await encryptPassword(password);
    localStorage.setItem(`user_${username}`, encryptedPassword);
    alert('Sign Up Successful!');
}

async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert("Please fill both username and password");
        return;
    }

    const encryptedPassword = await encryptPassword(password);
    const storedPassword = localStorage.getItem(`user_${username}`);

    if (storedPassword && storedPassword === encryptedPassword) {
        alert('Login Successful!');
    } else {
        alert('Invalid username or password');
    }
}