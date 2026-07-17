# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern web-based clock application with comprehensive features including dual timezone support, theme management, and responsive sizing. The application uses ES modules with the following structure in the `html/` directory:

- `html/index.html` - Main HTML structure with comprehensive layout and semantic markup
- `html/script.js` - Application entry point (ES module) for DOM wiring and UI interactions
- `html/clock-core.js` - Pure formatting helpers (formatClockParts, formatDateString, getOffsetLabel) built on cached `Intl.DateTimeFormat` instances
- `html/timezones.js` - Timezone data export (55+ cities with IANA identifiers; `Asia/Yangon` replaces deprecated `Asia/Rangoon`)
- `html/styles.css` - CSS styling with CSS custom properties, animations, and responsive design

## Architecture

The application uses vanilla HTML/CSS/JavaScript with no build process or runtime dependencies (pnpm is used only for tests and the local dev server). Key architectural patterns:

- **Dual Clock System**: Supports both local time and secondary timezone display with smooth layout transitions
- **Theme System**: Uses CSS custom properties (`:root` variables) with `.dark-mode` class and system preference detection
- **Responsive Sizing**: Proportional scaling system using CSS variables for clock, labels, dates, and AM/PM indicators
- **State Management**: All preferences persisted in `localStorage` (theme, size, timezone, system preferences) with defensive try/catch wrapping
- **Animation System**: CSS transitions with cubic-bezier easing for smooth user experience; prefers-reduced-motion support
- **Time Updates**: Drift-free clock ticks via aligned `setTimeout()` with timezone-aware formatting via cached `Intl.DateTimeFormat` instances
- **Module Architecture**: ES module structure separating pure formatting logic (clock-core.js) from DOM wiring (script.js) and timezone data (timezones.js)

## Major Features Implemented

### Timezone Management
- 55+ world timezones ordered by UTC offset (-11 to +14); IANA identifiers with automatic DST handling
- Dropdown offset labels computed at load time via `getOffsetLabel()` using `timeZoneName: 'shortOffset'` for DST-correct formatting
- Smooth add/remove animations with proper state transitions
- Pre-populated content to eliminate loading delays

### Theme System
- Manual dark/light mode toggle
- System preference detection with `prefers-color-scheme`
- Disabled state management when system preferences enabled
- Persistent storage of theme choices

### Size Controls
- Three size modes: Small (5rem), Medium (8rem), Large (12rem)
- Proportional scaling of all elements including AM/PM indicators
- Fixed pixel offsets for AM/PM positioning (10px/15px/20px)
- Smooth resize animations without initial page load animation

### Time Display
- 12-hour format with styled AM/PM indicators
- De-emphasized seconds with reduced size and opacity
- Separate AM/PM divs positioned absolutely to prevent movement
- Consistent formatting across local and timezone displays

## Development Notes

### File Structure
```
clockapp/
├── html/
│   ├── index.html          # Main application
│   ├── script.js           # DOM wiring (ES module)
│   ├── clock-core.js       # Pure formatting helpers
│   ├── timezones.js        # Timezone data
│   ├── styles.css          # Styling with CSS custom properties
│   ├── favicon.ico         # Favicon
│   └── site.webmanifest    # Web app manifest
├── tests/
│   ├── clock-core.test.js  # Unit tests for formatting helpers (Vitest)
│   └── app-smoke.test.js   # DOM smoke tests for script.js wiring (Vitest + jsdom)
├── package.json            # Dependencies and scripts
├── README.md               # User documentation
└── CLAUDE.md               # This development guide
```

### Running Locally
- Install dependencies once: `pnpm install`
- Start a static server: `pnpm serve` (Python HTTP server on port 8000 serving the `html/` directory)
- Open `http://localhost:8000` in your browser
- Note: ES modules require a server; direct file:// URLs will not work

### Testing
- Run `pnpm test` to execute the test suite (Vitest)
- Unit tests cover core formatting functions: `formatClockParts`, `formatDateString`, `getOffsetLabel`
- DOM smoke tests (jsdom) exercise the real `script.js` module: initial render, drift-free ticking, timezone add/remove flow, theme toggle, and size controls
- Verify all features work with system preferences in multiple browsers

### Code Quality
- **Comprehensive Documentation**: All files contain extensive inline comments explaining functionality
- **Professional Structure**: Clear separation of concerns with organized CSS and JS sections
- **Accessibility**: Proper semantic HTML and keyboard navigation support
- **Performance**: Lightweight with smooth animations and minimal DOM manipulation

### Layout Challenges Addressed
- **AM/PM Positioning**: Fixed pixel offsets prevent movement during seconds updates
- **Dual Clock Centering**: Complex flexbox layout with transform adjustments for proper vertical centering
- **Animation Timing**: Pre-population strategy eliminates timezone clock pop-in delays
- **Theme Transitions**: Smooth color and size transitions without jarring effects

### Key Implementation Patterns
- CSS custom properties for consistent theming and responsive scaling
- Event-driven architecture with proper state management
- Defensive programming with null checks and fallback values
- Modern JavaScript APIs (Intl, localStorage, matchMedia) for robust functionality

## Recent Development Session Notes

### Documentation Enhancement
- **Comprehensive Code Documentation**: Added extensive inline comments to all HTML, CSS, and JavaScript files explaining functionality, architecture decisions, and implementation details
- **Professional Comment Structure**: Implemented JSDoc-style function documentation with parameter descriptions and usage examples
- **README Creation**: Added complete user documentation with feature overview, usage instructions, and technical details

### Project Organization
- **File Structure Reorganization**: Moved all web application files (HTML, CSS, JS) to `html/` subdirectory for better project organization
- **Git History Preservation**: Used `git mv` commands to maintain file history during reorganization
- **Progressive Web App Setup**: Added favicon files and web app manifest for enhanced mobile experience

### Mobile and PWA Enhancements
- **Favicon Support**: Complete favicon package including:
  - Standard favicon.ico
  - PNG favicons (16x16, 32x32)
  - Apple touch icon (180x180)
  - Android Chrome icons (192x192, 512x512)
- **Web App Manifest**: Added site.webmanifest for PWA capabilities
- **Mobile Optimization**: Enhanced mobile experience with proper icon support

### Development Best Practices Implemented
- **Thorough Documentation**: Every function, CSS class, and HTML section documented
- **Git Workflow**: Proper commit messages with clear descriptions of changes
- **Code Organization**: Logical separation of concerns with clear file structure
- **Future Maintainability**: Comprehensive CLAUDE.md updates for future development reference