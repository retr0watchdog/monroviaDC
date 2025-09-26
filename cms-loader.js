// CMS Data Loader - Loads content from YAML/JSON files for Decap CMS integration

class CMSLoader {
  constructor() {
    this.data = {};
    this.loadPromises = [];
  }

  // Load YAML file and parse it
  async loadYAML(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Could not load ${url}, using fallback content`);
        return null;
      }
      const text = await response.text();
      return this.parseYAML(text);
    } catch (error) {
      console.warn(`Error loading ${url}:`, error);
      return null;
    }
  }

  // Simple YAML parser for basic key-value pairs and lists
  parseYAML(yamlText) {
    const lines = yamlText.split('\n');
    const result = {};
    let currentKey = null;
    let currentList = null;
    let currentObject = null;
    let indentLevel = 0;

    for (let line of lines) {
      line = line.replace(/^\s*#.*$/, ''); // Remove comments
      if (!line.trim()) continue;

      const indent = line.match(/^\s*/)[0].length;
      const trimmed = line.trim();

      if (trimmed.includes(': ') && !trimmed.startsWith('- ')) {
        const [key, ...valueParts] = trimmed.split(': ');
        const value = valueParts.join(': ').replace(/^["']|["']$/g, '');
        
        if (indent === 0) {
          if (value === '') {
            currentKey = key;
            result[key] = {};
            currentObject = result[key];
          } else {
            result[key] = isNaN(value) ? value : Number(value);
          }
        } else if (currentObject) {
          currentObject[key] = isNaN(value) ? value : Number(value);
        }
      } else if (trimmed.startsWith('- ')) {
        const value = trimmed.substring(2).trim();
        if (!currentList) {
          currentList = [];
          if (currentKey) result[currentKey] = currentList;
        }
        
        if (value.includes(': ')) {
          const obj = {};
          const [objKey, ...objValueParts] = value.split(': ');
          const objValue = objValueParts.join(': ').replace(/^["']|["']$/g, '');
          obj[objKey] = isNaN(objValue) ? objValue : Number(objValue);
          currentList.push(obj);
        } else {
          currentList.push(value.replace(/^["']|["']$/g, ''));
        }
      }
    }

    return result;
  }

  // Load all events from the events folder
  async loadEvents() {
    const events = [];
    const eventFiles = [
      '2025-08-11-town-hall-meeting.md',
      '2025-08-20-community-protest.md',
      '2025-08-23-petition-signing.md',
      '2025-09-20-mooresville-street-fair.md',
      '2025-09-24-action-rally.md'
    ];

    for (const filename of eventFiles) {
      try {
        const response = await fetch(`_data/events/${filename}`);
        if (response.ok) {
          const text = await response.text();
          const frontMatterMatch = text.match(/^---\n([\s\S]*?)\n---/);
          if (frontMatterMatch) {
            const eventData = this.parseYAML(frontMatterMatch[1]);
            events.push(eventData);
          }
        }
      } catch (error) {
        console.warn(`Error loading event ${filename}:`, error);
      }
    }

    return events;
  }

  // Initialize and load all CMS data
  async init() {
    try {
      // Load settings
      this.data.settings = await this.loadYAML('_data/settings.yml');
      
      // Load home page data
      this.data.home = await this.loadYAML('_data/pages/home.yml');
      
      // Load events
      this.data.events = await this.loadEvents();

      // Apply data to the page
      this.applyData();
      
      console.log('CMS data loaded successfully');
    } catch (error) {
      console.error('Error initializing CMS loader:', error);
    }
  }

  // Apply loaded data to the current page
  applyData() {
    if (!this.data.settings && !this.data.home) return;

    // Update hero section if on home page
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
      this.updateHomePage();
    }

    // Update navigation title
    this.updateNavigation();

    // Update events calendar if present
    this.updateEventsCalendar();

    // Update social proof stats
    this.updateStats();
  }

  updateHomePage() {
    const settings = this.data.settings;
    const home = this.data.home;

    if (!settings && !home) return;

    // Update hero section
    const heroTitle = document.querySelector('.hero h2');
    const heroSubtitle = document.querySelector('.hero p');
    const petitionBtn = document.querySelector('.hero-actions a[href*="change.org"]');

    if (heroTitle && (home?.hero_title || settings?.hero_title)) {
      heroTitle.textContent = home?.hero_title || settings?.hero_title;
    }

    if (heroSubtitle && (home?.hero_subtitle || settings?.hero_subtitle)) {
      heroSubtitle.textContent = home?.hero_subtitle || settings?.hero_subtitle;
    }

    if (petitionBtn && settings?.petition_url) {
      petitionBtn.href = settings.petition_url;
    }

    // Update milestones
    this.updateMilestones();
  }

  updateMilestones() {
    const home = this.data.home;
    if (!home?.milestones) return;

    const milestonesContainer = document.querySelector('.milestones');
    if (!milestonesContainer) return;

    // Clear existing milestones
    milestonesContainer.innerHTML = '';

    // Add milestones from CMS data
    home.milestones.forEach(milestone => {
      const milestoneEl = document.createElement('div');
      milestoneEl.className = `milestone ${milestone.status}`;
      
      let progressBar = '';
      if (milestone.progress && milestone.progress_text) {
        progressBar = `
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${milestone.progress}%"></div>
          </div>
          <span class="progress-text">${milestone.progress_text}</span>
        `;
      }

      milestoneEl.innerHTML = `
        <div class="milestone-icon">${milestone.icon}</div>
        <h3>${milestone.title}</h3>
        <p>${milestone.description}</p>
        ${progressBar}
      `;

      milestonesContainer.appendChild(milestoneEl);
    });
  }

  updateNavigation() {
    const settings = this.data.settings;
    if (!settings?.site_title) return;

    const navTitle = document.querySelector('.navbar h1 a');
    if (navTitle) {
      navTitle.textContent = settings.site_title;
    }
  }

  updateEventsCalendar() {
    if (!this.data.events || !window.FullCalendar) return;

    // Convert CMS events to FullCalendar format
    const calendarEvents = this.data.events.map(event => ({
      title: event.title,
      start: event.date,
      end: event.end_date || null,
      url: event.url || null,
      color: event.color || '#B30000',
      textColor: 'white',
      extendedProps: {
        time: event.time,
        location: event.location,
        description: event.description
      }
    }));

    // Update calendar if it exists
    const calendarEl = document.getElementById('calendar');
    if (calendarEl && window.calendar) {
      window.calendar.removeAllEvents();
      window.calendar.addEventSource(calendarEvents);
    }
  }

  updateStats() {
    const settings = this.data.settings;
    if (!settings?.stats) return;

    // Update social proof statistics
    const statElements = {
      signatures: document.querySelector('.stat-item:nth-child(1) .stat-number'),
      volunteers: document.querySelector('.stat-item:nth-child(2) .stat-number'),
      businesses: document.querySelector('.stat-item:nth-child(3) .stat-number'),
      meetings: document.querySelector('.stat-item:nth-child(4) .stat-number')
    };

    Object.keys(statElements).forEach(key => {
      const element = statElements[key];
      if (element && settings.stats[key]) {
        element.textContent = settings.stats[key] + (key === 'signatures' ? '+' : key === 'businesses' ? '+' : '');
      }
    });
  }
}

// Initialize CMS loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const cmsLoader = new CMSLoader();
  cmsLoader.init();
  
  // Make it globally available for debugging
  window.cmsLoader = cmsLoader;
});
