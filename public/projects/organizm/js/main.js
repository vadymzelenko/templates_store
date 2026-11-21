/* ============================================================
   ORGANIZM — загальні скрипти
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Іконки Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Мобільне меню
  const menuBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    const menuIcon = menuBtn.querySelector('.menu-icon');
    const closeIcon = menuBtn.querySelector('.close-icon');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
      setTimeout(() => mobileMenu.classList.toggle('opacity-0'), 10);
      if (menuIcon) menuIcon.classList.toggle('hidden');
      if (closeIcon) closeIcon.classList.toggle('hidden');
      document.body.style.overflow = document.body.style.overflow === 'hidden' ? '' : 'hidden';
    };

    menuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach((link) => link.addEventListener('click', toggleMenu));
  }

  // Хедер при скролі (тільки там, де навігація спочатку прозора — головна)
  const navbar = document.getElementById('navbar');
  if (navbar && !navbar.dataset.navFixed) {
    const onScroll = () => navbar.classList.toggle('glass-nav', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // GSAP анімації
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const heroImage = document.querySelector('.hero-image-wrapper');
    if (heroImage) {
      gsap.fromTo(
        heroImage,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
      );
    }

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      gsap.fromTo(
        heroContent.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
    }

    gsap.utils.toArray('.reveal').forEach((elem) => {
      gsap.fromTo(
        elem,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: elem, start: 'top 85%' } }
      );
    });

    gsap.utils.toArray('.gsap-stagger').forEach((container) => {
      gsap.fromTo(
        container.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: container, start: 'top 85%' } }
      );
    });
  }

  // Картки тренерів (клік — показати інформацію)
  document.querySelectorAll('.trainer-card').forEach((card) => {
    const info = card.querySelector('.trainer-info');
    if (!info) return;

    card.addEventListener('click', () => {
      const willOpen = !info.classList.contains('is-open');
      document.querySelectorAll('.trainer-info.is-open').forEach((el) => el.classList.remove('is-open'));
      if (willOpen) info.classList.add('is-open');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.trainer-card')) {
      document.querySelectorAll('.trainer-info.is-open').forEach((el) => el.classList.remove('is-open'));
    }
  });

  // Поточний рік у футері
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
