/* ============================================
   AFZAL KHAN — PORTFOLIO INTERACTIONS
   Premium animations, scroll reveals, and UX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============ LOADING SCREEN ============
  const loadingScreen = document.getElementById('loading-screen');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      // Trigger hero reveals after load
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }, 800);
  });

  // Fallback: hide loader after max wait
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 3000);

  // ============ CURSOR GLOW (Desktop only) ============
  const cursorGlow = document.getElementById('cursor-glow');
  
  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  } else {
    cursorGlow.style.display = 'none';
  }

  // ============ NAVBAR ============
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = navLinks.querySelectorAll('a:not(.nav-cta)');

  // Scroll effect
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }, { passive: true });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      
      if (navLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          navAnchors.forEach(a => a.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ============ SCROLL REVEAL ============
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  // Observe non-hero reveals (hero handles its own reveals)
  reveals.forEach(el => {
    if (!el.closest('.hero')) {
      revealObserver.observe(el);
    }
  });

  // ============ SKILL BAR ANIMATION ============
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ============ TIMELINE ANIMATION ============
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  timelineItems.forEach(item => timelineObserver.observe(item));

  // ============ BACK TO TOP ============
  const backToTop = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============ CONTACT FORM ============
  const contactForm = document.getElementById('contact-form');

  // Set redirect URL dynamically (back to this page with #contact)
  const redirectInput = document.getElementById('form-redirect');
  if (redirectInput) {
    redirectInput.value = window.location.href.split('#')[0] + '#contact';
  }
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('form-submit');
    const originalText = submitBtn.innerHTML;
    const formData = new FormData(contactForm);

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 0.8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Sending...
    `;
    submitBtn.style.opacity = '0.7';

    // Send via fetch to FormSubmit.co
    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Success
        submitBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Message Sent!
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #34d399, #059669)';
        submitBtn.style.opacity = '1';
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      // Error
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Error — Try Again
      `;
      submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      submitBtn.style.opacity = '1';
    })
    .finally(() => {
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.opacity = '';
        submitBtn.disabled = false;
      }, 3000);
    });
  });

  // ============ SMOOTH SCROLL FOR ANCHORS ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============ TILT EFFECT ON PROJECT CARDS ============
  if (window.matchMedia('(pointer: fine)').matches) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ============ PARALLAX ON HERO ============
  const heroBg = document.querySelector('.hero-bg img');
  
  if (heroBg && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
      }
    }, { passive: true });
  }

  // ============ COUNTER ANIMATION FOR STATS ============
  function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + '+';
    }, 16);
  }

  const statValues = document.querySelectorAll('.hero-stat .stat-value');
  
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const text = entry.target.textContent;
        const num = parseInt(text);
        if (!isNaN(num)) {
          animateValue(entry.target, 0, num, 1500);
        }
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(stat => statObserver.observe(stat));

  // ============ MAGNETIC BUTTONS ============
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn, .btn-submit').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform += ` translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ============ TYPING EFFECT ON HERO BADGE ============
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    const originalText = heroBadge.textContent.trim();
    // Badge already has content, add subtle shimmer
    heroBadge.style.backgroundSize = '200% 100%';
  }

  // ============ INTERSECTION OBSERVER FOR PERFORMANCE ============
  // Lazy load images that are off-screen
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.src;
    });
  }

});

// ============ SERVICE WORKER REGISTRATION (Optional) ============
if ('serviceWorker' in navigator) {
  // For future PWA support
}
