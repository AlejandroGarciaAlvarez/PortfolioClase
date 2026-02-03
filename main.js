window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const heroWords = document.querySelectorAll('.hero-words span span');

  // Custom cursor
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

  // Magnetic hover
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach((el) => {
    const strength = 12;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
      ring.style.transform += ' scale(1.3)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    });
  });

  // Lenis smooth scroll
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // GSAP animations
  gsap.registerPlugin(ScrollTrigger);

  // Preloader out
  gsap.to('#preloader', {
    opacity: 0,
    duration: 0.8,
    delay: 0.6,
    onComplete: () => preloader.remove(),
  });

  // Hero stagger
  gsap.to(heroWords, {
    y: 0,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.08,
    delay: 0.9,
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
});
