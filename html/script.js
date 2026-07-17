/**
 * Clock Application - Main JavaScript (DOM wiring)
 *
 * This module wires the DOM to the pure formatting helpers in clock-core.js
 * and the timezone data in timezones.js. It handles:
 * - Local time display with 12-hour format
 * - Optional second timezone display
 * - Dark/light theme support with system preference detection
 * - Responsive sizing (small, medium, large)
 * - Smooth animations and transitions
 *
 * All settings are persisted in localStorage (via the safe-storage helper)
 * for user preferences.
 */

import { timeZones } from './timezones.js';
import { formatClockParts, formatDateString, getOffsetLabel } from './clock-core.js';

/* ============================================================================
 * SAFE STORAGE HELPER
 * ----------------------------------------------------------------------------
 * Some browsers (notably private-browsing modes) throw when localStorage is
 * accessed. Wrap every access in try/catch so the clock keeps working even if
 * persistence is unavailable.
 * ==========================================================================*/
const storage = {
    get(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            /* ignore write failures (e.g. private mode / quota) */
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            /* ignore */
        }
    }
};

/* ============================================================================
 * DOM ELEMENT REFERENCES (cached once at module load)
 * ==========================================================================*/

// Theme control elements
const toggleButton = document.getElementById('toggle');
const systemThemeToggle = document.getElementById('systemThemeToggle');
const html = document.documentElement;

// Size control elements
const sizeButtons = document.querySelectorAll('.size-button');

// Timezone control elements
const addTimezoneButton = document.getElementById('add-timezone');
const timezoneDropdown = document.getElementById('timezone-dropdown');

// Clock layout / label elements
const clockContainer = document.querySelector('.clock-container');
const localClockLabel = document.querySelector('.local-clock .clock-label');
const timezoneClockContainer = document.querySelector('.timezone-clock');
const timezoneLabel = document.getElementById('timezone-label');
const localAmpmEl = document.querySelector('.local-clock .ampm-indicator');
const timezoneAmpmEl = document.querySelector('.timezone-clock .ampm-indicator');

/**
 * Build the static time-display markup once and return references to the
 * mutable text nodes. Structure (matching the original markup semantics):
 *
 *   <span class="time-numbers">
 *     <span class="hour-minute">H:MM:</span>
 *     <span class="seconds">SS</span>
 *   </span>
 *
 * Per tick we update only `hourMinute.textContent` and `seconds.textContent`
 * (no innerHTML, no querySelector), which avoids re-parsing markup each second.
 *
 * @param {HTMLElement} container - The .time-display element to populate
 * @returns {{hourMinute: HTMLElement, seconds: HTMLElement}}
 */
function buildTimeDisplay(container) {
    const wrapper = document.createElement('span');
    wrapper.className = 'time-numbers';

    const hourMinute = document.createElement('span');
    hourMinute.className = 'hour-minute';

    const seconds = document.createElement('span');
    seconds.className = 'seconds';

    wrapper.appendChild(hourMinute);
    wrapper.appendChild(seconds);
    container.appendChild(wrapper);

    return { hourMinute, seconds };
}

// Build both clocks' displays once and cache the text-node references.
const localDisplay = buildTimeDisplay(document.getElementById('time'));
const localDateEl = document.getElementById('date');
const timezoneDisplay = buildTimeDisplay(document.getElementById('timezone-time'));
const timezoneDateEl = document.getElementById('timezone-date');

/* ============================================================================
 * APPLICATION STATE
 * ==========================================================================*/

// Explicit state for the currently shown second timezone (null while the
// second clock is hidden), replacing the previous checks against button label
// text. Kept in memory rather than re-read from localStorage each tick, so the
// second clock keeps updating even when storage is unavailable.
let activeTimezone = null;

/* ============================================================================
 * TIME RENDERING
 * ==========================================================================*/

/**
 * Render the given clock's time and date using cached DOM references.
 * @param {{hourMinute: HTMLElement, seconds: HTMLElement}} display
 * @param {HTMLElement} dateEl - Date display element
 * @param {HTMLElement|null} ampmEl - AM/PM indicator element
 * @param {Date} now - Current instant
 * @param {string} [timeZone] - IANA id; omit/undefined for local time
 */
