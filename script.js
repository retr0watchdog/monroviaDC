// Mobile menu toggle functionality
function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('menu');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    menu.classList.remove('active');
  }
});

// Close menu when window is resized to desktop size
window.addEventListener('resize', function() {
  if (window.innerWidth > 1200) {
    const menu = document.getElementById('menu');
    menu.classList.remove('active');
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

// Newsletter form functionality
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = document.getElementById('newsletter-email');
      const messageElement = document.getElementById('newsletter-message');
      const email = emailInput.value.trim();
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage(messageElement, 'Please enter a valid email address.', 'error');
        return;
      }
      
      // Simulate form submission (replace with actual backend integration)
      showMessage(messageElement, 'Submitting...', '');
      emailInput.disabled = true;
      
      setTimeout(() => {
        showMessage(messageElement, 'Thank you for subscribing! We\'ll keep you updated.', 'success');
        emailInput.value = '';
        emailInput.disabled = false;
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          showMessage(messageElement, '', '');
        }, 5000);
      }, 1000);
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
