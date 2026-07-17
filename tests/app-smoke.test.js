// @vitest-environment jsdom
/**
 * DOM smoke tests for the application wiring in script.js.
 *
 * Runs the real module against a jsdom copy of the index.html markup and
 * exercises the main user flows end-to-end: initial render, ticking,
 * adding/removing a second timezone, theme toggling, and resizing.
 *
 * Fake timers are installed BEFORE the module is imported so its
 * initial render and tick scheduling run against a controlled clock.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

// The parts of html/index.html that script.js wires up (keep in sync).
const APP_MARKUP = `
    <header class="theme-controls">
        <button id="toggle" class="toggle-button">🌙 Switch to Dark Mode</button>
        <label class="system-theme-label">
            <input type="checkbox" id="systemThemeToggle" />
            Follow System Preferences
        </label>
    </header>
    <div class="timezone-controls">
        <button id="add-timezone" class="timezone-button">Add Time Zone</button>
        <select id="timezone-dropdown" class="timezone-dropdown hidden" aria-label="Select a time zone">
            <option value="">Select a time zone</option>
        </select>
    </div>
    <aside class="size-controls">
        <div class="size-buttons">
            <button id="size-small" class="size-button active" data-size="small">Small</button>
            <button id="size-medium" class="size-button" data-size="medium">Medium</button>
            <button id="size-large" class="size-button" data-size="large">Large</button>
        </div>
    </aside>
    <main class="clock-container">
        <div class="clock local-clock">
            <div class="clock-label hidden">Local Time</div>
            <div id="time" class="time-display"></div>
            <div id="date" class="date-display"></div>
            <div class="ampm-indicator">AM</div>
        </div>
        <div class="clock timezone-clock hidden">
            <div class="clock-label" id="timezone-label">New York</div>
            <div id="timezone-time" class="time-display"></div>
            <div id="timezone-date" class="date-display"></div>
            <div class="ampm-indicator">AM</div>
        </div>
    </main>
`;

beforeAll(async () => {
    // This jsdom environment exposes localStorage as a bare object without
    // the Storage methods, so install a functional Map-backed stub that both
    // the app module and the assertions below share.
    const backing = new Map();
    vi.stubGlobal('localStorage', {
        getItem: key => (backing.has(key) ? backing.get(key) : null),
        setItem: (key, value) => backing.set(key, String(value)),
        removeItem: key => backing.delete(key),
        clear: () => backing.clear()
    });

    // jsdom has no matchMedia; script.js uses it for system-theme detection.
    window.matchMedia = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
    });

    document.body.innerHTML = APP_MARKUP;

    // Freeze time (at an exact second boundary) before the module's initial
    // render and setTimeout-based tick scheduling run.
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 15, 10, 30, 45, 0));

    await import('../html/script.js');
});

afterAll(() => {
    vi.useRealTimers();
});

describe('initial render', () => {
    it('renders the local time as H:MM: + SS static spans', () => {
        const hourMinute = document.querySelector('#time .time-numbers .hour-minute');
        const seconds = document.querySelector('#time .time-numbers .seconds');
        expect(hourMinute.textContent).toMatch(/^\d{1,2}:\d{2}:$/);
        expect(seconds.textContent).toBe('45');
    });

    it('renders a full local date and an AM/PM indicator', () => {
        expect(document.getElementById('date').textContent).toMatch(/\w+, \w+ \d{1,2}, \d{4}/);
        expect(document.querySelector('.local-clock .ampm-indicator').textContent).toMatch(/^(AM|PM)$/);
    });

    it('populates the dropdown with DST-correct "City (UTC±X)" labels', () => {
        const options = [...document.querySelectorAll('#timezone-dropdown option')].slice(1);
        expect(options.length).toBeGreaterThanOrEqual(55);
        for (const option of options) {
            expect(option.textContent).toMatch(/^.+ \(UTC([+-]\d{1,2}(:\d{2})?)?\)$/);
        }
        // July instant: London must show its DST offset, not a stale UTC+0.
        const london = options.find(o => o.value === 'Europe/London');
        expect(london.textContent).toBe('London (UTC+1)');
    });

    it('starts in single-clock mode with the second clock hidden', () => {
        expect(document.querySelector('.clock-container').classList.contains('single-clock')).toBe(true);
        expect(document.querySelector('.timezone-clock').classList.contains('hidden')).toBe(true);
    });
});

describe('ticking', () => {
    it('advances the seconds display on the next aligned tick', () => {
        vi.advanceTimersByTime(1000);
        expect(document.querySelector('#time .seconds').textContent).toBe('46');
    });
});

describe('second timezone flow', () => {
    it('reveals the dropdown when Add Time Zone is clicked', () => {
        document.getElementById('add-timezone').click();
        expect(document.getElementById('timezone-dropdown').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('add-timezone').textContent).toBe('Cancel');
    });

    it('shows the second clock when a timezone is selected', () => {
        const dropdown = document.getElementById('timezone-dropdown');
        dropdown.value = 'Asia/Kolkata';
        dropdown.dispatchEvent(new Event('change', { bubbles: true }));

        expect(document.querySelector('.clock-container').classList.contains('dual-clock')).toBe(true);
        expect(document.querySelector('.timezone-clock').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('timezone-label').textContent).toBe('Mumbai');
        expect(document.querySelector('#timezone-time .hour-minute').textContent).toMatch(/^\d{1,2}:\d{2}:$/);
        expect(localStorage.getItem('selectedTimezone')).toBe('Asia/Kolkata');
    });

    it('keeps the second clock ticking', () => {
        vi.advanceTimersByTime(1000);
        expect(document.querySelector('#timezone-time .seconds').textContent).toBe('47');
    });

    it('removes the second clock and clears the saved selection', () => {
        document.getElementById('add-timezone').click();
        expect(document.querySelector('.clock-container').classList.contains('single-clock')).toBe(true);
        expect(document.querySelector('.timezone-clock').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('add-timezone').textContent).toBe('Add Time Zone');
        expect(localStorage.getItem('selectedTimezone')).toBeNull();
    });
});

describe('theme toggle', () => {
    it('toggles dark mode and persists the choice', () => {
        document.getElementById('toggle').click();
        expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
        expect(localStorage.getItem('darkMode')).toBe('true');
        expect(document.getElementById('toggle').textContent).toContain('Switch to Light Mode');
    });
});

describe('size controls', () => {
    it('applies the medium size variables and active state', () => {
        document.getElementById('size-medium').click();
        expect(document.documentElement.style.getPropertyValue('--clock-size')).toBe('8rem');
        expect(document.getElementById('size-medium').classList.contains('active')).toBe(true);
        expect(document.getElementById('size-small').classList.contains('active')).toBe(false);
        expect(localStorage.getItem('clockSize')).toBe('medium');
    });
});
