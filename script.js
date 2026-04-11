/**
 * FraFuel.ai - Main Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Smooth Scrolling for Navigation Links
  const navLinks = document.querySelectorAll('.nav-links a, .nav-cta, .hero-ctas a');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      // Only prevent default if it's an internal link
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Add a little offset for the sticky navbar
          const yOffset = -80;
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

  // 2. Intersection Observer for Scroll Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        // Optional: stop observing once animated to keep it shown
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Select all elements with hidden classes
  const hiddenElements = document.querySelectorAll('.hidden-bottom, .hidden-scale');

  hiddenElements.forEach(el => observer.observe(el));

  // 3. Optional Micro-interaction: Subtle Mouse Move Parallax on Hero Visual
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    document.addEventListener('mousemove', (e) => {
      // Only apply on larger screens
      if (window.innerWidth > 768) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

        heroVisual.style.transform = `translateY(${yAxis}px) translateX(${xAxis}px)`;
      }
    });
  }

  // 4. Navbar Blur/Border Opacity on Scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(11, 15, 20, 0.9)';
      navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(11, 15, 20, 0.8)';
      navbar.style.boxShadow = 'none';
    }
  });

});
