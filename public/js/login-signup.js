// AuthService is expected to be loaded before this script

// Toggle between login and sign-up forms
function showLoginForm() {
    console.log('Showing login form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const radioLogin = document.getElementById('radioLogin');
    const radioSignup = document.getElementById('radioSignup');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        if (radioLogin) radioLogin.checked = true;
    } else {
        console.error('Login or signup form not found');
    }
}

function showSignupForm() {
    console.log('Showing signup form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const radioLogin = document.getElementById('radioLogin');
    const radioSignup = document.getElementById('radioSignup');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        if (radioSignup) radioSignup.checked = true;
    } else {
        console.error('Login or signup form not found');
    }
}

// Sign Up Function
async function signUp() {
    console.log('Sign up function called');
    
    const usernameInput = document.getElementById('signup-username');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const submitBtn = document.querySelector('#signupForm button[type="submit"]');
    
    if (!usernameInput || !emailInput || !passwordInput) {
        console.error('Signup inputs not found');
        return;
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    console.log('Sign up data:', { username, email, password: password ? '***' : 'empty' });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!username) { showAlert('Please enter a username.', 'error'); return; }
    if (!email || !emailPattern.test(email)) { showAlert('Please enter a valid email.', 'error'); return; }
    if (!password || password.length < 6) { showAlert('Password must be at least 6 characters.', 'error'); return; }

    try {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Signing up...'; }
        
        await window.AuthService.signup(email, password, username);
        
        showAlert('Sign-up successful! Check your email for verification.', 'success');
        closePopup();
    } catch (error) {
        showAlert('Sign up failed: ' + error.message, 'error');
        console.error('Sign up error:', error);
    } finally { 
        if (submitBtn) { 
            submitBtn.disabled = false; 
            submitBtn.textContent = 'SIGN UP'; 
        } 
    }
}

// Login Function
async function login() {
    console.log('Login function called');
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    
    if (!emailInput || !passwordInput) {
        console.error('Login inputs not found');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailPattern.test(email)) { showAlert('Please enter a valid email.', 'error'); return; }
    if (!password) { showAlert('Please enter your password.', 'error'); return; }

    try {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Logging in...'; }
        
        const user = await window.AuthService.login(email, password);

        if (user) {
            showAlert('Login successful! Welcome, ' + (user.user_metadata?.username || user.email), 'success');
            closePopup();
        }
    } catch (error) {
        showAlert('Login failed: ' + error.message, 'error');
        console.error('Login error:', error);
    } finally { 
        if (submitBtn) { 
            submitBtn.disabled = false; 
            submitBtn.textContent = 'LOGIN'; 
        } 
    }
}

// Log Out function
async function logout() {
    console.log("Logout button clicked");
    try {
        await window.AuthService.logout();
        showAlert('Logged out successfully.', 'success');
    } catch (error) {
        showAlert('Logout failed: ' + error.message, 'error');
        console.error('Logout error:', error);
    }
}

// Show custom alert
function showAlert(message, type = 'info') {
    console.log(`Alert [${type}]:`, message);
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    if (alertBox && alertMessage) {
        alertMessage.innerText = message;
        alertBox.className = `alert show ${type}`;
        setTimeout(closeAlert, 5000);
    } else {
        console.warn('Custom alert not found, using browser alert');
        alert(message);
    }
}

// Close custom alert
function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    if (alertBox) {
        alertBox.classList.remove('show');
    }
}

// Close login popup
function closePopup() {
    console.log('Closing popup');
    const loginPopup = document.getElementById('login-popup');
    const overlay = document.getElementById('overlay');

    if (loginPopup) {
        loginPopup.style.display = 'none';
        loginPopup.classList.remove('show');
    }
    if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('show');
    }
}

// Show login popup
function showPopup() {
    console.log('Showing popup');
    const loginPopup = document.getElementById('login-popup');
    const overlay = document.getElementById('overlay');

    if (loginPopup) {
        loginPopup.style.display = 'block';
        loginPopup.classList.add('show');
    } else {
        console.error('Login popup element NOT found in this page!');
        showAlert('This feature is coming soon to this page.', 'info');
        return;
    }
    
    if (overlay) {
        overlay.style.display = 'block';
        overlay.classList.add('show');
    }
    showLoginForm();
}

// Password Toggle
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (passwordInput) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            if (icon) icon.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            passwordInput.type = 'password';
            if (icon) icon.classList.replace('fa-eye', 'fa-eye-slash');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM loaded, initializing login system...');
    
    // Attach event listeners to forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            signUp();
        });
    }

    // Set up auth listener for UI updates (handled by navbar.js but we can add more here if needed)
    if (window.AuthService) {
        window.AuthService.onAuthStateChange((user) => {
            const loginBtn = document.getElementById('login-btn');
            const userInfo = document.getElementById('user-info');
            const usernameDisplay = document.getElementById('username-display');
            
            if (loginBtn && userInfo) {
                if (user) {
                    loginBtn.style.display = 'none';
                    userInfo.style.display = 'flex';
                    if (usernameDisplay) {
                        usernameDisplay.textContent = user.user_metadata?.username || user.email || 'User';
                    }
                } else {
                    loginBtn.style.display = 'block';
                    userInfo.style.display = 'none';
                }
            }
        });
    }
});

// Make functions globally available
window.showPopup = showPopup;
window.closePopup = closePopup;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.logout = logout;
window.login = login;
window.signUp = signUp;
window.togglePasswordVisibility = togglePasswordVisibility;
window.showAlert = showAlert;