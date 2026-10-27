/**
 * M web studio — Client Scripts
 * Clean, accessible, vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  if (mobileToggle && mobileNav) {
    const toggleMenu = (forceState) => {
      const isOpen = typeof forceState === 'boolean' 
        ? forceState 
        : mobileToggle.getAttribute('aria-expanded') === 'true';

      const nextState = !isOpen;
      mobileToggle.setAttribute('aria-expanded', String(nextState));
      mobileNav.setAttribute('aria-hidden', String(!nextState));
      mobileNav.classList.toggle('open', nextState);

      // Prevent body scrolling while mobile drawer is open
      document.body.style.overflow = nextState ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => {
      toggleMenu();
    });

    // Close when any mobile link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(true); // force close
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        toggleMenu(true);
        mobileToggle.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Header Scroll Effect
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 4px 18px rgba(52, 52, 47, 0.06)';
      } else {
        header.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --------------------------------------------------------------------------
  // 3. Active Nav Link on Scroll (Intersection Observer)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0 && desktopNavLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopNavLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 4. Project Modal Preview (MIRA Studio)
  // --------------------------------------------------------------------------
  const modal = document.getElementById('projectModal');
  const openModalBtn = document.getElementById('openMiraModal');
  const openTextBtn = document.getElementById('viewDetailsTextBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalContactLink = document.getElementById('modalContactLink');

  if (modal) {
    const showModal = () => {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
      document.body.style.overflow = 'hidden';
    };

    const hideModal = () => {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
      document.body.style.overflow = '';
    };

    if (openModalBtn) openModalBtn.addEventListener('click', showModal);
    if (openTextBtn) openTextBtn.addEventListener('click', showModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);

    if (modalContactLink) {
      modalContactLink.addEventListener('click', () => {
        hideModal();
      });
    }

    // Close when clicking modal backdrop
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        hideModal();
      }
    });

    // Close on dialog cancel (ESC)
    modal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
    });
  }

  // --------------------------------------------------------------------------
  // 5. Copy Email to Clipboard & Toast Notification
  // --------------------------------------------------------------------------
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const emailDisplay = document.getElementById('emailAddressDisplay');
  const toast = document.getElementById('toastNotification');

  if (copyBtn && emailDisplay) {
    let toastTimeout;

    copyBtn.addEventListener('click', async () => {
      const email = emailDisplay.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for non-https or older environments
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Visual feedback on button
        if (copyBtnText) copyBtnText.textContent = 'Copied!';
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy';
        }, 2200);

        // Show toast
        if (toast) {
          toast.classList.add('show');
          toast.setAttribute('aria-hidden', 'false');
          clearTimeout(toastTimeout);
          toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toast.setAttribute('aria-hidden', 'true');
          }, 3000);
        }
      } catch (err) {
        console.warn('Unable to copy to clipboard', err);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
