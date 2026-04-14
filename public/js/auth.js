/**
 * Centralized Authentication Service for TicketEase
 * Uses Supabase for persistent session management
 */

const AUTH_CONFIG = {
    url: 'https://bbmtcjjhcnjpfglltqyl.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibXRjampoY25qcGZnbGx0cXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDE1ODQsImV4cCI6MjA5MDc3NzU4NH0.XCSUS89zOQuEI3-fvo9BGja3-AYMHU1VaXV6xrMqvaU'
};

const AuthService = {
    client: null,
    currentUser: null,
    initialized: false,
    listeners: [],

    async init() {
        if (this.initialized) return this.client;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                if (window.supabase) {
                    this.client = window.supabase.createClient(AUTH_CONFIG.url, AUTH_CONFIG.key);
                    
                    // Initialize session
                    const { data: { session }, error } = await this.client.auth.getSession();
                    if (error) throw error;
                    
                    this.currentUser = session ? session.user : null;
                    this.initialized = true;
                    console.log('AuthService: Supabase initialized, user:', this.currentUser ? 'logged in' : 'logged out');
                    
                    // Set up auth state listener
                    this.client.auth.onAuthStateChange((event, session) => {
                        console.log('AuthService: Auth state changed:', event);
                        this.currentUser = session ? session.user : null;
                        
                        if (this.currentUser) {
                            localStorage.setItem('user', JSON.stringify(this.currentUser));
                        } else {
                            localStorage.removeItem('user');
                        }
                        
                        this.notifyListeners();
                    });

                    return this.client;
                } else {
                    console.error('AuthService: Supabase script not found on page');
                    return null;
                }
            } catch (error) {
                console.error('AuthService: Initialization error:', error);
                return null;
            }
        })();

        return this.initPromise;
    },

    async waitForInit() {
        return this.init();
    },

    async getCurrentUser() {
        await this.waitForInit();
        return this.currentUser;
    },

    async login(email, password) {
        await this.waitForInit();
        const { data, error } = await this.client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    },

    async signup(email, password, username) {
        await this.waitForInit();
        
        // 1. Sign up user
        const { data, error } = await this.client.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });
        
        if (error) throw error;
        
        const user = data.user;
        
        // 2. Create profile in profiles table if user is created successfully
        if (user) {
            try {
                const { error: profileError } = await this.client
                    .from('profiles')
                    .insert([{ id: user.id, username: username, email: email }]);
                
                if (profileError) {
                    console.error('AuthService: Error creating profile:', profileError);
                    // We don't throw here to avoid failing signup if only profile fails
                }
            } catch (err) {
                console.error('AuthService: Profile insertion exception:', err);
            }
        }
        
        return user;
    },

    async logout() {
        await this.waitForInit();
        const { error } = await this.client.auth.signOut();
        if (error) throw error;
        this.currentUser = null;
        localStorage.removeItem('user');
    },

    // UI sync helpers
    onAuthStateChange(callback) {
        this.listeners.push(callback);
        // Immediate call with current state
        if (this.initialized) {
            callback(this.currentUser);
        } else {
            this.waitForInit().then(() => callback(this.currentUser));
        }
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    },

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentUser);
            } catch (error) {
                console.error('AuthService: Listener error:', error);
            }
        });
    },

    ensureLoginModal() {
        if (window.location.href.includes('dashboard.html')) return;
        if (document.getElementById('login-popup')) return;

        const isSubDir = window.location.pathname.includes('/category/') || window.location.pathname.includes('/scanner/');
        const prefix = isSubDir ? '../' : '';

        console.log('AuthService: Injecting login modal');
        const modalHTML = `
            <div id="overlay"></div>
            <div id="login-popup" class="login-modal">
                <button type="button" class="close-button" onclick="closePopup()">&times;</button>
                <div class="form-toggle">
                    <label>
                        <input type="radio" name="formType" id="radioLogin" checked onclick="showLoginForm()">
                        <span class="toggle-btn">LOGIN</span>
                    </label>
                    <label>
                        <input type="radio" name="formType" id="radioSignup" onclick="showSignupForm()">
                        <span class="toggle-btn">SIGN UP</span>
                    </label>
                </div>
                <form id="loginForm" class="form">
                    <h4 style="font-family: 'Varela'; margin-bottom: 20px;">LOGIN</h4>
                    <div class="form-group input-wrapper">
                        <input type="email" id="login-email" name="email" placeholder="Email Address" required oninput="toggleClearButton(this)">
                        <button type="button" class="clear-btn" onclick="clearInput(this)">&times;</button>
                    </div>
                    <div class="form-group input-wrapper">
                        <input type="password" id="login-password" name="password" placeholder="Password" required oninput="toggleClearButton(this)">
                        <button type="button" class="clear-btn" onclick="clearInput(this)">&times;</button>
                        <button type="button" class="password-toggle" onclick="togglePasswordVisibility('login-password', 'login-eye')">
                            <i id="login-eye" class="fas fa-eye-slash"></i>
                        </button>
                    </div>
                    <button type="submit" class="btn-primary">LOGIN</button>
                </form>
                <form id="signupForm" class="form" style="display: none;">
                    <h4 style="font-family: 'Varela'; margin-bottom: 20px;">SIGN UP</h4>
                    <div class="form-group input-wrapper">
                        <input type="text" id="signup-username" name="username" placeholder="Username" required oninput="toggleClearButton(this)">
                        <button type="button" class="clear-btn" onclick="clearInput(this)">&times;</button>
                    </div>
                    <div class="form-group input-wrapper">
                        <input type="email" id="signup-email" name="email" placeholder="Email Address" required oninput="toggleClearButton(this)">
                        <button type="button" class="clear-btn" onclick="clearInput(this)">&times;</button>
                    </div>
                    <div class="form-group input-wrapper">
                        <input type="password" id="signup-password" name="password" placeholder="Password" required oninput="toggleClearButton(this)">
                        <button type="button" class="clear-btn" onclick="clearInput(this)">&times;</button>
                        <button type="button" class="password-toggle" onclick="togglePasswordVisibility('signup-password', 'signup-eye')">
                            <i id="signup-eye" class="fas fa-eye-slash"></i>
                        </button>
                    </div>
                    <label class="container1">I agree to the <a href="${prefix}terms-and-conditions.html">terms and conditions.</a>
                        <input type="checkbox" required>
                        <span class="chkmrk"></span>
                    </label>
                    <button type="submit" class="btn-primary">SIGN UP</button>
                </form>
            </div>
            <div id="customAlert" class="alert"><span id="alertMessage">alert</span></div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
};

// Make it global
window.AuthService = AuthService;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AuthService.init();
        AuthService.ensureLoginModal();
    });
} else {
    AuthService.init();
    AuthService.ensureLoginModal();
}
// --- UI Functions (merged from login-signup.js) ---

// Toggle between login and sign-up forms
function showLoginForm() {
    console.log('Showing login form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const radioLogin = document.getElementById('radioLogin');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        if (radioLogin) radioLogin.checked = true;
    }
}

function showSignupForm() {
    console.log('Showing signup form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const radioSignup = document.getElementById('radioSignup');
    
    if (loginForm && signupForm) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        if (radioSignup) radioSignup.checked = true;
    }
}

// Sign Up Function
async function signUp() {
    const usernameInput = document.getElementById('signup-username');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const submitBtn = document.querySelector('#signupForm button[type="submit"]');
    
    if (!usernameInput || !emailInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

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
    } finally { 
        if (submitBtn) { 
            submitBtn.disabled = false; 
            submitBtn.textContent = 'SIGN UP'; 
        } 
    }
}

// Login Function
async function login() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    
    if (!emailInput || !passwordInput) return;

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
    } finally { 
        if (submitBtn) { 
            submitBtn.disabled = false; 
            submitBtn.textContent = 'LOGIN'; 
        } 
    }
}

// Show custom alert
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    if (alertBox && alertMessage) {
        alertMessage.innerText = message;
        alertBox.className = `alert show ${type}`;
        setTimeout(closeAlert, 5000);
    } else {
        alert(message);
    }
}

// Close custom alert
function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    if (alertBox) alertBox.classList.remove('show');
}

// Close login popup
function closePopup() {
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
});

// Export globals
window.showPopup = showPopup;
window.closePopup = closePopup;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.login = login;
window.signUp = signUp;
window.togglePasswordVisibility = togglePasswordVisibility;
window.showAlert = showAlert;

// Helper functions for inputs
window.toggleClearButton = function(input) {
    const clearBtn = input.nextElementSibling;
    if (clearBtn && clearBtn.classList.contains('clear-btn')) {
        clearBtn.style.display = input.value ? 'block' : 'none';
    }
};

window.clearInput = function(btn) {
    const input = btn.previousElementSibling;
    if (input) {
        input.value = '';
        btn.style.display = 'none';
        input.focus();
    }
};
