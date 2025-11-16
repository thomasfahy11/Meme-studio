// Meme Studio - Enhanced Version
// Storage Utility System
class StorageUtility {
  constructor() {
    this.prefix = 'meme_studio_';
  }

  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      return false;
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

const storage = new StorageUtility();

// Storage Keys
const STORAGE_KEYS = {
  THEME: 'theme',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  TEXT_SETTINGS: 'text_settings',
  FILTER_SETTINGS: 'filter_settings'
};

// Global State
let currentImage = null;
let currentFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0
};
let memeHistory = storage.get(STORAGE_KEYS.HISTORY, []);
let allMemes = [];
let trendingMemes = [];

// Text drag state
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let textPosition = { x: 0, y: 0 };

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeTabNavigation();
  initializeSearchTab();
  initializeTrendingTab();
  initializeCreateTab();
  initializeHistoryTab();
  initializeModal();
  initializeKeyboardShortcuts();
});

// Theme Management
function initializeTheme() {
  const theme = storage.get(STORAGE_KEYS.THEME, 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    storage.set(STORAGE_KEYS.THEME, newTheme);
    updateThemeIcon(newTheme);
    showToast(newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
  });

  document.getElementById('clearCacheBtn').addEventListener('click', () => {
    if (confirm('Clear all cached data?')) {
      storage.clear();
      showToast('Cache cleared successfully');
      location.reload();
    }
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Tab Navigation
function initializeTabNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
}

// Toast Notifications
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Search Tab
function initializeSearchTab() {
  const searchInput = document.getElementById('searchInput');
  const hindiSearchInput = document.getElementById('hindiSearchInput');
  const gallery = document.getElementById('gallery');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  
  let searchTimeout;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchMemes(e.target.value);
    }, 500);
  });

  hindiSearchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchHindiMemes(e.target.value);
    }, 500);
  });

  loadMoreBtn.addEventListener('click', () => {
    renderMoreMemes();
  });

  // Load initial memes
  fetchMemes();
}

async function fetchMemes() {
  const loading = document.getElementById('searchLoading');
  const gallery = document.getElementById('gallery');
  
  loading.classList.add('show');
  
  try {
    const response = await fetch('https://api.imgflip.com/get_memes');
    const data = await response.json();
    if (data.success) {
      allMemes = data.data.memes;
      renderMemes(allMemes.slice(0, 20));
      document.getElementById('loadMoreBtn').style.display = 'block';
    }
  } catch (error) {
    gallery.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>Error Loading Memes</h3><p>Please try again later</p></div>';
  } finally {
    loading.classList.remove('show');
  }
}

function searchMemes(query) {
  if (!query.trim()) {
    renderMemes(allMemes.slice(0, 20));
    return;
  }

  const filtered = allMemes.filter(meme => 
    meme.name.toLowerCase().includes(query.toLowerCase())
  );
  renderMemes(filtered.slice(0, 20));
}

async function searchHindiMemes(query) {
  if (!query.trim()) return;

  const loading = document.getElementById('searchLoading');
  loading.classList.add('show');

  try {
    const response = await fetch(`https://meme-api.com/gimme/desimemes/20`);
    const data = await response.json();
    if (data.memes) {
      renderMemes(data.memes);
    }
  } catch (error) {
    showToast('Error loading Hindi memes', 3000);
  } finally {
    loading.classList.remove('show');
  }
}

function renderMemes(memes) {
  const gallery = document.getElementById('gallery');
  
  if (memes.length === 0) {
    gallery.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No Memes Found</h3><p>Try a different search term</p></div>';
    return;
  }

  gallery.innerHTML = memes.map(meme => `
    <div class="gallery-item" data-url="${meme.url}" data-title="${meme.name || meme.title || ''}">
      <img class="gallery-img" src="${meme.url}" alt="${meme.name || meme.title || 'Meme'}" loading="lazy">
      <div class="gallery-overlay">
        <i class="fas fa-edit"></i>
      </div>
    </div>
  `).join('');
  
  gallery.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
      openEditor(this.dataset.url, this.dataset.title);
    });
  });
}

