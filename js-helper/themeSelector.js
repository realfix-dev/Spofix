// Theme Selector Component for Spotify
// This script adds a theme button next to the home icon in Spotify

// Available themes configuration
const THEMES = [
  { 
    name: 'Default',
    id: 'default',
    preview: 'https://example.com/default.png', // Replace with actual preview image
    files: {}
  },
  { 
    name: 'Hazy', 
    id: 'hazy',
    preview: 'https://example.com/hazy.png', // Replace with actual preview image
    files: {
      css: 'https://astromations.github.io/Hazy/app.css',
      js: 'https://astromations.github.io/Hazy/hazy.js',
      colors: {
        main: '0A0A0A',
        subtext: 'F0F0F0',
        shadow: '000000',
        text: 'FFFFFF',
        button: '30bf63',
        'button-active': '30bf63',
        accent: '30bf63'
      }
    }
  },
  { 
    name: 'Dark Blue', 
    id: 'darkblue',
    preview: 'https://example.com/darkblue.png', // Replace with actual preview image
    files: {
      css: 'https://example.com/DarkBlue/app.css',
      js: 'https://example.com/DarkBlue/darkblue.js',
      colors: {
        main: '0A0A24',
        subtext: 'F0F0FF',
        shadow: '000033',
        text: 'FFFFFF',
        button: '3060BF',
        'button-active': '3060BF',
        accent: '3060BF'
      }
    }
  }
  // Add more themes here
];

// Store the current theme in localStorage
function saveCurrentTheme(themeId) {
  localStorage.setItem('spotify-custom-theme', themeId);
}

// Get the current theme from localStorage
function getCurrentTheme() {
  return localStorage.getItem('spotify-custom-theme') || 'default';
}

// Apply theme by injecting CSS and JS
function applyTheme(themeId) {
  // Remove previous theme elements
  const existingThemeStyle = document.getElementById('custom-theme-style');
  if (existingThemeStyle) existingThemeStyle.remove();
  
  const existingThemeScript = document.getElementById('custom-theme-script');
  if (existingThemeScript) existingThemeScript.remove();

  // If default theme, just cleanup and return
  if (themeId === 'default' || !themeId) {
    return;
  }

  // Find the selected theme
  const theme = THEMES.find(t => t.id === themeId);
  if (!theme) return;

  // Apply CSS if available
  if (theme.files.css) {
    const style = document.createElement('link');
    style.id = 'custom-theme-style';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = theme.files.css;
    document.head.appendChild(style);
  }

  // Apply JS if available
  if (theme.files.js) {
    const script = document.createElement('script');
    script.id = 'custom-theme-script';
    script.src = theme.files.js;
    document.head.appendChild(script);
  }

  // Save the current theme
  saveCurrentTheme(themeId);
}

// Create theme selector UI
function createThemeSelector() {
  // Wait for the navigation bar to be loaded
  const checkInterval = setInterval(() => {
    const navBar = document.querySelector('.Root__nav-bar nav ul');
    if (navBar) {
      clearInterval(checkInterval);
      injectThemeButton(navBar);
    }
  }, 1000);
}

function injectThemeButton(navBar) {
  // Check if the theme button already exists
  if (document.querySelector('.theme-selector-container')) {
    return;
  }

  // Create theme button container 
  const themeItem = document.createElement('li');
  themeItem.className = 'theme-selector-container';
  themeItem.style.cssText = 'display: flex; align-items: center; justify-content: flex-start;';
  
  // Create theme button
  const themeButton = document.createElement('a');
  themeButton.className = 'theme-selector-button';
  themeButton.href = 'javascript:void(0)';
  themeButton.title = 'Theme Selector';
  themeButton.setAttribute('aria-label', 'Theme Selector');
  themeButton.innerHTML = `
    <div style="display: flex; align-items: center; padding: 8px 12px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      <span style="margin-left: 16px; font-size: 14px; font-weight: 700;">Themes</span>
    </div>
  `;
  
  // Add click event to show theme modal
  themeButton.addEventListener('click', openThemeModal);
  
  themeItem.appendChild(themeButton);
  navBar.appendChild(themeItem);
  
  // Apply saved theme on startup
  const savedTheme = getCurrentTheme();
  if (savedTheme) {
    applyTheme(savedTheme);
  }
}

