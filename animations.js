document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  const preloader = document.getElementById('preloader');
  const heroTyped = document.getElementById('heroTyped');
  const heroCursor = document.getElementById('heroCursor');
  const horizontalWrapper = document.getElementById('horizontal-wrapper');
  const horizontalTrack = document.getElementById('horizontal-track');

  // Hero typing with TextPlugin
  let heroTl;
  const blinkCursor = () => gsap.to(heroCursor, { opacity: 0.2, duration: 0.6, repeat: -1, yoyo: true, ease: 'none' });
  const cursorBlink = blinkCursor();

  const typeHero = (text) => {
    if (heroTl) heroTl.kill();
    heroTl = gsap.timeline();
    heroTl.set(heroTyped, { text: '' });
    heroTl.to(heroTyped, {
      duration: 2.2,
      ease: 'none',
      text: { value: text, delimiter: '' },
      onStart: () => {
        gsap.to(heroCursor, { opacity: 0.8, duration: 0.1 });
      },
      onComplete: () => {
        gsap.to(heroCursor, { opacity: 0.2, duration: 0.6, repeat: -1, yoyo: true, ease: 'none' });
      },
    });
  };

  window.retypeHero = typeHero;

  // Preloader out
  gsap.to(preloader, {
    opacity: 0,
    duration: 0.8,
    delay: 0.6,
    onComplete: () => preloader.remove(),
  });

  // Scroll reveals
  gsap.utils.toArray('section').forEach((section) => {
    const elements = section.querySelectorAll('h2, h3, p, article, div');
    gsap.from(elements, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });
  });

  // Horizontal scroll pin
  if (horizontalWrapper && horizontalTrack) {
    const updateHorizontal = () => {
      const totalWidth = horizontalTrack.scrollWidth;
      const viewport = horizontalWrapper.clientWidth;
      const distance = totalWidth - viewport;
      return distance > 0 ? distance : 0;
    };

    const horizontalTween = gsap.to(horizontalTrack, {
      x: () => -updateHorizontal(),
      ease: 'none',
      paused: false,
    });

    ScrollTrigger.create({
      trigger: horizontalWrapper,
      start: 'top top',
      end: () => `+=${horizontalTrack.scrollWidth}`,
      pin: true,
      scrub: true,
      animation: horizontalTween,
      invalidateOnRefresh: true,
    });
  }

  // Lenis smooth scroll
  const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
  const raf = (time) => {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Magnetic cursor + ring
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  const renderRing = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderRing);
  };
  renderRing();

  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach((el) => {
    const strength = 12;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
      ring.style.transform += ' scale(1.25)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    });
  });

  // Tilt effect on project cards
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });

  // Initial hero typing
  const currentLang = document.documentElement.dataset.lang || 'es';
  const initialHero = currentLang === 'es' ? heroTyped?.dataset.i18nEs : heroTyped?.dataset.i18nEn;
  typeHero(initialHero || heroTyped?.textContent || '');
});
