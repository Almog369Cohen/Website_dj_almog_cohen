// Theme initialization - runs before React hydration
(function() {
  try {
    var theme = localStorage.getItem('theme') || 'dark';
    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var effectiveTheme = theme === 'system' ? systemTheme : theme;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme || 'dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
