/**
 * Larxius Technologies - Main JavaScript
 * Pixel-perfect recreation of larxius.com
 * Vanilla JS only — no frameworks or libraries
 */

(function () {
  'use strict';

  /* ============================================================
     1. STICKY HEADER
     ============================================================ */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  /* ============================================================
     2. MOBILE HAMBURGER MENU
     ============================================================ */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    function closeMenu() {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    function openMenu() {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    hamburger.addEventListener('click', function () {
      if (hamburger.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when any link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ============================================================
     3. ACTIVE NAV LINK
     ============================================================ */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

    allLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      const linkPage = href.split('/').pop();

      // Mark as active if href matches current page
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }

      // Special handling for home
      if ((currentPage === '' || currentPage === 'index.html') && (linkPage === 'index.html' || href === '/' || href === './')) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     4. SCROLL ANIMATIONS (Intersection Observer)
     ============================================================ */
  function initScrollAnimations() {
    const animatedEls = document.querySelectorAll(
      '.animate-fade-up, .animate-fade-in, .stagger-children'
    );

    if (!animatedEls.length) return;

    // Fallback: if IntersectionObserver is not supported, show everything
    if (!('IntersectionObserver' in window)) {
      animatedEls.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     5. FAQ ACCORDION
     ============================================================ */
  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        // Close all
        faqItems.forEach(function (i) {
          i.classList.remove('open');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = null;
          const q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        // Open clicked (if it was closed)
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });

      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('aria-controls', 'faq-answer-' + Math.random().toString(36).substr(2, 5));
    });
  }

  /* ============================================================
     6. NEWSLETTER FORM VALIDATION
     ============================================================ */
  function initNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form, .footer-form');

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput) return;

        const email = emailInput.value.trim();

        // Find or create message element
        let msgEl = form.querySelector('.form-message');
        if (!msgEl) {
          msgEl = document.createElement('div');
          msgEl.className = 'form-message';
          form.appendChild(msgEl);
        }

        // Reset
        msgEl.className = 'form-message';

        if (!email) {
          msgEl.textContent = 'Email is required';
          msgEl.classList.add('error');
          emailInput.focus();
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          msgEl.textContent = 'Please enter a valid email address';
          msgEl.classList.add('error');
          emailInput.focus();
          return;
        }

        // Success
        msgEl.textContent = 'Thank you for contacting us';
        msgEl.classList.add('success');
        emailInput.value = '';
      });
    });
  }

  /* ============================================================
     7. CONTACT FORM VALIDATION
     ============================================================ */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = form.querySelector('#contact-name');
      const emailInput = form.querySelector('#contact-email');
      const msgInput = form.querySelector('#contact-message');

      let msgEl = form.querySelector('.form-message');
      if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.className = 'form-message';
        form.appendChild(msgEl);
      }

      // Reset
      msgEl.className = 'form-message';

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!name) {
        msgEl.textContent = 'Please enter your name';
        msgEl.classList.add('error');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!email) {
        msgEl.textContent = 'Email is required';
        msgEl.classList.add('error');
        if (emailInput) emailInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        msgEl.textContent = 'Please enter a valid email address';
        msgEl.classList.add('error');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!message) {
        msgEl.textContent = 'Please enter a message';
        msgEl.classList.add('error');
        if (msgInput) msgInput.focus();
        return;
      }

      // Success
      msgEl.textContent = 'Thank you for reaching out!';
      msgEl.classList.add('success');

      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (msgInput) msgInput.value = '';
    });
  }

  /* ============================================================
     8. SMOOTH SCROLL for internal anchor links
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const headerOffset = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '69',
            10
          );
          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================================
     INIT — Run everything when DOM is ready
     ============================================================ */
  function init() {
    initStickyHeader();
    initMobileMenu();
    initActiveNav();
    initScrollAnimations();
    initFaq();
    initNewsletterForms();
    initContactForm();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
