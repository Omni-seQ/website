/* ============================================
   OMNISEQ — Premium Cybersecurity Website
   Vanilla JavaScript
   ============================================ */

/**
 * SITE_CONFIG — Configurable constants.
 * CONTACT_ENDPOINT: Cloudflare Worker URL that proxies to Zoho Mail API.
 * TURNSTILE_SITE_KEY: Cloudflare Turnstile public site key.
 * No secrets should ever exist in this frontend code.
 */
const SITE_CONFIG = {
  CONTACT_ENDPOINT: "https://your-worker-subdomain.workers.dev/contact",
  TURNSTILE_SITE_KEY: "your-turnstile-site-key",
  CONTACT_EMAIL_LABEL: "contact@omniseq.com.np",
  HEADER_OFFSET: 80,
  SCROLL_TOP_THRESHOLD: 400,
  FORM_COOLDOWN_MS: 30000,
  FORM_MIN_AGE_MS: 3000,
};

/* ============================================
   THEME MANAGEMENT
   ============================================ */

const ThemeManager = {
  init() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    this.apply(theme);

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        this.apply(e.matches ? "dark" : "light");
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute("data-color-scheme", theme);
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  },

  toggle() {
    const current = document.documentElement.getAttribute("data-color-scheme") || "light";
    const next = current === "dark" ? "light" : "dark";
    this.apply(next);
    localStorage.setItem("theme", next);
  },
};

/* ============================================
   HEADER / SCROLL
   ============================================ */

const Header = {
  el: null,
  lastScroll: 0,

  init() {
    this.el = document.getElementById("header");
    if (!this.el) return;

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    this.onScroll();
  },

  onScroll() {
    const y = window.scrollY;
    this.el.classList.toggle("scrolled", y > 20);
    this.lastScroll = y;
  },
};

/* ============================================
   MOBILE MENU
   ============================================ */

const MobileMenu = {
  nav: null,
  btn: null,
  isOpen: false,

  init() {
    this.nav = document.getElementById("mainNav");
    this.btn = document.getElementById("mobileToggle");
    if (!this.nav || !this.btn) return;

    this.btn.addEventListener("click", () => this.toggle());

    this.nav.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        if (this.isOpen) this.close();
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && this.isOpen) this.close();
    });
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    this.nav.classList.add("open");
    this.btn.classList.add("active");
    this.btn.setAttribute("aria-expanded", "true");
    this.btn.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  },

  close() {
    this.isOpen = false;
    this.nav.classList.remove("open");
    this.btn.classList.remove("active");
    this.btn.setAttribute("aria-expanded", "false");
    this.btn.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  },
};

/* ============================================
   SMOOTH SCROLL & ACTIVE SECTION
   ============================================ */

const Navigation = {
  links: [],
  sections: [],

  init() {
    this.links = Array.from(document.querySelectorAll('.nav__link[data-section]'));
    this.sections = this.links
      .map((l) => document.getElementById(l.dataset.section))
      .filter(Boolean);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          this.scrollTo(target);
        }
      });
    });

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateActive();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    this.updateActive();
  },

  scrollTo(el) {
    const top = el.getBoundingClientRect().top + window.scrollY - SITE_CONFIG.HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  },

  updateActive() {
    const scrollY = window.scrollY + SITE_CONFIG.HEADER_OFFSET + 100;

    let currentId = "";
    for (const section of this.sections) {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    }

    this.links.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === currentId);
    });
  },
};

/* ============================================
   SCROLL TO TOP
   ============================================ */

