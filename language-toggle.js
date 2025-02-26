document.addEventListener('DOMContentLoaded', function() {
  console.log("Script language-toggle chargé.");
  const toggle = document.getElementById('language-toggle');
  const indicator = document.getElementById('language-indicator');
  if (!toggle) {
    console.error("Élément language-toggle introuvable.");
    return;
  }

  function getNewPath(currentPath, targetLang) {
    // Cas de la page d'accueil
    if (currentPath === '/' || currentPath === '/en/' || currentPath === '/en') {
      return targetLang === 'en' ? '/en/' : '/';
    }
    
    // Pour passer en anglais : si on n'est pas déjà dans /en, on l'ajoute
    if (targetLang === 'en') {
      if (!currentPath.startsWith('/en')) {
        return '/en' + currentPath;
      } else {
        return currentPath; // déjà en anglais
      }
    } else {
      // Pour passer en français : si l'URL commence par /en, on retire ce préfixe
      if (currentPath.startsWith('/en')) {
        const newPath = currentPath.replace(/^\/en/, '');
        return newPath === '' ? '/' : newPath;
      } else {
        return currentPath; // déjà en français
      }
    }
  }

  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    const currentLang = document.documentElement.lang;
    const targetLang = currentLang === 'fr' ? 'en' : 'fr';
    const currentPath = window.location.pathname;
    const newPath = getNewPath(currentPath, targetLang);
    console.log("Langue actuelle :", currentLang, "-> Langue cible :", targetLang);
    console.log("Chemin actuel :", currentPath, "-> Nouveau chemin :", newPath);
    window.location.href = newPath;
  });

  // Mise à jour de l'indicateur selon la langue courante
  indicator.textContent = document.documentElement.lang === 'fr' ? 'EN' : 'FR';
});


/*
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('language-toggle');
  const indicator = document.getElementById('language-indicator');

  function getNewPath(currentPath, targetLang) {
    // Gestion spéciale de la page d'accueil
    if (currentPath === '/' || currentPath === '/en/') {
      return targetLang === 'en' ? '/en/' : '/';
    }

    // Gestion des autres pages
    const langPrefix = targetLang === 'en' ? '/en' : '';
    const cleanPath = currentPath.replace(/^\/en\//, '/');
    
    return `${langPrefix}${cleanPath}`;
  }

  if (toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      const currentLang = document.documentElement.lang;
      const targetLang = currentLang === 'fr' ? 'en' : 'fr';
      const currentPath = window.location.pathname;
      
      const newPath = getNewPath(currentPath, targetLang);
      window.location.href = newPath;
    });

    // Mise à jour initiale de l'indicateur
    indicator.textContent = document.documentElement.lang === 'fr' ? 'EN' : 'FR';
  }
});

/*document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('language-toggle');
  const indicator = document.getElementById('language-indicator');

  function updateLanguageDisplay() {
    const isEnglish = window.location.pathname.startsWith('/en');
    indicator.textContent = isEnglish ? 'FR' : 'EN';
  }

  if (toggle) {
    toggle.addEventListener('click', function(event) {
      event.preventDefault();
      
      const currentPath = window.location.pathname;
      let newPath = currentPath;
      
      if (currentPath === '/' || currentPath === '/en/') {
        newPath = currentPath === '/' ? '/en/' : '/';
      } else if (currentPath.startsWith('/en/')) {
        newPath = currentPath.replace('/en/', '/');
      } else {
        newPath = '/en' + currentPath;
      }
      
      window.location.href = newPath;
    });

    // Initial update
    updateLanguageDisplay();
    
    // Update on navigation
    window.addEventListener('popstate', updateLanguageDisplay);
  }
});