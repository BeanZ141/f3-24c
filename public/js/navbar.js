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
(function () {
    const supabaseUrl = 'https://vxqpierpnqsmyckkusfp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cXBpZXJwbnFzbXlja2t1c2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDA3NjEsImV4cCI6MjA3MDY3Njc2MX0.lBm2eXleMQZrPdjZiLk1gatF7m7blHrx-GMeLDo8TQg';

    function updateNavbarUI(user) {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const usernameDisplay = document.getElementById('username-display');
        if (!loginBtn || !userInfo) return;

        if (user) {
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            if (usernameDisplay) {
                const name = (user.user_metadata && user.user_metadata.username) || user.email || 'User';
                usernameDisplay.textContent = name;
            }
        } else {
            loginBtn.style.display = 'block';
            userInfo.style.display = 'none';
            if (usernameDisplay) usernameDisplay.textContent = '';
        }
    }

    async function initAuthListenerWith(createClient) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        try {
            const { data, error } = await supabase.auth.getSession();
            if (!error && data && data.session) updateNavbarUI(data.session.user);
            else updateNavbarUI(null);
        } catch (_) {
            updateNavbarUI(null);
        }
        supabase.auth.onAuthStateChange((event, session) => {
            updateNavbarUI(session ? session.user : null);
        });
        // expose logout if not present
        if (!window.logout) {
            window.logout = async function () {
                await supabase.auth.signOut();
                updateNavbarUI(null);
                window.location = 'index.html';
            };
        }
    }

    // Prefer ESM import; fallback to window.supabase
    if (typeof window.importShim === 'function') {
        window.importShim('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm').then(({ createClient }) => initAuthListenerWith(createClient)).catch(() => {
            if (window.supabase && window.supabase.createClient) initAuthListenerWith(window.supabase.createClient);
        });
    } else {
        import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
            .then(({ createClient }) => initAuthListenerWith(createClient))
            .catch(() => {
                if (window.supabase && window.supabase.createClient) initAuthListenerWith(window.supabase.createClient);
            });
    }
})();