function renderClock(display, dateEl, ampmEl, now, timeZone) {
    const { hours, minutes, seconds, ampm } = formatClockParts(now, timeZone);

    display.hourMinute.textContent = `${hours}:${minutes}:`;
    display.seconds.textContent = seconds;
    dateEl.textContent = formatDateString(now, timeZone);
    if (ampmEl) ampmEl.textContent = ampm;
}

/**
 * Update the timezone clock for the given timezone.
 * @param {string} timezone - IANA timezone identifier
 */
function updateTimezoneTime(timezone) {
    if (!timezone) return;
    renderClock(timezoneDisplay, timezoneDateEl, timezoneAmpmEl, new Date(), timezone);
}

/**
 * Main time update - renders the local clock, plus the timezone clock when
 * it is visible. Skips timezone formatting entirely while it is hidden.
 */
function updateTime() {
    const now = new Date();

    // Local time uses the default (undefined timeZone) formatter.
    renderClock(localDisplay, localDateEl, localAmpmEl, now, undefined);

    // Only spend cycles on the second clock when it is actually shown.
    if (activeTimezone) {
        renderClock(timezoneDisplay, timezoneDateEl, timezoneAmpmEl, now, activeTimezone);
    }
}

/* ============================================================================
 * SAVED PREFERENCES
 * ==========================================================================*/
const systemThemeEnabled = storage.get('systemThemeEnabled') === 'true';
const savedClockSize = storage.get('clockSize') || 'small';
const savedTimezone = storage.get('selectedTimezone');

/* ============================================================================
 * THEME
 * ==========================================================================*/

// Apply the active theme based on the system-preference toggle / saved choice.
function applyTheme() {
    const isSystemThemeEnabled = systemThemeToggle.checked;
    const isDarkMode = isSystemThemeEnabled
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : storage.get('darkMode') === 'true';

    html.classList.toggle('dark-mode', isDarkMode);
    toggleButton.textContent = isDarkMode
        ? '☀️ Switch to Light Mode'
        : '🌙 Switch to Dark Mode';
}

// Update UI based on the system-preference checkbox state.
function updateUI() {
    const isSystemThemeEnabled = systemThemeToggle.checked;
    storage.set('systemThemeEnabled', isSystemThemeEnabled);

    toggleButton.disabled = isSystemThemeEnabled;
    applyTheme();
}

/* ============================================================================
 * CLOCK SIZE
 * ==========================================================================*/
function setClockSize(size, animate = false) {
    const timeElements = document.querySelectorAll('.time-display');

    if (animate) {
        timeElements.forEach(el => el.classList.add('animate-resize'));
    }

    // Set proportional sizes for all elements
    const sizeMultipliers = {
        small: { clock: '5rem', label: '1.2rem', date: '1.2rem', ampm: '2rem', offset: '10px' },
        medium: { clock: '8rem', label: '1.9rem', date: '1.9rem', ampm: '3.2rem', offset: '15px' },
        large: { clock: '12rem', label: '2.9rem', date: '2.9rem', ampm: '4.8rem', offset: '20px' }
    };

    const sizes = sizeMultipliers[size];
    html.style.setProperty('--clock-size', sizes.clock);
    html.style.setProperty('--label-size', sizes.label);
    html.style.setProperty('--date-size', sizes.date);
    html.style.setProperty('--ampm-size', sizes.ampm);
    html.style.setProperty('--ampm-offset', sizes.offset);

    storage.set('clockSize', size);

    sizeButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.size === size);
    });
}

/* ============================================================================
 * TIMEZONE CONTROLS
 * ==========================================================================*/

// Populate the dropdown with "City (UTC+X)" labels computed at load time.
function populateTimezoneDropdown() {
    timeZones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.value;
        option.textContent = `${tz.city} (${getOffsetLabel(tz.value)})`;
        timezoneDropdown.appendChild(option);
    });
}

