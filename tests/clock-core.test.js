/**
 * Unit tests for the pure clock-core and timezones modules.
 *
 * All time-based assertions use fixed Date objects with an explicit 'UTC'
 * timeZone so results are independent of the machine's local timezone.
 */
import { describe, it, expect } from 'vitest';
import { formatClockParts, formatDateString, getOffsetLabel } from '../html/clock-core.js';
import { timeZones } from '../html/timezones.js';

describe('formatClockParts', () => {
    it('formats midnight as 12 AM', () => {
        // 2026-07-15T00:00:00Z
        const date = new Date(Date.UTC(2026, 6, 15, 0, 0, 0));
        const parts = formatClockParts(date, 'UTC');
        expect(parts.hours).toBe('12');
        expect(parts.minutes).toBe('00');
        expect(parts.seconds).toBe('00');
        expect(parts.ampm).toBe('AM');
    });

    it('formats noon as 12 PM', () => {
        // 2026-07-15T12:00:00Z
        const date = new Date(Date.UTC(2026, 6, 15, 12, 0, 0));
        const parts = formatClockParts(date, 'UTC');
        expect(parts.hours).toBe('12');
        expect(parts.ampm).toBe('PM');
    });

    it('formats 23:05:07 as 11 PM with zero-padded minutes/seconds', () => {
        // 2026-07-15T23:05:07Z
        const date = new Date(Date.UTC(2026, 6, 15, 23, 5, 7));
        const parts = formatClockParts(date, 'UTC');
        expect(parts.hours).toBe('11');
        expect(parts.minutes).toBe('05');
        expect(parts.seconds).toBe('07');
        expect(parts.ampm).toBe('PM');
    });
});

describe('formatDateString', () => {
    it('formats a full weekday/month/day/year string', () => {
        const date = new Date(Date.UTC(2026, 6, 15, 12, 0, 0));
        expect(formatDateString(date, 'UTC')).toBe('Wednesday, July 15, 2026');
    });
});

describe('getOffsetLabel', () => {
    const winter = new Date(Date.UTC(2026, 0, 15, 12, 0, 0)); // 2026-01-15
    const summer = new Date(Date.UTC(2026, 6, 15, 12, 0, 0)); // 2026-07-15

    it('returns UTC+0 for London in winter (no DST)', () => {
        // This runtime's ICU emits "GMT+0" for a zero offset, which normalizes
        // to "UTC+0". (The task permits either "UTC" or "UTC+0" here.)
        expect(getOffsetLabel('Europe/London', winter)).toBe('UTC+0');
    });

    it('returns UTC+1 for London in summer (BST/DST)', () => {
        expect(getOffsetLabel('Europe/London', summer)).toBe('UTC+1');
    });

    it('returns UTC-7 for Phoenix in both winter and summer (no DST)', () => {
        expect(getOffsetLabel('America/Phoenix', winter)).toBe('UTC-7');
        expect(getOffsetLabel('America/Phoenix', summer)).toBe('UTC-7');
    });

    it('returns UTC+5:30 for Kolkata', () => {
        expect(getOffsetLabel('Asia/Kolkata', winter)).toBe('UTC+5:30');
        expect(getOffsetLabel('Asia/Kolkata', summer)).toBe('UTC+5:30');
    });
});

describe('timeZones data', () => {
    it('has entries with valid IANA ids and non-empty city names', () => {
        expect(timeZones.length).toBeGreaterThan(0);
        for (const { value, city } of timeZones) {
            expect(typeof city).toBe('string');
            expect(city.length).toBeGreaterThan(0);
            // A valid IANA id must not throw when used as a timeZone.
            expect(() => new Intl.DateTimeFormat('en-US', { timeZone: value })).not.toThrow();
        }
    });

    it('does not contain the deprecated Asia/Rangoon id', () => {
        expect(timeZones.some(tz => tz.value === 'Asia/Rangoon')).toBe(false);
        expect(timeZones.some(tz => tz.value === 'Asia/Yangon')).toBe(true);
    });
});
