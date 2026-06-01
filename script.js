// Enhanced Mobile menu toggle functionality
function toggleMenu() {
  const menu = document.getElementById('menu');
  const menuToggle = document.querySelector('.menu-toggle');

  menu.classList.toggle('active');
  menuToggle.classList.toggle('active');

  const isOpen = menu.classList.contains('active');
  menuToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('menu');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    menu.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
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
    menuToggle.setAttribute('aria-expanded', 'false');
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



// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
  // Close mobile menu with Escape key
  if (e.key === 'Escape') {
    const menu = document.getElementById('menu');
    const menuToggle = document.querySelector('.menu-toggle');
    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
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

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          contactForm.reset();
          submitBtn.textContent = 'Message Sent!';
          submitBtn.style.background = 'var(--green)';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
          }, 3000);
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(() => {
        submitBtn.textContent = 'Error — try again';
        submitBtn.disabled = false;
        setTimeout(() => { submitBtn.textContent = originalText; }, 3000);
      });
    });
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set active navigation item
  setActiveNavItem();
  
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
