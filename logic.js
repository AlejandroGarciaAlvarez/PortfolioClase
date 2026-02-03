document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const langToggle = document.getElementById('langToggle');
  const themeWipe = document.getElementById('theme-wipe');
  const langElements = document.querySelectorAll('[data-i18n-es][data-i18n-en]');
  const heroTyped = document.getElementById('heroTyped');

  const readPref = () => ({
    theme: localStorage.getItem('theme') || 'night',
    lang: localStorage.getItem('lang') || 'es',
  });

  const applyThemeClass = (mode) => {
    html.dataset.theme = mode;
    if (mode === 'night') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    const sun = document.querySelector('.icon-sun');
    const moon = document.querySelector('.icon-moon');
    if (sun && moon) {
      if (mode === 'night') {
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
      } else {
        sun.classList.remove('hidden');
        moon.classList.add('hidden');
      }
    }
  };

  const animateTheme = (nextTheme, evt) => {
    if (!themeWipe || !gsap) return applyThemeClass(nextTheme);

    const rect = themeToggle.getBoundingClientRect();
    const x = evt?.clientX || rect.left + rect.width / 2;
    const y = evt?.clientY || rect.top + rect.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const radius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));

    applyThemeClass(nextTheme);
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');
    themeWipe.style.opacity = '1';
    themeWipe.style.background = bg;

    gsap.fromTo(
      themeWipe,
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        duration: 0.7,
        ease: 'power2.out',
        onComplete: () => {
          themeWipe.style.opacity = '0';
          themeWipe.style.clipPath = 'circle(0px at 50% 50%)';
        },
      }
    );
  };

  const swapLanguage = (nextLang) => {
    html.dataset.lang = nextLang;
    langElements.forEach((el) => {
      const target = nextLang === 'es' ? el.dataset.i18nEs : el.dataset.i18nEn;
      if (el.id === 'heroTyped') return; // hero handled separately
      gsap.to(el, {
        y: -10,
        opacity: 0,
        duration: 0.2,
        ease: 'power1.in',
        onComplete: () => {
          el.textContent = target;
          gsap.fromTo(
            el,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: 'power1.out' }
          );
        },
      });
    });

    if (window.retypeHero && heroTyped) {
      const heroText = nextLang === 'es' ? heroTyped.dataset.i18nEs : heroTyped.dataset.i18nEn;
      window.retypeHero(heroText);
    }
  };

  // Init preferences
  const { theme: storedTheme, lang: storedLang } = readPref();
  applyThemeClass(storedTheme);
  html.dataset.lang = storedLang;

  // Apply initial language text except hero (typed separately in animations)
  langElements.forEach((el) => {
    if (el.id === 'heroTyped') return;
    el.textContent = storedLang === 'es' ? el.dataset.i18nEs : el.dataset.i18nEn;
  });

  // Theme toggle
  themeToggle?.addEventListener('click', (e) => {
    const current = html.dataset.theme === 'night' ? 'night' : 'day';
    const next = current === 'night' ? 'day' : 'night';
    localStorage.setItem('theme', next);
    animateTheme(next, e);
  });

  // Language toggle
  langToggle?.addEventListener('click', () => {
    const current = html.dataset.lang === 'en' ? 'en' : 'es';
    const next = current === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', next);
    swapLanguage(next);
  });

  // Set hero text to stored language before typing
  if (heroTyped) {
    const heroText = storedLang === 'es' ? heroTyped.dataset.i18nEs : heroTyped.dataset.i18nEn;
    heroTyped.textContent = heroText;
  }

  // Icons
  if (window.lucide) {
    lucide.createIcons();
  }
});