const ScrollTop = {
  btn: null,

  init() {
    this.btn = document.getElementById("scrollTop");
    if (!this.btn) return;

    this.btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.btn.classList.toggle("visible", window.scrollY > SITE_CONFIG.SCROLL_TOP_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  },
};

/* ============================================
   SERVICE CARDS — hover/active/dimmed
   Desktop: hover sets .active on card, .dimmed on siblings.
   Touch/mobile: tap toggles .expanded (same expansion logic via CSS).
   ============================================ */

const ServiceCards = {
  init() {
    const cards = Array.from(document.querySelectorAll(".service-card"));
    if (!cards.length) return;

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const clearAll = () => {
      cards.forEach((c) => c.classList.remove("active", "dimmed"));
    };

    if (isTouchDevice) {
      // Tap-to-expand: only tapped card becomes .active, others .dimmed
      cards.forEach((card) => {
        card.addEventListener("click", () => {
          const isActive = card.classList.contains("active");
          clearAll();
          if (!isActive) {
            card.classList.add("active");
            cards.forEach((c) => { if (c !== card) c.classList.add("dimmed"); });
          }
        });
      });
    } else {
      // Hover: active card expands, siblings dim, grid stays stable
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          clearAll();
          card.classList.add("active");
          cards.forEach((c) => { if (c !== card) c.classList.add("dimmed"); });
        });
        card.addEventListener("mouseleave", () => {
          clearAll();
        });
      });
    }
  },
};

/* ============================================
   FAQ ACCORDION
   ============================================ */

const FAQ = {
  init() {
    document.querySelectorAll(".faq__question").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq__item");
        const isOpen = item.classList.contains("open");
        const answer = item.querySelector(".faq__answer");

        item.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
        if (answer) answer.setAttribute("aria-hidden", String(isOpen));
      });
    });
  },
};

/* ============================================
   CONTACT FORM
   ============================================
   Architecture:
   - Frontend submits JSON to a Cloudflare Worker (CONTACT_ENDPOINT).
   - The Worker validates the Turnstile token server-side.
   - The Worker sends email via the Zoho Mail API using server-side
     OAuth credentials. No SMTP or API secrets exist in this code.
   - CORS on the Worker should only allow the production site origin.
*/

