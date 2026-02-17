const serviceTemplate = `
  {{#each services}}
  <div class="service-card" data-service="{{slug}}">
    <svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      {{{icon}}}
    </svg>
    <h3>{{name}}</h3>
    <p>{{description}}</p>
    <div class="service-details">
      <ul>
        {{#each details}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
  </div>
  {{/each}}
`;

// ========== INDUSTRY CARD TEMPLATE ==========
const industryTemplate = `
  {{#each industries}}
  <div class="industry-card">
    <svg class="industry-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5">
      {{{icon}}}
    </svg>
    <h4>{{name}}</h4>
  </div>
  {{/each}}
`;

// ========== FOOTER TEMPLATE ==========
const footerTemplate = `
  <div class="container">
    <div class="footer__content">
      <!-- Branding Column -->
      <div class="footer__branding">
        <h3>OmniSeq</h3>
        <p>Enterprise-grade cybersecurity partner delivering global-standard security practices with deep local expertise in Nepal.</p>
      </div>

      <!-- Quick Links Column -->
      <div class="footer__column">
        <h4>Quick Links</h4>
        <ul>
          {{#each quickLinks}}
          <li><a href="{{url}}">{{name}}</a></li>
          {{/each}}
        </ul>
      </div>

      <!-- Services Column -->
      <div class="footer__column">
        <h4>Our Services</h4>
        <ul>
          {{#each serviceLinks}}
          <li><a href="#services">{{name}}</a></li>
          {{/each}}
        </ul>
      </div>

      <!-- Connect Column -->
      <div class="footer__column">
        <h4>Connect</h4>
        <div class="footer__socials">
          {{#each socials}}
          <a href="{{url}}" class="footer__social-link" title="{{name}}" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor">
              {{{icon}}}
            </svg>
          </a>
          {{/each}}
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer__bottom">
      <p>&copy; 2024 OmniSeq Pvt. Ltd. All rights reserved. | Enterprise Security with Local Expertise.</p>
    </div>
  </div>
`;

// Compile templates
const compiledServiceTemplate = Handlebars.compile(serviceTemplate);
const compiledIndustryTemplate = Handlebars.compile(industryTemplate);
const compiledFooterTemplate = Handlebars.compile(footerTemplate);

// ========== SERVICES DATA ==========
const servicesData = {
  services: [
    {
      slug: 'vapt-testing',
      name: 'VAPT Testing',
      description: 'Comprehensive accessibility testing ensuring digital solutions meet WCAG and accessibility standards.',
      details: [
        'Network Testing',
        'Web Application Testing',
        'Mobile Application Testing',
        'Cloud Infrastructure Testing',
        'Detailed Accessibility Reports'
      ],
      icon: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    },
    {
      slug: 'compliance-auditing',
      name: 'Compliance and Auditing',
      description: 'Expert audit services aligned with ISO 27001, SOC 2, PCI-DSS, and HIPAA standards.',
      details: [
        'ISO 27001 Compliance',
        'SOC 2 Type II Audits',
        'PCI-DSS Validation',
        'HIPAA Assessment',
        'Compliance Documentation'
      ],
      icon: '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3"/>'
    },
    {
      slug: 'security-operations',
      name: 'Security Operations',
      description: 'Proactive 24/7 threat monitoring, incident response, and managed security services.',
      details: [
        '24/7 Threat Monitoring',
        'Incident Response Team',
        'Security Alert Management',
        'Vulnerability Assessment',
        'Threat Intelligence'
      ],
      icon: '<path d="M12 8v4m0 4v4M8 12h4m4 0h4"/>'
    },
    {
      slug: 'infrastructure-design',
      name: 'Infrastructure Design',
      description: 'Architecting secure, scalable networks with zero-trust security principles and modern cloud patterns.',
      details: [
        'Zero-Trust Architecture',
        'Network Design',
        'Cloud Infrastructure',
        'Load Balancing',
        'Disaster Recovery Planning'
      ],
      icon: '<path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>'
    },
    {
      slug: 'cloud-enablement',
      name: 'Cloud Enablement',
      description: 'Seamless migration, security hardening, and optimization across AWS, GCP, Azure, and hybrid environments.',
      details: [
        'AWS Security',
        'GCP Implementation',
        'Azure Configuration',
        'Hybrid Cloud Strategy',
        'Multi-Cloud Management'
      ],
      icon: '<path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>'
    },
    {
      slug: 'managed-services',
      name: 'Managed IT Services',
      description: 'Comprehensive IT management including endpoint protection, patch management, and proactive maintenance.',
      details: [
        'Patch Management',
        'Endpoint Protection',
        'System Monitoring',
        'Backup & Recovery',
        'Technical Support'
      ],
      icon: '<path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM12 15a3 3 0 100-6 3 3 0 000 6z"/>'
    }
  ]
};

// ========== INDUSTRIES DATA ==========
const industriesData = {
  industries: [
    {
      name: 'Banking & Finance',
      icon: '<g><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></g>'
    },
    {
      name: 'Healthcare',
      icon: '<g><path d="M12 6v6m0 0v6m0-6h6m0 0h6M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></g>'
    },
    {
      name: 'Enterprises',
      icon: '<g><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 5 7 13 17 13 17 5"/></g>'
    },
    {
      name: 'Government',
      icon: '<g><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/><path d="M12 12v4m-2-2h4"/></g>'
    }
  ]
};

// ========== FOOTER DATA ==========
const footerData = {
  quickLinks: [
    { name: 'Home', url: 'index.html' },
    { name: 'Services', url: 'services.html' },
    { name: 'About', url: 'about.html' },
    { name: 'Contact', url: 'index.html#contact' },
    { name: 'Privacy Policy', url: 'privacy.html' }
  ],
  serviceLinks: [
    { name: 'VAPT Testing' },
    { name: 'Compliance & Auditing' },
    { name: 'Security Operations' },
    { name: 'Infrastructure Design' }
  ],
  socials: [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/omniseq',
      icon: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/',
      icon: '<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"/>'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Omni-seQ',
      icon: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0020 4s-1.25-.75-4 .5c-.75-.25-2-.5-3.5-.5s-2.75.25-3.5.5c-2.75-1.25-4-.5-4-.5a5.07 5.07 0 000 .77 5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>'
    }
  ]
};

// ========== RENDER FUNCTIONS ==========

/**
 * Render services using Handlebars
 */
function renderServices() {
  const container = document.getElementById('servicesContainer');
  if (container) {
    container.innerHTML = compiledServiceTemplate(servicesData);
  }
}

/**
 * Render industries using Handlebars
 */
function renderIndustries() {
  const container = document.getElementById('industriesContainer');
  if (container) {
    container.innerHTML = compiledIndustryTemplate(industriesData);
  }
}

/**
 * Render footer using Handlebars
 */
function renderFooter() {
  const container = document.getElementById('footerContainer');
  if (container) {
    container.innerHTML = compiledFooterTemplate(footerData);
  }
}

// ========== INITIALIZATION ==========

/**
 * Initialize all templates when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
  renderServices();
  renderIndustries();
  renderFooter();
  
  // Re-setup anchor links after templates render
  setTimeout(() => {
    if (window.setupAnchorLinks) {
      window.setupAnchorLinks();
    }
  }, 200);
});
