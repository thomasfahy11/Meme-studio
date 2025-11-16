# Meme Studio - Chrome Extension

A modern Chrome extension for creating, editing, and discovering memes with professional editing tools.

## Features

### 🎨 Meme Editing
- **Text Overlay** - Add custom text with full control:
  - Font family (Impact, Arial, Comic Sans, Times New Roman, Courier)
  - Font size (20-100px)
  - Text color picker
  - Stroke color and width
  - Position (top, center, bottom)
  
- **Image Filters** - Professional image adjustments:
  - Brightness (0-200%)
  - Contrast (0-200%)
  - Saturation (0-200%)
  - Blur (0-10px)

### 🔍 Meme Discovery
- **Multiple Sources**:
  - Imgflip popular memes
  - Reddit memes from any subreddit
  - Giphy trending GIFs
  - Hindi memes support
  
- **Smart Search**:
  - Search by keywords
  - Filter by subreddit
  - Browse trending content

### 💾 Organization
- **History Tab** - View your last 100 memes
- **Upload Tab** - Use your own images
- **Dark Mode** - Eye-friendly interface
- **Local Storage** - Fast caching

### ⌨️ Keyboard Shortcuts
- `ESC` - Close editor
- `Ctrl/Cmd + S` - Download meme
- `Ctrl/Cmd + C` - Copy meme

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this folder
5. Click the extension icon to start!

## Usage

1. **Browse** - Use Search or Trending tabs to find memes
2. **Edit** - Click any image to open the editor
3. **Customize** - Add text and apply filters
4. **Save** - Download or copy to clipboard

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:5000 for documentation.

## Tech Stack

- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for editing
- Chrome Extension API (Manifest V3)
- LocalStorage for caching
- Font Awesome icons

## APIs Used

- Imgflip: `https://api.imgflip.com/get_memes`
- Meme API: `https://meme-api.com/gimme/`
- Giphy: `https://api.giphy.com/v1/gifs/`

## Contributing

Contributions are welcome! Just:
1. Fork the repo
2. Make your changes
3. Submit a pull request

Please test your changes in Chrome before submitting.

## License

MIT License

---

**Version:** 1.0.0