function renderMoreMemes() {
  const gallery = document.getElementById('gallery');
  const currentCount = gallery.children.length;
  const nextMemes = allMemes.slice(currentCount, currentCount + 20);
  
  nextMemes.forEach(meme => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.addEventListener('click', () => openEditor(meme.url, meme.name || ''));
    div.innerHTML = `
      <img class="gallery-img" src="${meme.url}" alt="${meme.name || 'Meme'}" loading="lazy">
      <div class="gallery-overlay">
        <i class="fas fa-edit"></i>
      </div>
    `;
    gallery.appendChild(div);
  });

  if (currentCount + 20 >= allMemes.length) {
    document.getElementById('loadMoreBtn').style.display = 'none';
  }
}

// Trending Tab
function initializeTrendingTab() {
  const apiSelect = document.getElementById('apiSelect');
  const subredditInput = document.getElementById('subredditInput');
  const loadMoreBtn = document.getElementById('loadMoreTrendingBtn');

  apiSelect.addEventListener('change', () => {
    fetchTrendingMemes(apiSelect.value);
  });

  let searchTimeout;
  subredditInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (e.target.value.trim()) {
        fetchSubredditMemes(e.target.value.trim());
      }
    }, 500);
  });

  loadMoreBtn.addEventListener('click', () => {
    renderMoreTrendingMemes();
  });

  // Load initial trending memes
  fetchTrendingMemes('memeapi');
}

async function fetchTrendingMemes(api) {
  const loading = document.getElementById('trendingLoading');
  const gallery = document.getElementById('trendingGallery');
  
  loading.classList.add('show');
  
  try {
    let url;
    switch(api) {
      case 'imgflip':
        url = 'https://api.imgflip.com/get_memes';
        break;
      case 'giphy':
        url = 'https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=50&rating=g';
        break;
      case 'memegen':
        url = 'https://api.memegen.link/templates/';
        break;
      case 'memeapi':
      default:
        url = 'https://meme-api.com/gimme/50';
    }

    const response = await fetch(url);
    const data = await response.json();
    
    if (api === 'imgflip' && data.success) {
      trendingMemes = data.data.memes;
      renderTrendingMemes(trendingMemes.slice(0, 20));
    } else if (api === 'giphy' && data.data) {
      trendingMemes = data.data.map(gif => ({
        url: gif.images.fixed_height.url,
        title: gif.title
      }));
      renderTrendingMemes(trendingMemes.slice(0, 20));
    } else if (api === 'memegen' && Array.isArray(data)) {
      trendingMemes = data.map(template => ({
        url: template.blank,
        title: template.name,
        id: template.id
      }));
      renderTrendingMemes(trendingMemes.slice(0, 20));
    } else if (data.memes) {
      trendingMemes = data.memes;
      renderTrendingMemes(trendingMemes);
    }
    
    document.getElementById('loadMoreTrendingBtn').style.display = 'block';
  } catch (error) {
    gallery.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>Error Loading</h3><p>Please try again</p></div>';
  } finally {
    loading.classList.remove('show');
  }
}

async function fetchSubredditMemes(subreddit) {
  const loading = document.getElementById('trendingLoading');
  loading.classList.add('show');

  try {
    const response = await fetch(`https://meme-api.com/gimme/${subreddit}/30`);
    const data = await response.json();
    
    if (data.memes) {
      trendingMemes = data.memes;
      renderTrendingMemes(trendingMemes);
    } else {
      showToast('Subreddit not found');
    }
  } catch (error) {
    showToast('Error loading subreddit');
  } finally {
    loading.classList.remove('show');
  }
}

function renderTrendingMemes(memes) {
  const gallery = document.getElementById('trendingGallery');
  
  if (memes.length === 0) {
    gallery.innerHTML = '<div class="empty-state"><i class="fas fa-meh"></i><h3>No Memes Found</h3></div>';
    return;
  }

  gallery.innerHTML = memes.map(meme => `
    <div class="gallery-item" data-url="${meme.url}" data-title="${meme.title || meme.name || ''}">
      <img class="gallery-img" src="${meme.url}" alt="${meme.title || 'Meme'}" loading="lazy">
      <div class="gallery-overlay">
        <i class="fas fa-edit"></i>
      </div>
    </div>
  `).join('');
  
  gallery.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
      openEditor(this.dataset.url, this.dataset.title);
    });
  });
}

