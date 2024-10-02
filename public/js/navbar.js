// Navbar
const navLinks = document.querySelectorAll('.nav-link');

const currentUrl = window.location.pathname;

navLinks.forEach(link => {
  if(link.getAttribute('href') === currentUrl) {
    link.classList.add('active');
  }
});

// Toggle Theme
const toggleButton = document.querySelector('.toggle-theme');
const currentTheme = localStorage.getItem('theme') || 'dark'; 

document.documentElement.setAttribute('data-theme', currentTheme);

updateThemeIcon(currentTheme);

toggleButton.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    theme = (theme === 'light') ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', theme); 
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
});

function updateThemeIcon(theme) {
    const sunIcon = document.getElementById('light');
    const moonIcon = document.getElementById('dark');
    
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

