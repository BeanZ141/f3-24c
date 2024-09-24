const navLinks = document.querySelectorAll('.nav-link');

const currentUrl = window.location.pathname;

navLinks.forEach(link => {
  if(link.getAttribute('href') === currentUrl) {
    link.classList.add('active');
  }
});

const toggleButton = document.querySelector('.toggle-theme');
const currentTheme = localStorage.getItem('theme') || 'dark'; 

document.documentElement.setAttribute('data-theme', currentTheme);

toggleButton.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    theme = (theme === 'light') ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', theme); 
    localStorage.setItem('theme', theme);
});
