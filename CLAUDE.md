# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern web-based clock application with comprehensive features including dual timezone support, theme management, and responsive sizing. The application consists of three main files located in the `html/` directory:

- `html/index.html` - Main HTML structure with comprehensive layout and semantic markup
- `html/script.js` - JavaScript for time updates, timezone management, theme switching, and UI interactions
- `html/styles.css` - CSS styling with CSS custom properties, animations, and responsive design

## Architecture

The application uses vanilla HTML/CSS/JavaScript with no build process or dependencies. Key architectural patterns:

- **Dual Clock System**: Supports both local time and secondary timezone display with smooth layout transitions
- **Theme System**: Uses CSS custom properties (`:root` variables) with `.dark-mode` class and system preference detection
- **Responsive Sizing**: Proportional scaling system using CSS variables for clock, labels, dates, and AM/PM indicators
- **State Management**: All preferences persisted in `localStorage` (theme, size, timezone, system preferences)
- **Animation System**: CSS transitions with cubic-bezier easing for smooth user experience
- **Time Updates**: Uses `setInterval()` with timezone-aware formatting via `Intl.DateTimeFormat`

## Major Features Implemented

### Timezone Management
- 55+ world timezones ordered by UTC offset (-11 to +14)
- Smooth add/remove animations with proper state transitions
- Pre-populated content to eliminate loading delays
- IANA timezone identifiers with automatic DST handling

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
│   ├── index.html     # Main application
│   ├── styles.css     # All styling and themes  
│   └── script.js      # Application logic
├── README.md          # User documentation
└── CLAUDE.md          # This development guide
```

### Running Locally
- Open `html/index.html` directly in a browser or serve via any static file server
- No build/lint/test commands - this is a simple static site with no tooling setup
- Test in multiple browsers and verify all features work with system preferences

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