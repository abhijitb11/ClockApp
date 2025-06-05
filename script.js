function updateTime() {
    const now = new Date();

    // Local time
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const timeString = `<span class="time-numbers">${hours}:${minutes}:<span class="seconds">${seconds}</span></span>`;

    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);

    document.getElementById('time').innerHTML = timeString;
    document.getElementById('date').textContent = dateString;
    
    // Update AM/PM indicator for local time
    const localAmpmEl = document.querySelector('.local-clock .ampm-indicator');
    if (localAmpmEl) localAmpmEl.textContent = ampm;

    // Always update timezone time if we have a selected timezone
    const selectedTimezone = localStorage.getItem('selectedTimezone');
    const currentTimezone = getCurrentTimezone();
    updateTimezoneTime(selectedTimezone || currentTimezone);
}

function getCurrentTimezone() {
    // Get the currently displayed timezone from dropdown or default
    const dropdown = document.getElementById('timezone-dropdown');
    return dropdown && dropdown.value ? dropdown.value : timeZones[0].value;
}

function updateTimezoneTime(timezone) {
    if (!timezone) return;
    
    const now = new Date();
    
    const timeOptions = { 
        timeZone: timezone,
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const dateOptions = { 
        timeZone: timezone,
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    };
    
    let timezoneTimeString = now.toLocaleTimeString('en-US', timeOptions);
    const timezoneDateString = now.toLocaleDateString('en-US', dateOptions);
    
    // Extract AM/PM and add span around seconds for styling
    const ampmMatch = timezoneTimeString.match(/\s([AP]M)/);
    const ampmPart = ampmMatch ? ampmMatch[1] : '';
    timezoneTimeString = timezoneTimeString.replace(/(\d{1,2}:\d{2}):(\d{2})\s[AP]M/, '<span class="time-numbers">$1:<span class="seconds">$2</span></span>');
    
    const timezoneTimeEl = document.getElementById('timezone-time');
    const timezoneDateEl = document.getElementById('timezone-date');
    const timezoneAmpmEl = document.querySelector('.timezone-clock .ampm-indicator');
    
    if (timezoneTimeEl) timezoneTimeEl.innerHTML = timezoneTimeString;
    if (timezoneDateEl) timezoneDateEl.textContent = timezoneDateString;
    if (timezoneAmpmEl) timezoneAmpmEl.textContent = ampmPart;
}

// Dark mode toggle
const toggleButton = document.getElementById('toggle');
const systemThemeToggle = document.getElementById('systemThemeToggle');
const html = document.documentElement;

// Clock size controls
const sizeButtons = document.querySelectorAll('.size-button');
const clockSizeMap = {
    small: '5rem',
    medium: '8rem',
    large: '12rem'
};

// Timezone controls
const addTimezoneButton = document.getElementById('add-timezone');
const timezoneDropdown = document.getElementById('timezone-dropdown');
const timeZones = [
    { value: 'Pacific/Midway', label: 'Midway (UTC-11)' },
    { value: 'Pacific/Honolulu', label: 'Honolulu (UTC-10)' },
    { value: 'America/Anchorage', label: 'Anchorage (UTC-9)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8)' },
    { value: 'America/Vancouver', label: 'Vancouver (UTC-8)' },
    { value: 'America/Denver', label: 'Denver (UTC-7)' },
    { value: 'America/Phoenix', label: 'Phoenix (UTC-7)' },
    { value: 'America/Chicago', label: 'Chicago (UTC-6)' },
    { value: 'America/Mexico_City', label: 'Mexico City (UTC-6)' },
    { value: 'America/New_York', label: 'New York (UTC-5)' },
    { value: 'America/Toronto', label: 'Toronto (UTC-5)' },
    { value: 'America/Caracas', label: 'Caracas (UTC-4)' },
    { value: 'America/Santiago', label: 'Santiago (UTC-4)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (UTC-3)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (UTC-3)' },
    { value: 'Atlantic/South_Georgia', label: 'South Georgia (UTC-2)' },
    { value: 'Atlantic/Azores', label: 'Azores (UTC-1)' },
    { value: 'Europe/London', label: 'London (UTC+0)' },
    { value: 'Africa/Casablanca', label: 'Casablanca (UTC+0)' },
    { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
    { value: 'Europe/Berlin', label: 'Berlin (UTC+1)' },
    { value: 'Europe/Rome', label: 'Rome (UTC+1)' },
    { value: 'Africa/Lagos', label: 'Lagos (UTC+1)' },
    { value: 'Europe/Athens', label: 'Athens (UTC+2)' },
    { value: 'Africa/Cairo', label: 'Cairo (UTC+2)' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg (UTC+2)' },
    { value: 'Europe/Moscow', label: 'Moscow (UTC+3)' },
    { value: 'Asia/Riyadh', label: 'Riyadh (UTC+3)' },
    { value: 'Asia/Tehran', label: 'Tehran (UTC+3:30)' },
    { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
    { value: 'Asia/Baku', label: 'Baku (UTC+4)' },
    { value: 'Asia/Kabul', label: 'Kabul (UTC+4:30)' },
    { value: 'Asia/Karachi', label: 'Karachi (UTC+5)' },
    { value: 'Asia/Tashkent', label: 'Tashkent (UTC+5)' },
    { value: 'Asia/Kolkata', label: 'Mumbai (UTC+5:30)' },
    { value: 'Asia/Kathmandu', label: 'Kathmandu (UTC+5:45)' },
    { value: 'Asia/Dhaka', label: 'Dhaka (UTC+6)' },
    { value: 'Asia/Almaty', label: 'Almaty (UTC+6)' },
    { value: 'Asia/Rangoon', label: 'Yangon (UTC+6:30)' },
    { value: 'Asia/Bangkok', label: 'Bangkok (UTC+7)' },
    { value: 'Asia/Jakarta', label: 'Jakarta (UTC+7)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (UTC+8)' },
    { value: 'Asia/Singapore', label: 'Singapore (UTC+8)' },
    { value: 'Asia/Manila', label: 'Manila (UTC+8)' },
    { value: 'Australia/Perth', label: 'Perth (UTC+8)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
    { value: 'Asia/Seoul', label: 'Seoul (UTC+9)' },
    { value: 'Australia/Adelaide', label: 'Adelaide (UTC+9:30)' },
    { value: 'Australia/Sydney', label: 'Sydney (UTC+10)' },
    { value: 'Australia/Brisbane', label: 'Brisbane (UTC+10)' },
    { value: 'Pacific/Guam', label: 'Guam (UTC+10)' },
    { value: 'Australia/Melbourne', label: 'Melbourne (UTC+10)' },
    { value: 'Pacific/Norfolk', label: 'Norfolk Island (UTC+11)' },
    { value: 'Pacific/Auckland', label: 'Auckland (UTC+12)' },
    { value: 'Pacific/Fiji', label: 'Fiji (UTC+12)' },
    { value: 'Pacific/Tongatapu', label: 'Nuku\'alofa (UTC+13)' },
    { value: 'Pacific/Kiritimati', label: 'Kiritimati (UTC+14)' }
];

// Load saved preferences
const savedPreference = localStorage.getItem('darkMode');
const systemThemeEnabled = localStorage.getItem('systemThemeEnabled') === 'true';
const savedClockSize = localStorage.getItem('clockSize') || 'small';
const savedTimezone = localStorage.getItem('selectedTimezone');

// Apply saved theme
function applyTheme() {
    const isSystemThemeEnabled = systemThemeToggle.checked;
    const isDarkMode = isSystemThemeEnabled
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : localStorage.getItem('darkMode') === 'true';

    html.classList.toggle('dark-mode', isDarkMode);
    toggleButton.textContent = isDarkMode
        ? '☀️ Switch to Light Mode'
        : '🌙 Switch to Dark Mode';
}

// Clock size functions
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
    
    localStorage.setItem('clockSize', size);
    
    sizeButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.size === size);
    });
}

// Timezone functions
function populateTimezoneDropdown() {
    timeZones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.value;
        option.textContent = tz.label;
        timezoneDropdown.appendChild(option);
    });
}

