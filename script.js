// Enhanced Mobile menu toggle functionality
function toggleMenu() {
  const menu = document.getElementById('menu');
  const menuToggle = document.querySelector('.menu-toggle');
  
  menu.classList.toggle('active');
  menuToggle.classList.toggle('active');
  
  // Prevent body scroll when menu is open on mobile
  if (menu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('menu');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    menu.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close menu when window is resized to desktop size
window.addEventListener('resize', function() {
  if (window.innerWidth > 1024) {
    const menu = document.getElementById('menu');
    const menuToggle = document.querySelector('.menu-toggle');
    menu.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close menu when navigation link is clicked (mobile)
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.navbar nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 1024) {
        const menu = document.getElementById('menu');
        const menuToggle = document.querySelector('.menu-toggle');
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
});

// Set active navigation item based on current page
function setActiveNavItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar nav a');
  
  navLinks.forEach(link => {
    link.classList.remove('current-page');
    const linkPage = link.getAttribute('href');
    
    // Handle both relative and absolute paths
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('current-page');
    }
  });
}

// Event Popup System
const eventPopupSystem = {
  // Critical events that should show popups
  criticalEvents: [
    {
      id: 'plan-commission-vote',
      title: 'Plan Commission Vote',
      date: '2025-09-29',
      time: '6:30 PM (Rally at 5:30 PM',
      location: 'County Admin Building, Martinsville, IN',
      description: 'Critical Plan Commission vote on data center rezoning. Your attendance and voice are crucial!',
      actionUrl: 'events.html',
      actionText: 'Get Details'
    },
    {
      id: 'october-debate',
      title: 'October 2nd Debate',
      date: '2025-10-02',
      time: 'TBA',
      location: 'Location TBA',
      description: 'Important debate regarding the data center proposal. Time and location details on our Facebook page.',
      actionUrl: 'https://www.facebook.com/profile.php?id=61580043022168',
      actionText: 'Check Facebook'
    },
    {
      id: 'commissioner-meeting',
      title: 'Commissioner Meeting & Coffee Rally',
      date: '2025-10-06',
      time: '9:30 AM',
      location: '180 S Main St, Martinsville, IN',
      description: 'Morgan County Commissioner Meeting with Coffee & Donut Rally at 8:30am. Rally location on Facebook.',
      actionUrl: 'events.html',
      actionText: 'Get Details'
    }
  ],

  // Check if an event should show popup
  shouldShowPopup(event) {
    const now = new Date();
    const eventDate = new Date(event.date + 'T23:59:59'); // End of event day
    const daysBefore = 7; // Show popup 7 days before event
    const showFromDate = new Date(eventDate.getTime() - (daysBefore * 24 * 60 * 60 * 1000));
    
    // Show popup if we're within the window and event hasn't passed
    return now >= showFromDate && now <= eventDate;
  },

  // Get the most urgent upcoming event
  getUrgentEvent() {
    const now = new Date();
    const upcomingEvents = this.criticalEvents
      .filter(event => this.shouldShowPopup(event))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return upcomingEvents[0] || null;
  },

  // Check if popup was already dismissed today
  wasPopupDismissedToday(eventId) {
    const dismissedDate = localStorage.getItem(`popup-dismissed-${eventId}`);
    if (!dismissedDate) return false;
    
    const today = new Date().toDateString();
    return dismissedDate === today;
  },

  // Mark popup as dismissed for today
  markPopupDismissed(eventId) {
    const today = new Date().toDateString();
    localStorage.setItem(`popup-dismissed-${eventId}`, today);
  },

  // Show the popup
  showPopup(event) {
    const popup = document.getElementById('event-popup');
    const title = document.getElementById('popup-title');
    const eventInfo = document.getElementById('popup-event-info');
    const actionBtn = document.getElementById('popup-action-btn');
    
    if (!popup || !title || !eventInfo || !actionBtn) return;

    // Format the event date
    const eventDate = new Date(event.date);
    const dateOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = eventDate.toLocaleDateString('en-US', dateOptions);

    // Populate popup content
    title.textContent = `Urgent: ${event.title}`;
    eventInfo.innerHTML = `
      <h4>${event.title}</h4>
      <p class="event-date"><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${event.time}</p>
      <p class="event-location"><strong>Location:</strong> ${event.location}</p>
      <p>${event.description}</p>
    `;
    
    actionBtn.href = event.actionUrl;
    actionBtn.textContent = event.actionText;
    
    // Show popup with animation
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Mark as shown for today
    this.markPopupDismissed(event.id);
  },

  // Initialize popup system
  init() {
    // Only show on main pages, not admin
    if (window.location.pathname.includes('/admin/')) return;
    
    const urgentEvent = this.getUrgentEvent();
    if (!urgentEvent) return;
    
    // Don't show if already dismissed today
    if (this.wasPopupDismissedToday(urgentEvent.id)) return;
    
    // Show popup after a short delay
    setTimeout(() => {
      this.showPopup(urgentEvent);
    }, 2000);
  }
};

// Close popup function (called from HTML)
function closeEventPopup() {
  const popup = document.getElementById('event-popup');
  if (popup) {
    popup.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Close popup when clicking outside
document.addEventListener('click', function(event) {
  const popup = document.getElementById('event-popup');
  const popupContent = document.querySelector('.popup-content');
  
  if (popup && popup.style.display === 'flex') {
    if (!popupContent.contains(event.target)) {
      closeEventPopup();
    }
  }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const popup = document.getElementById('event-popup');
    if (popup && popup.style.display === 'flex') {
      closeEventPopup();
    }
  }
});

// Initialize popup system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize existing functionality first
  setActiveNavItem();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  handleContactForm();
  initializeLibrarySearch();
  
  // Initialize popup system
  eventPopupSystem.init();
  
  // Add smooth reveal animations for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe sections for animation
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
  
  // Handle image loading
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
      img.addEventListener('error', function() {
        this.style.display = 'none';
      });
    }
  });
  
  // Add loading skeleton to images
  images.forEach(img => {
    if (!img.classList.contains('loaded')) {
      img.style.background = 'var(--line)';
      img.classList.add('image-skeleton');
    }
  });
});

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
  // Close mobile menu with Escape key
  if (e.key === 'Escape') {
    const menu = document.getElementById('menu');
    const menuToggle = document.querySelector('.menu-toggle');
    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
      menuToggle.focus();
    }
  }
  
  // Toggle menu with Enter or Space on menu toggle
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('menu-toggle')) {
    e.preventDefault();
    toggleMenu();
  }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Newsletter form functionality with Formspree
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      const messageElement = document.getElementById('newsletter-message');
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;
      showMessage(messageElement, 'Subscribing to newsletter...', '');
      
      // Let Formspree handle the actual submission
      // This will be processed after the form submits
      setTimeout(() => {
        // Reset button state after a delay to allow Formspree to process
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
    
    // Handle Formspree response (if page reloads, this won't run, but that's okay)
    newsletterForm.addEventListener('formdata', function() {
      const messageElement = document.getElementById('newsletter-message');
      showMessage(messageElement, 'Thank you for subscribing! We\'ll keep you updated.', 'success');
    });
  }
});

