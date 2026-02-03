// Reactive particle background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;
const particles = [];
const particleCount = Math.min(700, Math.floor((w * h) / 2500));
const mouse = { x: w / 2, y: h / 2, active: false };

const resize = () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
};
window.addEventListener('resize', resize);

const rand = (min, max) => Math.random() * (max - min) + min;
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: rand(0, w),
    y: rand(0, h),
    vx: rand(-0.4, 0.4),
    vy: rand(-0.4, 0.4),
    r: rand(0.6, 1.4),
  });
}

const draw = () => {
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < particleCount; i++) {
    const p = particles[i];

    // Gentle mouse repulsion/attraction
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (mouse.active && dist < 160) {
      const force = ((160 - dist) / 160) * 0.35;
      p.vx += (dx / dist) * force * 0.08;
      p.vy += (dy / dist) * force * 0.08;
    } else if (!mouse.active) {
      p.vx += rand(-0.01, 0.01);
      p.vy += rand(-0.01, 0.01);
    }

    p.x += p.vx;
    p.y += p.vy;

    // Soft wrap
    if (p.x < -20) p.x = w + 20;
    if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20;
    if (p.y > h + 20) p.y = -20;

    ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Connections
  ctx.strokeStyle = 'rgba(72,224,228,0.14)';
  ctx.lineWidth = 0.7;
  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = dx * dx + dy * dy;
      if (dist < 85 * 85) {
        const alpha = 1 - dist / (85 * 85);
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(draw);
};
draw();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});

window.addEventListener('mouseleave', () => {
  mouse.active = false;
});

const animated = document.querySelectorAll('[data-animate]');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('opacity-100', 'translate-y-0');
      entry.target.classList.remove('opacity-0', 'translate-y-6');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

animated.forEach((el) => {
  el.classList.add('opacity-0', 'translate-y-6', 'transition', 'duration-700', 'ease-out');
  io.observe(el);
});

// Navbar scroll glass effect
const navbar = document.getElementById('navbar');
const mobileMenu = document.getElementById('mobileMenu');
const menuToggle = document.getElementById('menuToggle');
const menuIcon = menuToggle?.querySelector('.menu-icon');
const menuIconClose = menuToggle?.querySelector('.menu-icon-close');
const body = document.body;
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

const setNavSolid = (solid) => {
  if (solid) {
    navbar.classList.add('bg-black/50', 'backdrop-blur-md', 'border-b', 'border-white/10');
  } else {
    navbar.classList.remove('bg-black/50', 'backdrop-blur-md', 'border-b', 'border-white/10');
  }
};

let menuOpen = false;
const closeMenu = () => {
  menuOpen = false;
  mobileMenu.classList.add('opacity-0', 'pointer-events-none');
  mobileMenu.classList.remove('opacity-100', 'flex');
  menuToggle.setAttribute('aria-expanded', 'false');
  body.classList.remove('overflow-hidden');
  menuIcon?.classList.remove('opacity-0', 'scale-75');
  menuIcon?.classList.add('opacity-100', 'scale-100');
  menuIconClose?.classList.add('opacity-0', 'scale-75');
  menuIconClose?.classList.remove('opacity-100', 'scale-100');
};

const openMenu = () => {
  menuOpen = true;
  mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
  mobileMenu.classList.add('opacity-100', 'flex');
  menuToggle.setAttribute('aria-expanded', 'true');
  body.classList.add('overflow-hidden');
  menuIcon?.classList.add('opacity-0', 'scale-75');
  menuIconClose?.classList.remove('opacity-0', 'scale-75');
  menuIconClose?.classList.add('opacity-100', 'scale-100');
};

menuToggle?.addEventListener('click', () => {
  if (menuOpen) closeMenu(); else openMenu();
});

// Close menu on mobile link tap or tapping the overlay background
mobileMenu?.addEventListener('click', (e) => {
  const clickedLink = e.target.closest('.mobile-link');
  if (clickedLink || e.target === mobileMenu) {
    closeMenu();
  }
});

// Ensure menu closes after hash navigation (e.g., tapping Home)
window.addEventListener('hashchange', () => {
  if (menuOpen) closeMenu();
});

window.addEventListener('scroll', () => {
  const top = window.scrollY;
  setNavSolid(top > 10);
});

// Theme and language toggle (simple state)
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const langToggleMobile = document.getElementById('langToggleMobile');
const htmlEl = document.documentElement;
const bodyEl = document.body;

