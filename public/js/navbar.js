// Navbar
const navLinks = document.querySelectorAll('.nav-link');

const currentUrl = window.location.pathname;

navLinks.forEach(link => {
  if(link.getAttribute('href') === currentUrl) {
    link.classList.add('current');
  }
});

// Theme Switch
const themeSwitch = document.getElementById('theme-switch');

if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
        try {
            const currentTheme = localStorage.getItem('theme');
            const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
            console.log('[navbar.js] theme click: current =', currentTheme, '-> new =', newTheme);
            document.documentElement.classList.toggle('dark-mode', newTheme === 'dark');
            localStorage.setItem('theme', newTheme);
            console.log('[navbar.js] theme click: applied class dark-mode =', newTheme === 'dark');
        } catch (e) {
            console.warn('[navbar.js] theme click: localStorage error', e);
        }
    });
}

// Auth state listener for navbar UI sync
if (window.AuthService) {
    window.AuthService.onAuthStateChange((user) => {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const usernameDisplay = document.getElementById('username-display');
        
        if (!userInfo) return;

        if (user) {
            if (loginBtn) loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            if (usernameDisplay) {
                const name = (user.user_metadata && user.user_metadata.username) || user.email || 'User';
                usernameDisplay.textContent = name;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            userInfo.style.display = 'none';
            if (usernameDisplay) usernameDisplay.textContent = '';
        }
    });

    // Provide a global logout function that uses AuthService
    window.logout = async function () {
        try {
            await window.AuthService.logout();
            // Redirect to home page on logout to ensure clean state
            if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('scanner/')) {
                window.location.href = '../index.html';
            } else if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
                // Stay on current page if it's not a protected page, but refresh UI is handled by listener
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
}

function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}