function showMessage(element, message, type) {
  if (element) {
    element.textContent = message;
    element.className = 'form-message ' + type;
  }
}

// Countdown timer functionality
function updateCountdown() {
  const targetDate = new Date('2025-09-05T00:00:00').getTime();
  const now = new Date().getTime();
  const distance = targetDate - now;
  
  if (distance > 0) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update countdown elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
  } else {
    // Event has passed
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
      countdownEl.innerHTML = '<div class="event-passed"><h3>Event Complete!</h3><p>Thank you to everyone who attended!</p></div>';
    }
  }
}

// FAQ toggle functionality
function toggleFAQ(button) {
  const faqItem = button.parentElement;
  const isActive = faqItem.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Toggle current item
  if (!isActive) {
    faqItem.classList.add('active');
  }
}

// Contact form functionality
function handleContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      
      // Simulate form submission (replace with actual backend integration)
      setTimeout(() => {
        // Reset form
        this.reset();
        
        // Show success message
        submitBtn.textContent = 'Message Sent!';
        submitBtn.classList.remove('loading');
        submitBtn.style.background = 'var(--green)';
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set active navigation item
  setActiveNavItem();
  
  // Start countdown timer
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // Initialize contact form
  handleContactForm();
  
  // Add smooth reveal animations for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe sections for animation
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
  
  // Handle image loading
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
      img.addEventListener('error', function() {
        this.style.display = 'none';
      });
    }
  });
  
  // Add loading skeleton to images
  images.forEach(img => {
    if (!img.classList.contains('loaded')) {
      img.style.background = 'var(--line)';
      img.classList.add('image-skeleton');
    }
  });

  // Initialize library search functionality
  initializeLibrarySearch();
});

