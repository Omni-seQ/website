/**
 * Theme Toggle Functionality
 * Works on pages without Vue.js
 */

(function() {
  'use strict';

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    applyTheme(theme);
    updateThemeToggle(theme);
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-color-scheme', 'dark');
    } else {
      html.setAttribute('data-color-scheme', 'light');
    }
  }

  function updateThemeToggle(theme) {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const sunIcon = toggle.querySelector('.theme-icon-sun');
    const moonIcon = toggle.querySelector('.theme-icon-moon');

    if (theme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      toggle.setAttribute('aria-label', 'Switch to light mode');
      toggle.setAttribute('title', 'Switch to light mode');
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      toggle.setAttribute('aria-label', 'Switch to dark mode');
      toggle.setAttribute('title', 'Switch to dark mode');
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    updateThemeToggle(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Set up toggle button
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }
  });

  // Listen for system theme changes (if no manual preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      const theme = e.matches ? 'dark' : 'light';
      applyTheme(theme);
      updateThemeToggle(theme);
    }
  });
})();