function renderMoreTrendingMemes() {
  const gallery = document.getElementById('trendingGallery');
  const currentCount = gallery.children.length;
  const nextMemes = trendingMemes.slice(currentCount, currentCount + 20);
  
  nextMemes.forEach(meme => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.addEventListener('click', () => openEditor(meme.url, meme.title || ''));
    div.innerHTML = `
      <img class="gallery-img" src="${meme.url}" alt="${meme.title || 'Meme'}" loading="lazy">
      <div class="gallery-overlay">
        <i class="fas fa-edit"></i>
      </div>
    `;
    gallery.appendChild(div);
  });

  if (currentCount + 20 >= trendingMemes.length) {
    document.getElementById('loadMoreTrendingBtn').style.display = 'none';
  }
}

// Create Tab
function initializeCreateTab() {
  const imageInput = document.getElementById('imageInput');
  
  imageInput.addEventListener('change', (e) => {
    handleImageUpload(e.target.files);
  });
}

function handleImageUpload(files) {
  const gallery = document.getElementById('uploadGallery');
  gallery.innerHTML = '';

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      const imageUrl = e.target.result;
      const fileName = file.name;
      div.addEventListener('click', () => openEditor(imageUrl, fileName));
      div.innerHTML = `
        <img class="gallery-img" src="${imageUrl}" alt="${fileName}">
        <div class="gallery-overlay">
          <i class="fas fa-edit"></i>
        </div>
      `;
      gallery.appendChild(div);
    };
    reader.readAsDataURL(file);
  });

  showToast('Images uploaded successfully');
}

// History Tab
function initializeHistoryTab() {
  renderHistory();
}

function renderHistory() {
  const gallery = document.getElementById('historyGallery');
  
  if (memeHistory.length === 0) {
    gallery.innerHTML = '<div class="empty-state"><i class="fas fa-clock"></i><h3>No History Yet</h3><p>Your recently viewed memes will appear here</p></div>';
    return;
  }

  gallery.innerHTML = memeHistory.slice(0, 50).map(item => `
    <div class="gallery-item" data-url="${item.url}" data-title="${item.name}">
      <img class="gallery-img" src="${item.url}" alt="${item.name}" loading="lazy">
      <div class="gallery-overlay">
        <i class="fas fa-edit"></i>
      </div>
    </div>
  `).join('');
  
  gallery.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
      openEditor(this.dataset.url, this.dataset.title);
    });
  });
}

function addToHistory(url, name) {
  memeHistory.unshift({ url, name, timestamp: Date.now() });
  memeHistory = memeHistory.slice(0, 100); // Keep last 100
  storage.set(STORAGE_KEYS.HISTORY, memeHistory);
  renderHistory();
}

