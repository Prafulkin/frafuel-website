/**
 * FraFuel.ai - Main Interaction Script
 */

// ==========================================
// SUPABASE CONFIGURATION
// Paste your project URL and ANON API key here
// ==========================================
const SUPABASE_URL = 'https://hcujwqcdaexbqmcpgpxp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zn3-v4HsNj-HtLuU-gkTxA_LCCCPMvs';

// Initialize Supabase Client (CDN loaded in HTML)
let supabase;
try {
  if (window.supabase) {
    // We pass an empty auth configuration to prevent localStorage security errors on file:/// URLs
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false // Prevents crashing on file:/// due to blocked localStorage
      }
    });
  }
} catch (err) {
  console.error("Supabase Initialization Error (likely due to local file:/// preview):", err);
}

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

  try {
    hiddenElements.forEach(el => observer.observe(el));
  } catch (error) {
    console.error('Observer failed', error);
    // Fallback: show everything immediately if observer crashes
    hiddenElements.forEach(el => el.classList.add('show'));
  }

  // Fallback: Show all elements after 1.5 seconds regardless, in case observer doesn't fire
  setTimeout(() => {
    hiddenElements.forEach(el => el.classList.add('show'));
  }, 1500);

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
  // 5. Lead Capture Form Handling
  const leadForm = document.getElementById('leadCaptureForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitLeadBtn');

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('leadName').value.trim();
      const phone = document.getElementById('leadPhone').value.trim();
      const email = document.getElementById('leadEmail').value.trim();

      // Basic validation
      if (!name || !phone) {
        showMessage('Please provide your name and WhatsApp number.', 'error');
        return;
      }

      // Show loading state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized. Check your credentials in script.js.');
        }

        // Insert into Supabase
        const { data, error } = await supabase
          .from('leads')
          .insert([
            { full_name: name, phone_number: phone, email: email, source: 'website_form' }
          ]);

        if (error) throw error;

        // Success
        leadForm.reset();
        showMessage('Awesome! Check your WhatsApp shortly.', 'success');

        // Optional: Redirect to a Make.com Webhook or specific WA Link directly
        // window.open(`https://wa.me/917020794853?text=Hey,%20I%20just%20signed%20up.%20My%20name%20is%20${encodeURIComponent(name)}`, '_blank');

      } catch (err) {
        console.error('Error submitting lead:', err);
        showMessage(err.message || 'Something went wrong. Please try again.', 'error');
      } finally {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
      }
    });
  }

  function showMessage(msg, type) {
    if (!formMessage) return;
    formMessage.textContent = msg;
    formMessage.style.color = type === 'success' ? '#00F0FF' : '#FF4A4A';

    // Clear message after 5 seconds
    setTimeout(() => {
      formMessage.textContent = '';
    }, 5000);
  }

});