function showTimezoneMode(timezone) {
    // Update timezone label (just the city name) FIRST (before animation).
    const selectedTz = timeZones.find(tz => tz.value === timezone);
    if (selectedTz) {
        timezoneLabel.textContent = selectedTz.city;
    }

    // Pre-populate the timezone time content so there is no empty-content
    // flash when the clock is revealed.
    activeTimezone = timezone;
    updateTimezoneTime(timezone);

    // Force a layout update before starting the animation.
    timezoneClockContainer.offsetHeight;

    // Switch to dual clock layout.
    clockContainer.classList.remove('single-clock');
    clockContainer.classList.add('dual-clock');

    // Show local time label and the timezone clock.
    localClockLabel.classList.remove('hidden');
    timezoneClockContainer.classList.remove('hidden');

    // Hide dropdown and mark the button as a "remove" action.
    timezoneDropdown.classList.add('hidden');
    addTimezoneButton.textContent = 'Remove Second Time Zone';

    // Save selection.
    storage.set('selectedTimezone', timezone);
}

function hideTimezoneMode() {
    activeTimezone = null;

    // Switch back to single clock layout.
    clockContainer.classList.remove('dual-clock');
    clockContainer.classList.add('single-clock');

    // Hide local time label and the timezone clock.
    localClockLabel.classList.add('hidden');
    timezoneClockContainer.classList.add('hidden');

    // Reset button text.
    addTimezoneButton.textContent = 'Add Time Zone';

    // Clear selection.
    storage.remove('selectedTimezone');
    timezoneDropdown.value = '';
}

/* ============================================================================
 * INITIAL SETUP
 * ==========================================================================*/
systemThemeToggle.checked = systemThemeEnabled;
setClockSize(savedClockSize);
populateTimezoneDropdown();

// Pre-populate the timezone clock with a default timezone to avoid empty
// content the first time it is revealed. (Rendered but kept hidden via CSS.)
updateTimezoneTime(timeZones[0].value);

// Set initial layout state.
if (savedTimezone) {
    showTimezoneMode(savedTimezone);
} else {
    clockContainer.classList.add('single-clock');
}

updateUI();

/* ============================================================================
 * EVENT LISTENERS
 * ==========================================================================*/

// System-preference checkbox changes.
systemThemeToggle.addEventListener('change', updateUI);

// Size button clicks.
sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        setClockSize(button.dataset.size, true);
    });
});

// Add / remove / cancel timezone controls.
addTimezoneButton.addEventListener('click', () => {
    if (activeTimezone) {
        // Currently showing a second timezone -> remove it.
        hideTimezoneMode();
    } else if (timezoneDropdown.classList.contains('hidden')) {
        // Reveal the dropdown to pick a timezone.
        timezoneDropdown.classList.remove('hidden');
        addTimezoneButton.textContent = 'Cancel';
    } else {
        // Cancel: hide the dropdown and revert the button text.
        timezoneDropdown.classList.add('hidden');
        addTimezoneButton.textContent = 'Add Time Zone';
    }
});

// Timezone selection from the dropdown.
timezoneDropdown.addEventListener('change', (e) => {
    if (e.target.value) {
        showTimezoneMode(e.target.value);
    }
});

// Manual dark/light toggle.
toggleButton.addEventListener('click', () => {
    const isCurrentlyDark = html.classList.toggle('dark-mode');
    storage.set('darkMode', isCurrentlyDark);
    toggleButton.textContent = isCurrentlyDark
        ? '☀️ Switch to Light Mode'
        : '🌙 Switch to Dark Mode';
});

// React to OS theme changes while "follow system" is enabled.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (systemThemeToggle.checked) {
        applyTheme();
    }
});

/* ============================================================================
 * DRIFT-FREE TICKING
 * ----------------------------------------------------------------------------
 * Instead of setInterval(updateTime, 1000) - which drifts and can skip/repeat
 * seconds - schedule each tick aligned to the next real-time second boundary.
 * ==========================================================================*/
function scheduleTick() {
    const now = new Date();
    const delay = 1000 - now.getMilliseconds();
    setTimeout(() => {
        updateTime();
        scheduleTick();
    }, delay);
}

// Render immediately, then begin the aligned tick loop.
updateTime();
scheduleTick();