// Modal & Editor
function initializeModal() {
  const modal = document.getElementById('editorModal');
  const closeBtn = document.getElementById('modalClose');
  const addTextBtn = document.getElementById('addTextBtn');
  const filtersBtn = document.getElementById('filtersBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const copyBtn = document.getElementById('copyBtn');
  const shareBtn = document.getElementById('shareBtn');
  const applyTextBtn = document.getElementById('applyTextBtn');
  const cancelTextBtn = document.getElementById('cancelTextBtn');

  closeBtn.addEventListener('click', closeEditor);
  
  addTextBtn.addEventListener('click', () => {
    const textEditor = document.getElementById('textEditor');
    const filterControls = document.getElementById('filterControls');
    const draggableText = document.getElementById('draggableText');
    
    filterControls.style.display = 'none';
    
    if (textEditor.style.display === 'none') {
      textEditor.style.display = 'block';
      draggableText.style.display = 'block';
      initializeDraggableText();
      document.getElementById('textInput').focus();
    } else {
      textEditor.style.display = 'none';
      draggableText.style.display = 'none';
    }
  });

  filtersBtn.addEventListener('click', () => {
    const filterControls = document.getElementById('filterControls');
    const textEditor = document.getElementById('textEditor');
    textEditor.style.display = 'none';
    filterControls.style.display = filterControls.style.display === 'none' ? 'block' : 'none';
  });

  applyTextBtn.addEventListener('click', applyText);
  cancelTextBtn.addEventListener('click', () => {
    document.getElementById('textEditor').style.display = 'none';
    document.getElementById('draggableText').style.display = 'none';
    document.getElementById('textInput').value = '';
    document.getElementById('textContent').textContent = '';
  });

  downloadBtn.addEventListener('click', downloadMeme);
  copyBtn.addEventListener('click', copyMeme);
  shareBtn.addEventListener('click', () => showToast('Share feature coming soon!'));

  // Text controls with live preview
  document.getElementById('textInput').addEventListener('input', updateTextPreview);
  
  document.getElementById('fontSize').addEventListener('input', (e) => {
    document.getElementById('fontSizeValue').textContent = e.target.value;
    updateTextPreview();
  });
  
  document.getElementById('fontFamily').addEventListener('change', updateTextPreview);
  document.getElementById('textColor').addEventListener('input', updateTextPreview);
  document.getElementById('strokeColor').addEventListener('input', updateTextPreview);
  
  document.getElementById('strokeWidth').addEventListener('input', (e) => {
    document.getElementById('strokeWidthValue').textContent = e.target.value;
    updateTextPreview();
  });
  
  document.getElementById('textPosition').addEventListener('change', (e) => {
    if (e.target.value !== 'custom') {
      positionTextPreset(e.target.value);
    }
  });

  // Filter controls
  initializeFilters();

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeEditor();
    }
  });
}

function openEditor(url, name = '') {
  currentImage = url;
  addToHistory(url, name);
  
  const modal = document.getElementById('editorModal');
  const img = document.getElementById('modalImage');
  
  img.src = url;
  img.alt = name;
  modal.classList.add('show');
  
  // Reset editors
  document.getElementById('textEditor').style.display = 'none';
  document.getElementById('filterControls').style.display = 'none';
  document.getElementById('draggableText').style.display = 'none';
  document.getElementById('textInput').value = '';
  document.getElementById('textContent').textContent = '';
  document.getElementById('textPosition').value = 'custom';
  resetFilters();
}

function closeEditor() {
  const modal = document.getElementById('editorModal');
  modal.classList.remove('show');
  document.getElementById('draggableText').style.display = 'none';
  currentImage = null;
}

// Initialize Draggable Text
function initializeDraggableText() {
  const draggableText = document.getElementById('draggableText');
  const container = document.getElementById('imageContainer');
  const img = document.getElementById('modalImage');
  
  // Position text at bottom center initially
  const imgRect = img.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  textPosition = {
    x: (imgRect.width / 2) - (draggableText.offsetWidth / 2),
    y: imgRect.height - draggableText.offsetHeight - 20
  };
  
  draggableText.style.left = textPosition.x + 'px';
  draggableText.style.top = textPosition.y + 'px';
  
  // Add drag handlers
  draggableText.onmousedown = startDrag;
  draggableText.ontouchstart = startDrag;
}

function startDrag(e) {
  e.preventDefault();
  const draggableText = document.getElementById('draggableText');
  draggableText.classList.add('dragging');
  document.getElementById('textPosition').value = 'custom';
  
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  
  dragOffsetX = clientX - draggableText.offsetLeft;
  dragOffsetY = clientY - draggableText.offsetTop;
  
  isDragging = true;
  
  document.onmousemove = drag;
  document.onmouseup = stopDrag;
  document.ontouchmove = drag;
  document.ontouchend = stopDrag;
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  
  const draggableText = document.getElementById('draggableText');
  const img = document.getElementById('modalImage');
  
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  
  let newX = clientX - dragOffsetX;
  let newY = clientY - dragOffsetY;
  
  // Constrain within image bounds
  const maxX = img.offsetWidth - draggableText.offsetWidth;
  const maxY = img.offsetHeight - draggableText.offsetHeight;
  
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));
  
  textPosition = { x: newX, y: newY };
  draggableText.style.left = newX + 'px';
  draggableText.style.top = newY + 'px';
}

