document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('language-toggle');
  if (toggle) {
    toggle.addEventListener('click', function(event) {
      event.preventDefault(); // Empêche le comportement par défaut du lien
      const currentLang = document.documentElement.lang;
      const newLang = currentLang === 'fr' ? 'en' : 'fr';
      let newPath = window.location.pathname
        .replace(/\.html$/, `.${newLang}.html`)
        .replace(/(\/posts\/[^/]+)\/index\.html$/, `$1/index.${newLang}.html`);
      if (!newPath.includes('.html')) newPath += `.${newLang}.html`;
      window.location.href = newPath;
    });
  }
});