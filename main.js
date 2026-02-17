const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      isScrolled: false,
      mobileMenuOpen: false,
      missionHovered: false,
      formSubmitted: false,
      formError: false,
      formMessage: '',
      theme: 'light', // 'light' or 'dark'
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    };
  },

  mounted() {
    // Initialize theme
    this.initTheme();
    
    // Scroll event listener (throttled)
    let scrollTimeout;
    const throttledScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = requestAnimationFrame(() => {
          this.handleScroll();
          scrollTimeout = null;
        });
      }
    };
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard);
    
    // Close mobile menu on window resize
    const handleResize = () => {
      if (window.innerWidth > 768 && this.mobileMenuOpen) {
        this.mobileMenuOpen = false;
        document.body.style.overflow = '';
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Store cleanup function
    this._cleanup = () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', this.handleKeyboard);
    };
  },

  beforeUnmount() {
    if (this._cleanup) {
      this._cleanup();
    }
  },

  methods: {
    /**
     * Handle scroll event - update sticky header state
     */

    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },

    /**
     * Toggle mobile menu visibility
     */
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      // Prevent body scroll when menu is open
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },

    /**
     * Initialize theme from localStorage or system preference
     */
    initTheme() {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme) {
        this.theme = savedTheme;
      } else {
        this.theme = systemPrefersDark ? 'dark' : 'light';
      }
      
      this.applyTheme();
    },

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.applyTheme();
      localStorage.setItem('theme', this.theme);
    },

    /**
     * Apply theme to document
     */
    applyTheme() {
      const html = document.documentElement;
      if (this.theme === 'dark') {
        html.setAttribute('data-color-scheme', 'dark');
      } else {
        html.setAttribute('data-color-scheme', 'light');
      }
    },

    /**
     * Smooth scroll navigation to sections
     */
    scrollToSection(event) {
      // Prevent default if it's a real event
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      // Close mobile menu
      this.mobileMenuOpen = false;
      document.body.style.overflow = '';

      // Get target href - handle both anchor clicks and programmatic calls
      let href = null;
      
      if (event && event.target) {
        // Find the closest anchor tag if clicking on a child element
        const anchor = event.target.closest('a') || event.target;
        href = anchor.getAttribute('href') || anchor.href;
        
        // Handle button clicks with data-href attribute
        if (!href && anchor.dataset.href) {
          href = anchor.dataset.href;
        }
      } else if (event && event.target && event.target.href) {
        // Handle programmatic calls with target object
        href = event.target.href;
      } else if (typeof event === 'string') {
        // Allow direct string href
        href = event;
      }

      if (!href || href === '#' || !href.startsWith('#')) {
        return;
      }

      const targetElement = document.querySelector(href);
      if (!targetElement) {
        console.warn(`Target element not found: ${href}`);
        return;
      }

      // Calculate position accounting for sticky header
      const headerHeight = 80;
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;

      // Smooth scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    },

    /**
     * Keyboard navigation shortcuts
     */
    handleKeyboard(e) {
      // Ignore keyboard shortcuts when user is typing in form inputs
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.isContentEditable
      );
      
      if (isTyping) {
        return; // Don't trigger shortcuts when typing in forms
      }

      const shortcuts = {
        'h': '#home',
        's': '#services',
        'a': '#about',
        'c': '#contact'
      };

      const key = e.key.toLowerCase();
      if (shortcuts[key] && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const element = document.querySelector(shortcuts[key]);
        if (element) {
          const headerHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    },

    /**
     * Handle form submission
     */
    handleFormSubmit() {
      // Prevent double submission
      if (this.formSubmitted && !this.formError) {
        return;
      }

      // Validate
      if (!this.validateForm()) {
        return;
      }

      // Prepare form data
      const formData = {
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        subject: this.form.subject.trim(),
        message: this.form.message.trim(),
        timestamp: new Date().toISOString()
      };

      // Log form data (frontend only - no backend)
      console.log('Form Submitted:', formData);

      // In a real application, you would send this to a backend API
      // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });

      // Show success message
      this.formError = false;
      this.formMessage = `Thank you, ${formData.name}! We've received your message and will contact you within 24 hours.`;
      this.formSubmitted = true;

      // Only scroll to form message if it's not already visible (less intrusive)
      setTimeout(() => {
        const formMessage = document.querySelector('.form-message');
        if (formMessage) {
          const rect = formMessage.getBoundingClientRect();
          const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
          
          // Only scroll if message is not visible
          if (!isVisible) {
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }, 100);

      // Reset form after delay
      setTimeout(() => {
        this.resetForm();
      }, 5000);
    },

    /**
     * Validate form inputs
     */
    validateForm() {
      // Name validation
      if (!this.form.name.trim()) {
        this.showError('Please enter your name');
        return false;
      }

      if (this.form.name.trim().length < 2) {
        this.showError('Name must be at least 2 characters');
        return false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.form.email)) {
        this.showError('Please enter a valid email address');
        return false;
      }

      // Subject validation
      if (!this.form.subject.trim()) {
        this.showError('Please enter a subject');
        return false;
      }

      if (this.form.subject.trim().length < 3) {
        this.showError('Subject must be at least 3 characters');
        return false;
      }

      // Message validation
      if (!this.form.message.trim()) {
        this.showError('Please enter your message');
        return false;
      }

      if (this.form.message.trim().length < 10) {
        this.showError('Message must be at least 10 characters');
        return false;
      }

      return true;
    },

    /**
     * Show error message
     */
    showError(message) {
      this.formError = true;
      this.formMessage = message;
      this.formSubmitted = true;

      setTimeout(() => {
        this.formSubmitted = false;
      }, 4000);
    },

    /**
     * Reset form to initial state
     */
    resetForm() {
      this.form = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
      this.formSubmitted = false;
      this.formMessage = '';
      this.formError = false;
    }
  }
});