function showTimezoneMode(timezone) {
    const localClockLabel = document.querySelector('.local-clock .clock-label');
    const timezoneClockContainer = document.querySelector('.timezone-clock');
    const timezoneLabel = document.getElementById('timezone-label');
    const clockContainer = document.querySelector('.clock-container');
    
    // Update timezone content FIRST (before animation)
    const selectedTz = timeZones.find(tz => tz.value === timezone);
    if (selectedTz) {
        timezoneLabel.textContent = selectedTz.label.split(' (')[0]; // Just the city name
    }
    
    // Immediately update timezone time content
    updateTimezoneTime(timezone);
    
    // Force a layout update before starting animation
    timezoneClockContainer.offsetHeight;
    
    // Switch to dual clock layout
    clockContainer.classList.remove('single-clock');
    clockContainer.classList.add('dual-clock');
    
    // Show local time label
    localClockLabel.classList.remove('hidden');
    
    // Show timezone clock
    timezoneClockContainer.classList.remove('hidden');
    
    // Hide dropdown and show it was selected
    timezoneDropdown.classList.add('hidden');
    addTimezoneButton.textContent = 'Remove Second Time Zone';
    
    // Save selection
    localStorage.setItem('selectedTimezone', timezone);
}

function hideTimezoneMode() {
    const localClockLabel = document.querySelector('.local-clock .clock-label');
    const timezoneClockContainer = document.querySelector('.timezone-clock');
    const clockContainer = document.querySelector('.clock-container');
    
    // Switch back to single clock layout
    clockContainer.classList.remove('dual-clock');
    clockContainer.classList.add('single-clock');
    
    // Hide local time label
    localClockLabel.classList.add('hidden');
    
    // Hide timezone clock
    timezoneClockContainer.classList.add('hidden');
    
    // Reset button text
    addTimezoneButton.textContent = 'Add Time Zone';
    
    // Clear selection
    localStorage.removeItem('selectedTimezone');
    timezoneDropdown.value = '';
}