const i18n = {
  es: {
    'nav.home': 'Home',
    'nav.projects': 'Proyectos',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'hero.lead': 'Diseño y construyo experiencias web inmersivas, micro-interacciones medidas al milímetro y sistemas visuales con personalidad clara.',
    'hero.title': 'Experiencias digitales<br class="hidden sm:block"/> con dirección de arte radical.',
    'hero.ctaProjects': 'Ver proyectos',
    'hero.ctaContact': 'Escríbeme',
    'about.title': 'Sobre mí',
    'about.body': 'Creo experiencias inmersivas con énfasis en micro-interacción, rendimiento y dirección de arte. Combino código creativo, animación y sistemas de diseño para productos que buscan identidad propia.',
    'tech.title': 'Tech Glow Stack',
    'projects.title': 'Proyectos Cinematic',
    'contact.title': 'Contacto',
    'contact.body': 'Listo para diseñar la siguiente experiencia audaz de tu marca: micro-interacciones medibles, performance alto y dirección de arte consistente.',
    'contact.cta': 'Enviar correo',
  },
  en: {
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'hero.lead': 'I design immersive web experiences, precision micro-interactions, and visual systems with a strong identity.',
    'hero.title': 'Digital experiences<br class="hidden sm:block"/> with radical art direction.',
    'hero.ctaProjects': 'View projects',
    'hero.ctaContact': "Let’s talk",
    'about.title': 'About me',
    'about.body': 'I craft immersive experiences with a focus on micro-interactions, performance, and art direction—combining creative code, animation, and design systems for products that need a unique voice.',
    'tech.title': 'Tech Glow Stack',
    'projects.title': 'Cinematic Projects',
    'contact.title': 'Contact',
    'contact.body': 'Ready to design your next bold experience: measurable micro-interactions, high performance, and consistent art direction.',
    'contact.cta': 'Send email',
  },
};

const setTheme = (mode) => {
  const isDark = mode === 'dark';
  htmlEl.classList.toggle('dark', isDark);
  bodyEl.classList.toggle('bg-brand-deep', isDark);
  bodyEl.classList.toggle('text-zinc-200', isDark);
  bodyEl.classList.toggle('bg-white', !isDark);
  bodyEl.classList.toggle('text-zinc-900', !isDark);
  themeToggle.textContent = isDark ? 'Night' : 'Day';
  themeToggleMobile.textContent = isDark ? 'Night' : 'Day';
  localStorage.setItem('theme', mode);
};

const setLang = (lang) => {
  htmlEl.setAttribute('lang', lang);
  langToggle.textContent = lang.toUpperCase();
  langToggleMobile.textContent = lang.toUpperCase();
  localStorage.setItem('lang', lang);
  const dict = i18n[lang] || i18n.es;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!dict[key]) return;
    if (key === 'hero.title') {
      el.innerHTML = dict[key];
    } else {
      el.textContent = dict[key];
    }
  });
};

const storedTheme = localStorage.getItem('theme') || 'dark';
const storedLang = localStorage.getItem('lang') || 'es';
setTheme(storedTheme);
setLang(storedLang);

themeToggle?.addEventListener('click', () => {
  const next = htmlEl.classList.contains('dark') ? 'light' : 'dark';
  setTheme(next);
});
themeToggleMobile?.addEventListener('click', () => {
  const next = htmlEl.classList.contains('dark') ? 'light' : 'dark';
  setTheme(next);
});

langToggle?.addEventListener('click', () => {
  const next = htmlEl.getAttribute('lang') === 'es' ? 'en' : 'es';
  setLang(next);
});
langToggleMobile?.addEventListener('click', () => {
  const next = htmlEl.getAttribute('lang') === 'es' ? 'en' : 'es';
  setLang(next);
});

// 3D tilt using inline transforms (no CSS file)
const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach((card) => {
  const overlay = card.querySelector('.tilt-overlay');
  const maxTilt = 5;

  card.addEventListener('pointerenter', () => {
    card.style.transition = 'transform 200ms ease';
    if (overlay) overlay.style.transition = 'opacity 200ms ease, background 120ms ease';
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.background = '';
    }
  });

  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * maxTilt;
    const tiltY = (x - 0.5) * maxTilt;
    card.style.transform = `perspective(1100px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;

    if (overlay) {
      overlay.style.opacity = '0.75';
      overlay.style.background = `radial-gradient(640px circle at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%, rgba(234,88,12,0.14), rgba(59,130,246,0.06), transparent 60%)`;
    }
  });
});

// ScrollSpy
const sections = [
  { id: 'home', el: document.getElementById('home') },
  { id: 'proyectos', el: document.getElementById('proyectos') },
  { id: 'sobre', el: document.getElementById('sobre') },
  { id: 'contacto', el: document.getElementById('contacto') },
];

const activateLink = (id) => {
  [...navLinks, ...mobileLinks].forEach((link) => {
    const target = link.getAttribute('href').replace('#', '');
    if (target === id) {
      link.classList.add('text-white');
      link.querySelector('.nav-underline')?.classList.add('opacity-100', 'scale-x-100');
    } else {
      link.classList.remove('text-white');
      link.querySelector('.nav-underline')?.classList.remove('opacity-100', 'scale-x-100');
    }
  });
};

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      activateLink(entry.target.id);
    }
  });
}, { threshold: 0.4 });

sections.forEach(({ el }) => el && spyObserver.observe(el));