const ContactForm = {
  form: null,
  submitBtn: null,
  statusEl: null,
  turnstileToken: null,
  formStartedAt: null,
  lastSubmitTime: 0,

  init() {
    this.form = document.getElementById("contactForm");
    this.submitBtn = document.getElementById("contactSubmit");
    this.statusEl = document.getElementById("formStatus");
    if (!this.form) return;

    this.formStartedAt = Date.now();

    this.form.addEventListener("input", (e) => {
      if (e.target.classList.contains("form__input")) {
        e.target.classList.remove("error", "success");
        const errorEl = e.target.parentElement.querySelector(".form__error");
        if (errorEl) errorEl.textContent = "";
      }
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.initTurnstile();
  },

  initTurnstile() {
    const widgetEl = document.getElementById("turnstileWidget");
    if (!widgetEl) return;

    const renderWidget = () => {
      if (typeof turnstile === "undefined") return;
      try {
        turnstile.render("#turnstileWidget", {
          sitekey: SITE_CONFIG.TURNSTILE_SITE_KEY,
          callback: (token) => { this.turnstileToken = token; },
          "expired-callback": () => {
            this.turnstileToken = null;
            this.showFieldError("turnstileError", "Verification expired. Please verify again.");
          },
          "error-callback": () => {
            this.turnstileToken = null;
          },
        });
      } catch (_) {
        /* Turnstile script may not be loaded yet or site key is placeholder */
      }
    };

    if (typeof turnstile !== "undefined") {
      renderWidget();
    } else {
      window.addEventListener("load", () => setTimeout(renderWidget, 500));
    }
  },

  sanitize(str) {
    const el = document.createElement("div");
    el.textContent = str;
    return el.innerHTML.trim();
  },

  validate() {
    let valid = true;
    this.clearErrors();

    const name = this.form.contactName.value.trim();
    const email = this.form.contactEmail.value.trim();
    const subject = this.form.contactSubject.value.trim();
    const service = this.form.contactService.value;
    const message = this.form.contactMessage.value.trim();

    if (!name || name.length < 2) {
      this.showFieldError("nameError", "Name must be at least 2 characters.");
      this.form.contactName.classList.add("error");
      valid = false;
    } else if (name.length > 100) {
      this.showFieldError("nameError", "Name must be under 100 characters.");
      this.form.contactName.classList.add("error");
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      this.showFieldError("emailError", "Please enter a valid email address.");
      this.form.contactEmail.classList.add("error");
      valid = false;
    } else if (email.length > 254) {
      this.showFieldError("emailError", "Email must be under 254 characters.");
      this.form.contactEmail.classList.add("error");
      valid = false;
    }

    if (!subject || subject.length < 3) {
      this.showFieldError("subjectError", "Subject must be at least 3 characters.");
      this.form.contactSubject.classList.add("error");
      valid = false;
    } else if (subject.length > 200) {
      this.showFieldError("subjectError", "Subject must be under 200 characters.");
      this.form.contactSubject.classList.add("error");
      valid = false;
    }

    if (!service) {
      this.showFieldError("serviceError", "Please select a service.");
      this.form.contactService.classList.add("error");
      valid = false;
    }

    if (!message || message.length < 10) {
      this.showFieldError("messageError", "Message must be at least 10 characters.");
      this.form.contactMessage.classList.add("error");
      valid = false;
    } else if (message.length > 2000) {
      this.showFieldError("messageError", "Message must be under 2000 characters.");
      this.form.contactMessage.classList.add("error");
      valid = false;
    }

    return valid;
  },

  showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  },

  clearErrors() {
    this.form.querySelectorAll(".form__error").forEach((el) => (el.textContent = ""));
    this.form.querySelectorAll(".form__input").forEach((el) => el.classList.remove("error", "success"));
    if (this.statusEl) { this.statusEl.textContent = ""; this.statusEl.className = "form__status"; }
  },

  setLoading(loading) {
    this.submitBtn.classList.toggle("loading", loading);
    this.submitBtn.disabled = loading;
  },

  showStatus(message, type) {
    if (!this.statusEl) return;
    this.statusEl.textContent = message;
    this.statusEl.className = `form__status ${type}`;
  },

  async handleSubmit() {
    if (!this.validate()) return;

    // Honeypot check
    if (this.form.contactWebsite && this.form.contactWebsite.value) return;

    // Form age check — reject submissions faster than human typing
    const age = Date.now() - this.formStartedAt;
    if (age < SITE_CONFIG.FORM_MIN_AGE_MS) {
      this.showStatus("Please take your time filling out the form.", "error");
      return;
    }

    // Cooldown to prevent rapid resubmission
    const now = Date.now();
    if (now - this.lastSubmitTime < SITE_CONFIG.FORM_COOLDOWN_MS) {
      const wait = Math.ceil((SITE_CONFIG.FORM_COOLDOWN_MS - (now - this.lastSubmitTime)) / 1000);
      this.showStatus(`Please wait ${wait} seconds before submitting again.`, "error");
      return;
    }

    // Turnstile token (soft check — won't block if Turnstile hasn't loaded)
    if (typeof turnstile !== "undefined" && !this.turnstileToken) {
      this.showFieldError("turnstileError", "Please complete the verification.");
      return;
    }

    this.setLoading(true);

    const payload = {
      name: this.sanitize(this.form.contactName.value.trim()),
      company: this.sanitize(this.form.contactCompany.value.trim()),
      email: this.sanitize(this.form.contactEmail.value.trim()),
      phone: this.sanitize(this.form.contactPhone.value.trim()),
      subject: this.sanitize(this.form.contactSubject.value.trim()),
      service: this.sanitize(this.form.contactService.value),
      message: this.sanitize(this.form.contactMessage.value.trim()),
      source: "website-contact-form",
      submittedAt: new Date().toISOString(),
      formStartedAt: new Date(this.formStartedAt).toISOString(),
      userAgent: navigator.userAgent,
      turnstileToken: this.turnstileToken || "",
      website: "", // honeypot — must be empty
    };

    try {
      const response = await fetch(SITE_CONFIG.CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        this.showStatus(
          `Thank you, ${payload.name}! We've received your message and will contact you within 24 hours.`,
          "success"
        );
        this.form.reset();
        this.form.querySelectorAll(".form__input").forEach((el) => el.classList.add("success"));
        this.formStartedAt = Date.now();
        if (typeof turnstile !== "undefined") turnstile.reset();
        this.turnstileToken = null;
      } else {
        const data = await response.json().catch(() => null);
        const msg = data?.message || "Something went wrong. Please try again or email us directly.";
        this.showStatus(msg, "error");
      }
    } catch (_) {
      this.showStatus(
        "Unable to reach our server. Please try again later or email us at " + SITE_CONFIG.CONTACT_EMAIL_LABEL,
        "error"
      );
    } finally {
      this.setLoading(false);
      this.lastSubmitTime = Date.now();
    }
  },
};

/* ============================================
   SCROLL REVEAL — Intersection Observer
   ============================================ */

const ScrollReveal = {
  init() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("revealed"), i * 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  },
};

