const setTheme = () => {
    try {
        const theme = localStorage.getItem('theme') || 'light';
        console.log('[theme.js] setTheme(): read theme =', theme);
        document.documentElement.classList.toggle('dark-mode', theme === 'dark');
        console.log('[theme.js] setTheme(): applied class dark-mode =', theme === 'dark');
    } catch (e) {
        console.warn('[theme.js] setTheme(): localStorage error', e);
    }
};

setTheme();