// Library Search Functionality
function initializeLibrarySearch() {
  const searchInput = document.getElementById('document-search');
  const clearButton = document.getElementById('clear-search');
  const searchResults = document.getElementById('search-results');
  const documentSections = document.getElementById('document-sections');
  
  // Only initialize if we're on the library page
  if (!searchInput || !documentSections) return;
  
  // Get all documents for searching
  const allDocuments = Array.from(documentSections.querySelectorAll('li'));
  const allSections = Array.from(documentSections.querySelectorAll('section'));
  
  // Create searchable data structure
  const searchableDocuments = allDocuments.map(doc => {
    const link = doc.querySelector('a');
    const section = doc.closest('section');
    const sectionTitle = section.querySelector('h3').textContent;
    
    return {
      element: doc,
      section: section,
      title: link.textContent.trim(),
      sectionTitle: sectionTitle,
      searchText: `${link.textContent} ${sectionTitle}`.toLowerCase()
    };
  });
  
  // Search function
  function performSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
      // Show all documents
      allDocuments.forEach(doc => {
        doc.classList.remove('hidden', 'highlight');
      });
      allSections.forEach(section => {
        section.classList.remove('hidden');
      });
      updateSearchResults('');
      return;
    }
    
    // Filter documents
    const matchingDocs = searchableDocuments.filter(doc => 
      doc.searchText.includes(searchTerm)
    );
    
    // Hide all documents first
    allDocuments.forEach(doc => {
      doc.classList.add('hidden');
      doc.classList.remove('highlight');
    });
    
    // Show matching documents
    const visibleSections = new Set();
    matchingDocs.forEach(doc => {
      doc.element.classList.remove('hidden');
      doc.element.classList.add('highlight');
      visibleSections.add(doc.section);
    });
    
    // Show/hide sections based on whether they have visible documents
    allSections.forEach(section => {
      if (visibleSections.has(section)) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
    
    // Update search results
    updateSearchResults(searchTerm, matchingDocs.length);
  }
  
  // Update search results message
  function updateSearchResults(query, count = 0) {
    if (query === '') {
      searchResults.textContent = '';
      searchResults.className = 'search-results';
    } else if (count === 0) {
      searchResults.textContent = `No documents found for "${query}"`;
      searchResults.className = 'search-results no-results';
    } else {
      const plural = count === 1 ? 'document' : 'documents';
      searchResults.textContent = `Found ${count} ${plural} matching "${query}"`;
      searchResults.className = 'search-results has-results';
    }
  }
  
  // Event listeners
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value;
    performSearch(query);
    
    // Show/hide clear button
    if (query.length > 0) {
      clearButton.classList.add('visible');
    } else {
      clearButton.classList.remove('visible');
    }
  });
  
  // Clear search
  clearButton.addEventListener('click', function() {
    searchInput.value = '';
    clearButton.classList.remove('visible');
    performSearch('');
    searchInput.focus();
  });
  
  // Handle Enter key
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      clearButton.classList.remove('visible');
      performSearch('');
    }
  });
}
