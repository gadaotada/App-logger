(function() {
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }
})();

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = 'light';

    if (currentTheme === 'light') {
        newTheme = 'dark';
    } else {
        newTheme = 'light';
    }

    localStorage.setItem('theme', newTheme);

    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const iconElement = document.querySelector('.theme-switch-icon');
    if (iconElement) {
        if (theme === 'dark') {
            // Moon for dark mode
            iconElement.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
        } else {
            // Sun for light mode
            iconElement.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    updateThemeIcon(currentTheme);
});