// Update UI based on checkbox state
function updateUI() {
    const isSystemThemeEnabled = systemThemeToggle.checked;
    localStorage.setItem('systemThemeEnabled', isSystemThemeEnabled);
    
    toggleButton.disabled = isSystemThemeEnabled;
    applyTheme();
}

// Initial setup
systemThemeToggle.checked = systemThemeEnabled;
setClockSize(savedClockSize);
populateTimezoneDropdown();

// Pre-populate timezone clock with default timezone to avoid empty content
const defaultTimezone = timeZones[0].value;
updateTimezoneTime(defaultTimezone);

// Set initial layout state
const clockContainer = document.querySelector('.clock-container');
if (savedTimezone) {
    showTimezoneMode(savedTimezone);
} else {
    clockContainer.classList.add('single-clock');
}

updateUI();

// Handle checkbox changes
systemThemeToggle.addEventListener('change', updateUI);

// Handle size button clicks
sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        setClockSize(button.dataset.size, true);
    });
});

// Handle timezone controls
addTimezoneButton.addEventListener('click', () => {
    const hasTimezone = localStorage.getItem('selectedTimezone');
    
    if (hasTimezone && addTimezoneButton.textContent === 'Remove Second Time Zone') {
        // Remove timezone mode
        hideTimezoneMode();
    } else if (timezoneDropdown.classList.contains('hidden')) {
        // Show dropdown
        timezoneDropdown.classList.remove('hidden');
        addTimezoneButton.textContent = 'Cancel';
    } else {
        // Hide dropdown and revert button text
        timezoneDropdown.classList.add('hidden');
        addTimezoneButton.textContent = hasTimezone ? 'Remove Second Time Zone' : 'Add Time Zone';
    }
});

timezoneDropdown.addEventListener('change', (e) => {
    if (e.target.value) {
        showTimezoneMode(e.target.value);
    }
});

// Handle toggle changes
toggleButton.addEventListener('click', () => {
    const isCurrentlyDark = html.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isCurrentlyDark);
    toggleButton.textContent = isCurrentlyDark
        ? '☀️ Switch to Light Mode'
        : '🌙 Switch to Dark Mode';
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (systemThemeToggle.checked) {
        applyTheme();
    }
});

// Initialize clock
setInterval(updateTime, 1000);
updateTime();