// Mount app and store reference globally for link handlers
const mountedApp = app.mount('#app');
window.vueApp = mountedApp;

/* ==========================================
   VANILLA JAVASCRIPT ENHANCEMENTS
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
  /**
   * Initialize scroll animations using Intersection Observer (optimized)
   */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 50);
        });
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  // Observe animated elements
  const animatedElements = document.querySelectorAll(
    '.service-card, .industry-card, .contact-box'
  );

  animatedElements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(element);
  });

  /**
   * Parallax effect on hero background
   */
  let ticking = false;
  const updateParallax = () => {
    const scrollPosition = window.scrollY;
    
    const grid = document.querySelector('.cyber-grid');
    if (grid) {
      grid.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }

    const glowOrbs = document.querySelectorAll('.glow-orb');
    glowOrbs.forEach((orb, index) => {
      const offset = index === 0 ? scrollPosition * 0.3 : scrollPosition * -0.2;
      orb.style.transform = `translate(${offset}px, ${offset}px)`;
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  /**
   * Service card hover enhancement
   */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      serviceCards.forEach(c => {
        if (c !== this) {
          c.style.opacity = '0.5';
        }
      });
    });

    card.addEventListener('mouseleave', function() {
      serviceCards.forEach(c => {
        c.style.opacity = '1';
      });
    });
  });

  /**
   * Contact info boxes animated reveal (optimized)
   */
  const contactBoxes = document.querySelectorAll('.contact-box');
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        });
        contactObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  contactBoxes.forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = 'translateX(-20px)';
    box.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    contactObserver.observe(box);
  });

  /**
   * Click handlers for contact cards (copy to clipboard)
   */
  const emailLink = document.querySelector('a[href^="mailto:"]');
  if (emailLink) {
    emailLink.addEventListener('click', function(e) {
      // Don't prevent default - let mailto work normally
      // But also copy to clipboard if possible
      if (navigator.clipboard && navigator.clipboard.writeText) {
        const email = this.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
          const originalText = this.textContent;
          const originalColor = this.style.color;
          this.textContent = '✓ Copied!';
          this.style.color = 'var(--color-success)';
          
          setTimeout(() => {
            this.textContent = originalText;
            this.style.color = originalColor;
          }, 2000);
        }).catch(() => {
          // Clipboard API failed, let mailto work normally
        });
      }
    });
  }


  /**
   * CEO section quote animation
   */
  const ceoSection = document.querySelector('.ceo-section');
  if (ceoSection) {
    ceoSection.addEventListener('mouseenter', function() {
      const ceoImage = this.querySelector('.ceo-image');
      if (ceoImage) {
        ceoImage.style.transform = 'scale(1.05)';
      }
    });

    ceoSection.addEventListener('mouseleave', function() {
      const ceoImage = this.querySelector('.ceo-image');
      if (ceoImage) {
        ceoImage.style.transform = 'scale(1)';
      }
    });
  }

  /**
   * Setup skip link functionality (if not already in HTML)
   */
  const existingSkipLink = document.querySelector('.skip-link');
  if (existingSkipLink) {
    existingSkipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /**
   * Keyboard accessibility for focus management
   */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  /**
   * Service card click to expand details (mobile)
   */
  if (window.innerWidth < 768) {
    serviceCards.forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('expanded');
      });
    });
  }

  /**
   * Smooth link behavior for internal anchors (fallback for dynamically added links)
   */
  window.setupAnchorLinks = function() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      // Skip if already has Vue handler
      if (link.hasAttribute('@click') || link.getAttribute('v-on:click')) {
        return;
      }
      
      // Check if link already has our handler
      if (link.dataset.smoothScrollSetup) {
        return;
      }
      
      link.dataset.smoothScrollSetup = 'true';
      
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && document.querySelector(href)) {
          e.preventDefault();
          // Use Vue app instance if available
          if (window.vueApp && window.vueApp.scrollToSection) {
            window.vueApp.scrollToSection(e);
          } else {
            // Fallback smooth scroll
            const targetElement = document.querySelector(href);
            if (targetElement) {
              const headerHeight = 80;
              const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
              const offsetPosition = elementPosition - headerHeight;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }
        }
      });
    });
  };
  
  // Setup links after DOM is ready and after templates render
  window.setupAnchorLinks();
  
  // Re-setup links after Handlebars renders content
  setTimeout(window.setupAnchorLinks, 100);

  /**
   * Performance: Intersection Observer for lazy loading animations
   */
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        animationObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe elements that should animate in
  document.querySelectorAll('.service-card, .industry-card, .contact-box, .mission-section, .ceo-section').forEach(el => {
    animationObserver.observe(el);
  });

  /**
   * Interactive Mouse-Responsive Background Effects
   */
  function initMouseEffects() {
    const heroBackground = document.getElementById('heroBackground');
    const mouseFollower = document.getElementById('mouseFollower');
    const particleCanvas = document.getElementById('particleCanvas');
    
    if (!heroBackground || !mouseFollower) return;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isMouseActive = false;

    // Smooth mouse follower - enhanced visibility
    heroBackground.addEventListener('mousemove', (e) => {
      isMouseActive = true;
      mouseFollower.classList.add('active');
      
      const rect = heroBackground.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      
      // Add intensity based on mouse position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distance = Math.sqrt(Math.pow(targetX - centerX, 2) + Math.pow(targetY - centerY, 2));
      const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
      const intensity = 0.4 + (1 - Math.min(distance / maxDistance, 1)) * 0.6;
      mouseFollower.style.opacity = intensity.toString();
    });

    heroBackground.addEventListener('mouseleave', () => {
      isMouseActive = false;
      mouseFollower.classList.remove('active');
    });

    // Smooth animation loop for mouse follower
    function animateMouseFollower() {
      mouseX += (targetX - mouseX) * 0.1;
      mouseY += (targetY - mouseY) * 0.1;
      
      if (isMouseActive) {
        mouseFollower.style.left = mouseX + 'px';
        mouseFollower.style.top = mouseY + 'px';
      }
      
      requestAnimationFrame(animateMouseFollower);
    }
    animateMouseFollower();

      // Enhanced parallax effect on background elements
      heroBackground.addEventListener('mousemove', (e) => {
        const rect = heroBackground.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Increased movement range for more visible effect
        const moveX = (x - 0.5) * 40;
        const moveY = (y - 0.5) * 40;
        
        const grid = heroBackground.querySelector('.cyber-grid');
        const orbs = heroBackground.querySelectorAll('.glow-orb');
        const lines = heroBackground.querySelectorAll('.cyber-line');
        
        if (grid) {
          grid.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
        }
        
        orbs.forEach((orb, index) => {
          const multiplier = index === 0 ? 2 : -1.5;
          orb.style.transform = `translate(${moveX * multiplier}px, ${moveY * multiplier}px)`;
          // Add slight scale effect
          const scale = 1 + (Math.abs(moveX) + Math.abs(moveY)) / 500;
          orb.style.transform += ` scale(${scale})`;
        });
        
        lines.forEach((line, index) => {
          const offset = index === 0 ? moveY * 0.3 : -moveY * 0.2;
          line.style.transform = `translateY(${offset}px)`;
        });
      });

    // Particle canvas effect
    if (particleCanvas) {
      const ctx = particleCanvas.getContext('2d');
      const particles = [];
      const particleCount = 50;

      // Set canvas size
      function resizeCanvas() {
        particleCanvas.width = heroBackground.offsetWidth;
        particleCanvas.height = heroBackground.offsetHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Create particles
        class Particle {
          constructor() {
            this.reset();
          }

          reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1.5;
            this.opacity = Math.random() * 0.4 + 0.3;
          }

        update() {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(33, 128, 141, ${this.opacity})`;
          ctx.fill();
        }
      }

      // Initialize particles - increased count for better visibility
      for (let i = 0; i < particleCount * 1.5; i++) {
        particles.push(new Particle());
      }

      // Enhanced particle interaction with mouse
      let mouseParticleX = particleCanvas.width / 2;
      let mouseParticleY = particleCanvas.height / 2;
      
      heroBackground.addEventListener('mousemove', (e) => {
        const rect = heroBackground.getBoundingClientRect();
        mouseParticleX = e.clientX - rect.left;
        mouseParticleY = e.clientY - rect.top;
      });

      // Animation loop with mouse interaction
      function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        particles.forEach(particle => {
          // Attract particles to mouse
          const dx = mouseParticleX - particle.x;
          const dy = mouseParticleY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.vx += (dx / distance) * force * 0.02;
            particle.vy += (dy / distance) * force * 0.02;
          }
          
          particle.update();
          particle.draw();
        });

        requestAnimationFrame(animateParticles);
      }
      animateParticles();
    }
  }

  // Initialize mouse effects after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMouseEffects);
  } else {
    initMouseEffects();
  }

  /**
   * Performance: Optimize scroll handlers with requestAnimationFrame
   */
  let scrollTicking = false;
  const optimizedScrollHandler = () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        // Any scroll-based logic here
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  };

  console.log('✓ Enhanced Omni Seq website initialized successfully');
});
