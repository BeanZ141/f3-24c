const supabaseUrl = 'https://vxqpierpnqsmyckkusfp.supabase.co'; // unified project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cXBpZXJwbnFzbXlja2t1c2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDA3NjEsImV4cCI6MjA3MDY3Njc2MX0.lBm2eXleMQZrPdjZiLk1gatF7m7blHrx-GMeLDo8TQg';

let supabase;

function initializeSupabase() {
    console.log('Initializing Supabase...');
    if (window.supabase) {
        try {
            supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
            checkUserSession();
        } catch (error) {
            console.error('Error creating Supabase client:', error);
        }
    } else {
        setTimeout(initializeSupabase, 100);
    }
}

// Toggle between login and sign-up forms
function showLoginForm() {
    console.log('Showing login form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        console.error('Login or signup form not found');
    }
}

function showSignupForm() {
    console.log('Showing signup form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    } else {
        console.error('Login or signup form not found');
    }
}

// Sign Up Function
async function signUp() {
    console.log('Sign up function called');
    
    if (!supabase) {
        showAlert('Supabase not initialized. Please refresh the page.', 'error');
        return;
    }

    const usernameInput = document.getElementById('signup-username');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const submitBtn = document.querySelector('#signupForm button[type="submit"]');
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
        console.log('Attempting to sign up with Supabase...');
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                },
            },
        });

        if (error) {
            showAlert('Sign up failed: ' + error.message, 'error');
            console.error('Sign up failed:', error);
        } else {
            showAlert('Sign-up successful! Check your email for verification.', 'success');
            console.log('Sign-up successful! Check your email for verification.');
            console.log('Sign up response:', data);
            closePopup();
        }
    } catch (error) {
        showAlert('Sign up failed: ' + error.message, 'error');
        console.error('Sign up error:', error);
    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'SIGN UP'; }
    }
}

// Login Function
async function login() {
    console.log('Login function called');
    
    if (!supabase) {
        showAlert('Supabase not initialized. Please refresh the page.', 'error');
        return;
    }

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    console.log('Login data:', { email, password: password ? '***' : 'empty' });

    const emailPattern2 = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailPattern2.test(email)) { showAlert('Please enter a valid email.', 'error'); return; }
    if (!password) { showAlert('Please enter your password.', 'error'); return; }

    try {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Logging in...'; }
        console.log('Attempting to login with Supabase...');
        const { data, error } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
        });

        if (error) {
            showAlert('Login failed: ' + error.message, 'error');
            console.error('Login failed:', error);
        } else {
            const user = data.user;

            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                updateUI(user);
                showAlert('Login successful! Welcome, ' + (user.user_metadata?.username || user.email), 'success');
                console.log('Login successful! Welcome,', user.user_metadata?.username || user.email);
                console.log('Login response:', data);
                closePopup();
            }
        }
    } catch (error) {
        showAlert('Login failed: ' + error.message, 'error');
        console.error('Login error:', error);
    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'LOGIN'; }
    }
}

// Log Out function
async function logout() {
    console.log("Logout button clicked");
    
    if (!supabase) {
        showAlert('Supabase not initialized. Please refresh the page.', 'error');
        return;
    }

    try {
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
    } catch (error) {
        showAlert('Logout failed: ' + error.message, 'error');
        console.error('Logout error:', error);
    }
}

// Checks user session
async function checkUserSession() {
    if (!supabase) {
        console.log('Supabase not initialized, skipping session check');
        return;
    }

    try {
        console.log('Checking user session...');
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
            document.getElementById('login-btn').style.display = 'block';
            document.getElementById('user-info').style.display = 'none';
            console.log("No active session found");
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
    } catch (error) {
        console.error("Error checking session:", error);
    }
}

// Updates UI if/after the user is logged in/signed up
function updateUI(user) {
    console.log('Updating UI for user:', user);
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    const username = user.user_metadata?.username || user.email || 'User';
    document.getElementById('username-display').textContent = username;
    closePopup();
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
        // Fallback to browser alert if custom alert not found
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
    }
    if (overlay) {
        overlay.style.display = 'block';
        overlay.classList.add('show');
    }
    showLoginForm(); // Show login form by default
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM loaded, initializing login system...');
    
    // Initialize Supabase
    initializeSupabase();
    
    // Attach event listeners to forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        console.log('Login form found, attaching event listener');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            login();
        });
    } else {
        console.error('Login form not found');
    }
    
    if (signupForm) {
        console.log('Signup form found, attaching event listener');
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Signup form submitted');
            signUp();
        });
    } else {
        console.error('Signup form not found');
    }
    
    console.log('Login system initialization complete');
});

// Make functions globally available
window.showPopup = showPopup;
window.closePopup = closePopup;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.logout = logout;
window.login = login;
window.signUp = signUp;