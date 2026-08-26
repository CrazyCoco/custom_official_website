(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-navigation');

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    };

    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navigation.classList.toggle('is-open', open);
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const revealTargets = document.querySelectorAll(
    '.journey-band .section-heading, .section-lead, .feature-list article, .coach-copy, .coach-screen, .community-band .section-heading, .community-gallery > *, .policies-band > *, .legal-hero, .legal-layout > *, .contact-panel, .contact-topics article'
  );
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach((target) => target.classList.add('reveal-ready'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  const navLinks = document.querySelectorAll('.site-header nav a[href^="#"]');
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  const topButton = document.createElement('button');
  topButton.className = 'back-to-top';
  topButton.type = 'button';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.textContent = '\u2191';
  document.body.append(topButton);

  const updateScrollUi = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${available > 0 ? (window.scrollY / available) * 100 : 0}%`;
    topButton.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7);
  };
  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener('resize', updateScrollUi);
  updateScrollUi();
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const stage = document.querySelector('.screen-stage');
  if (stage && !reduceMotion && window.matchMedia('(min-width: 981px)').matches) {
    stage.addEventListener('pointermove', (event) => {
      const bounds = stage.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
      stage.querySelector('.screen-home').style.translate = `${x}px ${y}px`;
      stage.querySelector('.screen-ai').style.translate = `${-x}px ${-y}px`;
    });
    stage.addEventListener('pointerleave', () => {
      stage.querySelectorAll('.screen').forEach((screen) => { screen.style.translate = '0 0'; });
    });
  }
})();