function stopDrag() {
  isDragging = false;
  document.getElementById('draggableText').classList.remove('dragging');
  document.onmousemove = null;
  document.onmouseup = null;
  document.ontouchmove = null;
  document.ontouchend = null;
}

// Update text preview in real-time
function updateTextPreview() {
  const text = document.getElementById('textInput').value;
  const textContent = document.getElementById('textContent');
  const draggableText = document.getElementById('draggableText');
  
  textContent.textContent = text || '';
  
  if (text) {
    draggableText.style.display = 'block';
  } else {
    draggableText.style.display = 'none';
  }
  
  // Apply styling
  const fontSize = document.getElementById('fontSize').value;
  const fontFamily = document.getElementById('fontFamily').value;
  const textColor = document.getElementById('textColor').value;
  const strokeColor = document.getElementById('strokeColor').value;
  const strokeWidth = document.getElementById('strokeWidth').value;
  
  textContent.style.fontFamily = fontFamily;
  textContent.style.fontSize = fontSize + 'px';
  textContent.style.color = textColor;
  
  // Update text shadow for stroke effect
  const stroke = parseInt(strokeWidth);
  textContent.style.textShadow = `
    -${stroke}px -${stroke}px 0 ${strokeColor},  
    ${stroke}px -${stroke}px 0 ${strokeColor},
    -${stroke}px ${stroke}px 0 ${strokeColor},
    ${stroke}px ${stroke}px 0 ${strokeColor},
    -${stroke * 2}px 0 0 ${strokeColor},
    ${stroke * 2}px 0 0 ${strokeColor},
    0 -${stroke * 2}px 0 ${strokeColor},
    0 ${stroke * 2}px 0 ${strokeColor}
  `;
}

// Position text using presets
function positionTextPreset(position) {
  const draggableText = document.getElementById('draggableText');
  const img = document.getElementById('modalImage');
  
  let x = (img.offsetWidth / 2) - (draggableText.offsetWidth / 2);
  let y;
  
  switch(position) {
    case 'top':
      y = 20;
      break;
    case 'center':
      y = (img.offsetHeight / 2) - (draggableText.offsetHeight / 2);
      break;
    case 'bottom':
      y = img.offsetHeight - draggableText.offsetHeight - 20;
      break;
  }
  
  textPosition = { x, y };
  draggableText.style.left = x + 'px';
  draggableText.style.top = y + 'px';
}

