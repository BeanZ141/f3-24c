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

themeSwitch.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme');
    const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';

    document.documentElement.classList.toggle('dark-mode', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
});