/* ============================================
   HERO EFFECTS — particles, mouse glow
   ============================================ */

const HeroEffects = {
  canvas: null,
  ctx: null,
  particles: [],
  mouseX: 0,
  mouseY: 0,
  isMouseOver: false,
  rafId: null,

  init() {
    const heroBg = document.getElementById("heroBg");
    this.canvas = document.getElementById("heroCanvas");
    const glow = document.getElementById("heroGlow");
    if (!heroBg || !this.canvas || !glow) return;

    this.ctx = this.canvas.getContext("2d");
    this.resize();
    this.createParticles(60);

    window.addEventListener("resize", () => this.resize());

    heroBg.style.pointerEvents = "auto";

    heroBg.addEventListener("mousemove", (e) => {
      this.isMouseOver = true;
      const rect = heroBg.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      glow.classList.add("active");
      glow.style.left = this.mouseX + "px";
      glow.style.top = this.mouseY + "px";
    });

    heroBg.addEventListener("mouseleave", () => {
      this.isMouseOver = false;
      glow.classList.remove("active");
    });

    this.animate();
  },

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
  },

  createParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * (this.canvas.width || 1200),
        y: Math.random() * (this.canvas.height || 800),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.8,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }
  },

  animate() {
    if (!this.ctx) return;
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    const accentRGB = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-rgb").trim() || "34, 211, 238";

    for (const p of this.particles) {
      // Mouse attraction
      if (this.isMouseOver) {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 0) {
          const force = (180 - dist) / 180 * 0.015;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Damping
      p.vx *= 0.995;
      p.vy *= 0.995;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${accentRGB}, ${p.opacity})`;
      this.ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(${accentRGB}, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  },
};

/* ============================================
   EMAIL COPY TO CLIPBOARD
   ============================================ */

const EmailCopy = {
  init() {
    const link = document.getElementById("emailLink");
    if (!link) return;

    link.addEventListener("click", (e) => {
      if (!navigator.clipboard) return;
      const email = link.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        const orig = link.textContent;
        link.textContent = "✓ Copied!";
        link.style.color = "var(--success)";
        setTimeout(() => {
          link.textContent = orig;
          link.style.color = "";
        }, 2000);
      });
    });
  },
};

/* ============================================
   KEYBOARD ACCESSIBILITY
   ============================================ */

const Keyboard = {
  init() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") document.body.classList.add("keyboard-nav");
    });
    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-nav");
    });
  },
};

/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  Header.init();
  MobileMenu.init();
  Navigation.init();
  ScrollTop.init();
  ServiceCards.init();
  FAQ.init();
  ContactForm.init();
  ScrollReveal.init();
  HeroEffects.init();
  EmailCopy.init();
  Keyboard.init();

  // Theme toggle click
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", () => ThemeManager.toggle());

  // Set footer year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