function applyText() {
  const text = document.getElementById('textInput').value.trim();
  if (!text) {
    showToast('Please enter some text');
    return;
  }

  const img = document.getElementById('modalImage');
  const draggableText = document.getElementById('draggableText');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const newImg = new Image();
  newImg.crossOrigin = 'anonymous';
  
  newImg.onload = () => {
    canvas.width = newImg.width;
    canvas.height = newImg.height;

    // Apply current filters
    applyCanvasFilters(ctx, canvas);

    ctx.drawImage(newImg, 0, 0);

    // Calculate scale ratio between displayed image and actual canvas
    const scaleX = canvas.width / img.offsetWidth;
    const scaleY = canvas.height / img.offsetHeight;
    
    // Get text settings and SCALE them to match canvas size
    const fontSize = document.getElementById('fontSize').value;
    const fontFamily = document.getElementById('fontFamily').value;
    const textColor = document.getElementById('textColor').value;
    const strokeColor = document.getElementById('strokeColor').value;
    const strokeWidth = document.getElementById('strokeWidth').value;
    
    // Scale font size and stroke width for canvas
    const scaledFontSize = parseInt(fontSize) * scaleX;
    const scaledStrokeWidth = parseInt(strokeWidth) * scaleX;

    ctx.font = `bold ${scaledFontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = scaledStrokeWidth;
    ctx.textAlign = 'left';

    // Get text position from draggable element and scale it
    const canvasX = textPosition.x * scaleX;
    const canvasY = textPosition.y * scaleY;

    // Wrap text and draw with scaled line height
    const lines = text.split('\n');
    const lineHeight = scaledFontSize * 1.2;

    lines.forEach((line, i) => {
      const lineY = canvasY + scaledFontSize + (i * lineHeight);
      ctx.strokeText(line, canvasX + (10 * scaleX), lineY);
      ctx.fillText(line, canvasX + (10 * scaleX), lineY);
    });

    img.src = canvas.toDataURL('image/png');
    currentImage = img.src;
    
    document.getElementById('textEditor').style.display = 'none';
    document.getElementById('draggableText').style.display = 'none';
    document.getElementById('textInput').value = '';
    document.getElementById('textContent').textContent = '';
    showToast('✨ Text applied successfully!');
  };

  newImg.onerror = () => {
    showToast('Error loading image');
  };

  newImg.src = img.src;
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const width = ctx.measureText(testLine).width;
    
    if (width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

function downloadMeme() {
  const img = document.getElementById('modalImage');
  const link = document.createElement('a');
  link.download = `meme-${Date.now()}.png`;
  link.href = img.src;
  link.click();
  showToast('Meme downloaded!');
}

async function copyMeme() {
  try {
    const img = document.getElementById('modalImage');
    const response = await fetch(img.src);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
    
    showToast('Meme copied to clipboard!');
  } catch (error) {
    showToast('Copy failed. Try download instead.');
  }
}

// Filters
function initializeFilters() {
  const filterInputs = ['brightness', 'contrast', 'saturation', 'blur'];
  
  filterInputs.forEach(filter => {
    const input = document.getElementById(filter);
    const valueSpan = document.getElementById(`${filter}Value`);
    
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      currentFilters[filter] = value;
      valueSpan.textContent = filter === 'blur' ? `${value}px` : `${value}%`;
      applyFiltersPreview();
    });
  });

  document.getElementById('applyFiltersBtn').addEventListener('click', applyFiltersToImage);
  document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
}

function applyFiltersPreview() {
  const img = document.getElementById('modalImage');
  img.style.filter = `brightness(${currentFilters.brightness}%) contrast(${currentFilters.contrast}%) saturate(${currentFilters.saturation}%) blur(${currentFilters.blur}px)`;
}

function applyFiltersToImage() {
  const img = document.getElementById('modalImage');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const newImg = new Image();
  newImg.crossOrigin = 'anonymous';
  
  newImg.onload = () => {
    canvas.width = newImg.width;
    canvas.height = newImg.height;

    ctx.filter = `brightness(${currentFilters.brightness}%) contrast(${currentFilters.contrast}%) saturate(${currentFilters.saturation}%) blur(${currentFilters.blur}px)`;
    ctx.drawImage(newImg, 0, 0);

    img.src = canvas.toDataURL('image/png');
    currentImage = img.src;
    img.style.filter = 'none';
    
    showToast('Filters applied!');
  };

  newImg.src = img.src;
}

function applyCanvasFilters(ctx, canvas) {
  ctx.filter = `brightness(${currentFilters.brightness}%) contrast(${currentFilters.contrast}%) saturate(${currentFilters.saturation}%) blur(${currentFilters.blur}px)`;
}

function resetFilters() {
  currentFilters = { brightness: 100, contrast: 100, saturation: 100, blur: 0 };
  
  document.getElementById('brightness').value = 100;
  document.getElementById('contrast').value = 100;
  document.getElementById('saturation').value = 100;
  document.getElementById('blur').value = 0;
  
  document.getElementById('brightnessValue').textContent = '100%';
  document.getElementById('contrastValue').textContent = '100%';
  document.getElementById('saturationValue').textContent = '100%';
  document.getElementById('blurValue').textContent = '0px';
  
  const img = document.getElementById('modalImage');
  img.style.filter = 'none';
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
      closeEditor();
    }

    // Ctrl/Cmd + S to download
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (currentImage) {
        downloadMeme();
      }
    }

    // Ctrl/Cmd + C to copy
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      if (currentImage && document.getElementById('editorModal').classList.contains('show')) {
        e.preventDefault();
        copyMeme();
      }
    }
  });
}

// Global function for onclick handlers
window.openEditor = openEditor;
