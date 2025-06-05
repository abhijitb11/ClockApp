# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple web-based clock application that displays the current time and date with dark mode support. The application consists of three main files:

- `index.html` - Main HTML structure with time/date display and theme controls
- `script.js` - JavaScript for time updates and theme management 
- `styles.css` - CSS styling with CSS custom properties for theming

## Architecture

The application uses vanilla HTML/CSS/JavaScript with no build process or dependencies. Key architectural patterns:

- **Theme System**: Uses CSS custom properties (`:root` variables) that are dynamically updated via the `.dark-mode` class on the `<html>` element
- **State Management**: Theme preferences are persisted in `localStorage` with support for both manual and system theme preferences
- **Time Updates**: Uses `setInterval()` to update the time display every second

## Development

Since this is a static web application with no build process:

- **Running locally**: Open `index.html` directly in a browser or serve via any static file server
- **No build/lint/test commands**: This is a simple static site with no tooling setup
- **Browser testing**: Test in multiple browsers and verify dark mode works with system preferences

## Key Implementation Details

- Theme switching logic in `script.js` handles both manual toggle and system preference detection
- Time formatting uses `padStart()` for consistent two-digit display
- CSS transitions provide smooth theme switching animations
- The toggle button is disabled when "Follow System Preferences" is enabled