// Create and open theme modal
function openThemeModal() {
  // Remove existing modal if any
  const existingModal = document.getElementById('theme-selector-modal');
  if (existingModal) existingModal.remove();
  
  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'theme-selector-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background-color: #282828;
    color: white;
    width: 70%;
    max-width: 800px;
    border-radius: 8px;
    padding: 24px;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  `;
  
  const title = document.createElement('h2');
  title.textContent = 'Select a Theme';
  title.style.margin = '0';
  
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  `;
  closeButton.addEventListener('click', () => modal.remove());
  
  header.appendChild(title);
  header.appendChild(closeButton);
  modalContent.appendChild(header);
  
  // Create theme grid
  const themeGrid = document.createElement('div');
  themeGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 16px;
  `;
  
  // Current theme
  const currentTheme = getCurrentTheme();
  
  // Add themes to grid
  THEMES.forEach(theme => {
    const themeCard = document.createElement('div');
    themeCard.style.cssText = `
      background-color: #333;
      border-radius: 4px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid ${theme.id === currentTheme ? '#1DB954' : 'transparent'};
    `;
    themeCard.addEventListener('click', () => {
      applyTheme(theme.id);
      modal.remove();
    });
    
    // Add hover effect
    themeCard.addEventListener('mouseenter', () => {
      themeCard.style.backgroundColor = '#444';
    });
    themeCard.addEventListener('mouseleave', () => {
      themeCard.style.backgroundColor = '#333';
    });
    
    // Theme preview
    const preview = document.createElement('div');
    preview.style.cssText = `
      width: 100%;
      height: 120px;
      background-color: #222;
      border-radius: 4px;
      margin-bottom: 8px;
      background-image: url(${theme.preview});
      background-size: cover;
      background-position: center;
    `;
    
    // Color sample (for themes without preview)
    if (theme.files.colors && !theme.preview) {
      const colorSample = document.createElement('div');
      colorSample.style.cssText = `
        position: absolute;
        width: calc(100% - 24px);
        height: 120px;
        border-radius: 4px;
        background-color: #${theme.files.colors.main || '000000'};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `;
      
      // Add color accent sample
      const accentSample = document.createElement('div');
      accentSample.style.cssText = `
        width: 80px;
        height: 30px;
        border-radius: 15px;
        background-color: #${theme.files.colors.accent || theme.files.colors.button || '1DB954'};
        margin-bottom: 8px;
      `;
      
      // Add theme name on preview
      const nameOnPreview = document.createElement('div');
      nameOnPreview.textContent = theme.name;
      nameOnPreview.style.cssText = `
        color: #${theme.files.colors.text || 'FFFFFF'};
        font-weight: bold;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      `;
      
      colorSample.appendChild(accentSample);
      colorSample.appendChild(nameOnPreview);
      preview.appendChild(colorSample);
    }
    
    // Theme name
    const name = document.createElement('div');
    name.textContent = theme.name;
    name.style.fontWeight = 'bold';
    
    themeCard.appendChild(preview);
    themeCard.appendChild(name);
    themeGrid.appendChild(themeCard);
  });
  
  // Add theme grid to modal
  modalContent.appendChild(themeGrid);
  
  // Add "Add Custom Theme" section
  const customSection = document.createElement('div');
  customSection.style.cssText = `
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #444;
  `;
  
  const customTitle = document.createElement('h3');
  customTitle.textContent = 'Add Custom Theme';
  customTitle.style.marginBottom = '16px';
  
  const customForm = document.createElement('div');
  customForm.innerHTML = `
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px;">Theme Name</label>
      <input type="text" id="custom-theme-name" style="width: 100%; padding: 8px; background: #3E3E3E; border: none; border-radius: 4px; color: white;">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px;">CSS URL</label>
      <input type="text" id="custom-theme-css" style="width: 100%; padding: 8px; background: #3E3E3E; border: none; border-radius: 4px; color: white;">
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px;">JavaScript URL</label>
      <input type="text" id="custom-theme-js" style="width: 100%; padding: 8px; background: #3E3E3E; border: none; border-radius: 4px; color: white;">
    </div>
    <button id="add-custom-theme" style="background: #1DB954; border: none; padding: 8px 16px; border-radius: 4px; color: white; cursor: pointer;">Add Theme</button>
  `;
  
  customSection.appendChild(customTitle);
  customSection.appendChild(customForm);
  modalContent.appendChild(customSection);
  
  // Add custom theme logic
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'theme-selector-modal') {
      modal.remove();
    }
  });
  
  // Add custom theme button logic
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'add-custom-theme') {
      const name = document.getElementById('custom-theme-name').value;
      const css = document.getElementById('custom-theme-css').value;
      const js = document.getElementById('custom-theme-js').value;
      
      if (name && (css || js)) {
        // Generate a unique ID for the theme
        const id = 'custom-' + Date.now();
        
        // Add the new theme to the themes array
        THEMES.push({
          name,
          id,
          preview: '',
          files: {
            css,
            js
          }
        });
        
        // Apply the new theme
        applyTheme(id);
        modal.remove();
      }
    }
  });
  
  // Add modal to page
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// Initialize theme selector when the page is loaded
window.addEventListener('load', createThemeSelector);

// Re-initialize when the navigation changes
const originalPushState = history.pushState;
history.pushState = function() {
  originalPushState.apply(this, arguments);
  setTimeout(createThemeSelector, 500);
};

// Apply the saved theme on page load
const savedTheme = getCurrentTheme();
if (savedTheme) {
  applyTheme(savedTheme);
} 