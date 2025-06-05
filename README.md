# Clock App

A modern, responsive web-based clock application with dual timezone support, multiple themes, and customizable sizing.

## Features

### 🕐 Time Display
- **12-hour format** with AM/PM indicators
- **Real-time updates** every second
- **Date display** in "Weekday, Month Day, Year" format
- **De-emphasized seconds** for better visual hierarchy

### 🌍 Timezone Support
- **Dual timezone display** - view local time alongside any world timezone
- **55+ major cities** covering all UTC offsets from UTC-11 to UTC+14
- **Smooth animations** when adding/removing second timezone
- **Reversible operation** - easily switch between single and dual clock modes

### 🎨 Theme Options
- **Dark/Light mode toggle** with manual control
- **System preference detection** - automatically follow OS theme settings
- **Smooth transitions** between themes
- **Persistent preferences** saved in browser storage

### 📏 Responsive Sizing
- **Three size options**: Small (5rem), Medium (8rem), Large (12rem)
- **Proportional scaling** of all elements including labels and dates
- **Smooth resize animations** with fixed AM/PM positioning
- **Size preferences** saved across sessions

### ⚡ Performance & UX
- **Lightweight** - pure HTML/CSS/JavaScript with no frameworks
- **Smooth animations** using CSS transitions and cubic-bezier easing
- **Pre-populated content** to eliminate loading delays
- **Keyboard accessible** with proper focus management

## Usage

### Getting Started
1. Open `html/index.html` in any modern web browser
2. The clock will immediately display your local time
3. Use the controls to customize your experience

### Adding a Second Timezone
1. Click **"Add Time Zone"** in the top-left corner
2. Select your desired timezone from the dropdown
3. The second clock will appear below with smooth animation
4. Click **"Remove Second Time Zone"** to return to single clock mode

### Theme Controls (Top-Right)
- **Toggle Button**: Manually switch between dark and light themes
- **System Preferences**: Check to automatically follow your OS theme settings
  - When enabled, the manual toggle is disabled
  - Theme will change automatically when you switch your system theme

### Size Controls (Right Side)
- **Small**: Compact 5rem clock display
- **Medium**: Balanced 8rem clock display  
- **Large**: Prominent 12rem clock display
- All text elements scale proportionally

## Technical Details

### Browser Compatibility
- Modern browsers with ES6+ support
- Uses CSS custom properties (CSS variables)
- Requires JavaScript for time updates and interactivity

### Data Storage
All preferences are automatically saved to `localStorage`:
- Selected clock size
- Theme preference (dark/light)
- System theme setting
- Selected timezone

### Files Structure
```
clockapp/
├── html/
│   ├── index.html     # Main application
│   ├── styles.css     # All styling and themes
│   └── script.js      # Application logic
├── README.md          # This documentation
└── CLAUDE.md          # Development notes
```

### Timezone Support
Uses JavaScript's built-in `Intl.DateTimeFormat` API with IANA timezone identifiers for accurate timezone conversion and daylight saving time handling.

## Development

The application uses a clean, documented codebase with:
- **Comprehensive comments** explaining functionality
- **CSS custom properties** for consistent theming
- **Modular JavaScript** with clear function separation
- **Semantic HTML** structure

To modify or extend the application, see the inline documentation throughout the source files and consult `CLAUDE.md` for development guidelines.