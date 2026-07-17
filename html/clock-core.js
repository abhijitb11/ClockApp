/**
 * Clock Core Module
 *
 * Pure, DOM-free helpers for formatting time, dates, and UTC offset labels.
 * These functions are deterministic given a Date (and timezone) and are the
 * unit-tested heart of the application.
 *
 * All formatting goes through the Intl API. Because constructing an
 * Intl.DateTimeFormat is comparatively expensive and the clock formats time
 * once per second, formatter instances are cached per (timeZone + purpose)
 * key in the maps below.
 */

// Cache of Intl.DateTimeFormat instances keyed by timezone, so we don't
// rebuild a formatter on every tick. `undefined` (local time) is stored under
// a dedicated key.
const LOCAL_KEY = '__local__';
const timeFormatters = new Map();
const dateFormatters = new Map();
const offsetFormatters = new Map();

/**
 * Get (or lazily create and cache) a time formatter for the given timezone.
 * @param {string|undefined} timeZone - IANA id, or undefined for local time
 * @returns {Intl.DateTimeFormat}
 */
function getTimeFormatter(timeZone) {
    const key = timeZone || LOCAL_KEY;
    let formatter = timeFormatters.get(key);
    if (!formatter) {
        formatter = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',     // No leading zero for hours (12-hour)
            minute: '2-digit',   // Always 2 digits
            second: '2-digit',   // Always 2 digits
            hour12: true,
            ...(timeZone ? { timeZone } : {})
        });
        timeFormatters.set(key, formatter);
    }
    return formatter;
}

/**
 * Get (or lazily create and cache) a date formatter for the given timezone.
 * @param {string|undefined} timeZone - IANA id, or undefined for local time
 * @returns {Intl.DateTimeFormat}
 */
function getDateFormatter(timeZone) {
    const key = timeZone || LOCAL_KEY;
    let formatter = dateFormatters.get(key);
    if (!formatter) {
        formatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            ...(timeZone ? { timeZone } : {})
        });
        dateFormatters.set(key, formatter);
    }
    return formatter;
}

/**
 * Get (or lazily create and cache) a short-offset formatter for a timezone.
 * @param {string} timeZone - IANA id
 * @returns {Intl.DateTimeFormat}
 */
function getOffsetFormatter(timeZone) {
    let formatter = offsetFormatters.get(timeZone);
    if (!formatter) {
        formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'shortOffset'
        });
        offsetFormatters.set(timeZone, formatter);
    }
    return formatter;
}

/**
 * Format a Date into 12-hour clock parts for the given timezone.
 *
 * Uses a single Intl.DateTimeFormat.formatToParts() pass, replacing both the
 * old manual local-time math and the regex parsing of toLocaleTimeString.
 *
 * @param {Date} date - The instant to format
 * @param {string} [timeZone] - IANA id; omit/undefined for local time
 * @returns {{hours: string, minutes: string, seconds: string, ampm: string}}
 */
export function formatClockParts(date, timeZone) {
    const parts = getTimeFormatter(timeZone).formatToParts(date);

    let hours = '';
    let minutes = '';
    let seconds = '';
    let ampm = '';

    for (const part of parts) {
        switch (part.type) {
            case 'hour':
                hours = part.value;
                break;
            case 'minute':
                minutes = part.value;
                break;
            case 'second':
                seconds = part.value;
                break;
            case 'dayPeriod':
                // Normalize to uppercase "AM"/"PM"
                ampm = part.value.toUpperCase();
                break;
        }
    }

    return { hours, minutes, seconds, ampm };
}

/**
 * Format a Date into a "Weekday, Month Day, Year" string for the timezone.
 * @param {Date} date - The instant to format
 * @param {string} [timeZone] - IANA id; omit/undefined for local time
 * @returns {string}
 */
export function formatDateString(date, timeZone) {
    return getDateFormatter(timeZone).format(date);
}

/**
 * Compute a DST-correct UTC offset label for a timezone at a given instant.
 *
 * Reads the 'shortOffset' timeZoneName part (e.g. "GMT+1", "GMT+5:30",
 * or "GMT" for zero offset) and normalizes "GMT" to "UTC". A bare "GMT"
 * (no numeric offset) means UTC+0 and is returned as "UTC".
 *
 * @param {string} timeZone - IANA id
 * @param {Date} [date=new Date()] - Instant at which to evaluate the offset
 * @returns {string} e.g. "UTC", "UTC+1", "UTC-7", "UTC+5:30"
 */
export function getOffsetLabel(timeZone, date = new Date()) {
    const parts = getOffsetFormatter(timeZone).formatToParts(date);
    const namePart = parts.find(part => part.type === 'timeZoneName');
    const raw = namePart ? namePart.value : 'GMT';

    // Normalize "GMT" -> "UTC". A bare "GMT" (zero offset) becomes "UTC".
    return raw.replace('GMT', 'UTC');
}
