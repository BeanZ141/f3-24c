import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://xiwdkytqnabqawssehrg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd2RreXRxbmFicWF3c3NlaHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5NDE0NTEsImV4cCI6MjA0MjUxNzQ1MX0.4r_O1Za9Q41zpHxdx0JuloECBa-bw7e4m93v241rpgw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Toggle between login and sign-up forms
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

// Sign Up Function
async function signUp() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!username || !email || !password) {
        showAlert('Please fill out all fields.', 'error');
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
            },
        },
    });

    if (error) {
        showAlert('Sign up failed: ' + error.message, 'error');
        console.log('Sign up failed: ' + error.message, 'error');
    } else {
        showAlert('Sign-up successful! Check your email for verification.', 'success');
        console.log('Sign-up successful! Check your email for verification.');
        closePopup();
    }
}

// Login Function
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showAlert('Please fill out all fields.', 'error');
        return;
    }

    // Log in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        showAlert('Login failed: ' + error.message, 'error');
        console.log('Login failed:', error.message);
    } else {
        const user = data.user;

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            updateUI(user);
            showAlert('Login successful! Welcome, ' + user.user_metadata.username, 'success');
            console.log('Login successful! Welcome, ' + user.user_metadata.username);
            closePopup();
        }
    }
}

// Log Out function
async function logout() {
    console.log("Logout button clicked");

    // Clear localStorage and session immediately
    localStorage.removeItem('user');

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
        showAlert('Logout failed: ' + error.message, 'error');
    } else {
        // Clear UI immediately
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('username-display').textContent = '';

        showAlert('Logged out successfully.', 'success');

        // Wait for session to clear before checking again
        setTimeout(() => {
            checkUserSession();
        }, 2000);
    }
}

// Checks user session
async function checkUserSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
        console.error("Error fetching session:", error);
        return;
    }

    const session = data.session;
    
    if (session && session.user) {
        updateUI(session.user);
        console.log("User is logged in:", session.user);
    } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    }
}

// Updates UI if/after the user is logged in/signed up
function updateUI(user) {
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('username-display').textContent = user.user_metadata.username;
    closePopup();
}

// Attach event listeners to forms
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    login();
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    signUp();
});

// Show custom alert
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.innerText = message;
    alertBox.className = `alert show ${type}`;
    setTimeout(closeAlert, 5000);
}

// Close custom alert
function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    alertBox.classList.remove('show');
}

// Close login popup
function closePopup() {
    const loginPopup = document.getElementById('login-popup');
    const overlay = document.getElementById('overlay');

    if (loginPopup) loginPopup.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
}

function showLoginPopup() {
    const loginPopup = document.getElementById('login-popup');
    const overlay = document.getElementById('overlay');

    if (loginPopup) loginPopup.classList.add('show');
    if (overlay) overlay.classList.add('show');
}

document.addEventListener("DOMContentLoaded", checkUserSession);
window.logout = logout;
window.logout = showLoginPopup;