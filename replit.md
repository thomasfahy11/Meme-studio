# Meme Studio - Web Version

A modern meme creation and discovery platform with professional editing tools. Originally a Chrome extension, now running as a web application on Replit.

## Overview
This project is a full-featured meme studio that allows users to search, edit, and create memes with text overlays and filters.

## Project Structure
- `server.js` - Node.js HTTP server serving the application on port 5000
- `sidebar.html` - Main UI with tabs for Search, Trending, Create, and History
- `sidebar.js` - Core JavaScript functionality
- `fontawesome.min.css` - Icon library
- `fonts/` - Font files

## Features

### Search Tab
- **Multiple API Sources**:
  - Imgflip Memes
  - Reddit (any subreddit)
  - Giphy GIFs
  - Meme Templates
- **Multi-language Support**: Search in any language (English, Hindi, etc.)
- **Real-time Search**: Auto-search as you type

### Trending Tab
- Browse trending memes from various sources
- Filter by subreddit
- Multiple API integrations

### Create Tab
- Upload your own images
- Turn any image into a meme

### History Tab
- View recently edited memes (last 100)
- Quick access to previous work

### Editor Features
- **Text Overlay**:
  - Live preview
  - Drag and drop positioning
  - Font customization (family, size, color)
  - Stroke effects
- **Image Filters**:
  - Brightness, Contrast, Saturation, Blur
  - Real-time preview
- **Export Options**:
  - Download
  - Copy to clipboard
  - Share

## APIs Used
1. **Imgflip API**: `https://api.imgflip.com/get_memes`
2. **Reddit Meme API**: `https://meme-api.com/gimme/`
3. **Giphy API**: `https://api.giphy.com/v1/gifs/`
4. **Memegen API**: `https://api.memegen.link/templates/`

## Tech Stack
- Pure JavaScript (no frameworks)
- HTML5 Canvas for image editing
- CSS3 with custom properties for theming
- Node.js HTTP server
- LocalStorage for caching

## Setup & Development
```bash
node server.js
```
Server runs on `http://0.0.0.0:5000`

## User Preferences
- Theme: Light/Dark mode toggle
- History: Auto-saves last 100 viewed memes
- Filters: Remembers last used settings

## Recent Changes
- **2025-11-20**: 
  - Converted from Chrome extension to web app
  - Removed duplicate Hindi search bar
  - Added multi-API support in search tab
  - Implemented all-language search functionality
  - Server configured to serve sidebar.html as homepage

## Architecture
- **Frontend**: Single-page application with tab-based navigation
- **Backend**: Simple static file server
- **Storage**: Browser localStorage for caching and history
- **APIs**: External meme APIs (no authentication required)
