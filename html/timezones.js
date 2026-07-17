/**
 * Timezone Database Module
 *
 * Exports the list of selectable world timezones for the clock application.
 * Ordered by approximate UTC offset from UTC-11 to UTC+14.
 *
 * Each entry contains:
 *   - value: IANA timezone identifier (e.g., 'America/New_York')
 *   - city:  Human-friendly city/place name for display
 *
 * NOTE: UTC offsets are intentionally NOT stored here. They are computed at
 * runtime (see getOffsetLabel in clock-core.js) so that the displayed offset
 * is always correct under Daylight Saving Time rather than a stale hardcoded
 * value.
 */
export const timeZones = [
    { value: 'Pacific/Midway', city: 'Midway' },
    { value: 'Pacific/Honolulu', city: 'Honolulu' },
    { value: 'America/Anchorage', city: 'Anchorage' },
    { value: 'America/Los_Angeles', city: 'Los Angeles' },
    { value: 'America/Vancouver', city: 'Vancouver' },
    { value: 'America/Denver', city: 'Denver' },
    { value: 'America/Phoenix', city: 'Phoenix' },
    { value: 'America/Chicago', city: 'Chicago' },
    { value: 'America/Mexico_City', city: 'Mexico City' },
    { value: 'America/New_York', city: 'New York' },
    { value: 'America/Toronto', city: 'Toronto' },
    { value: 'America/Caracas', city: 'Caracas' },
    { value: 'America/Santiago', city: 'Santiago' },
    { value: 'America/Sao_Paulo', city: 'São Paulo' },
    { value: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires' },
    { value: 'Atlantic/South_Georgia', city: 'South Georgia' },
    { value: 'Atlantic/Azores', city: 'Azores' },
    { value: 'Europe/London', city: 'London' },
    { value: 'Africa/Casablanca', city: 'Casablanca' },
    { value: 'Europe/Paris', city: 'Paris' },
    { value: 'Europe/Berlin', city: 'Berlin' },
    { value: 'Europe/Rome', city: 'Rome' },
    { value: 'Africa/Lagos', city: 'Lagos' },
    { value: 'Europe/Athens', city: 'Athens' },
    { value: 'Africa/Cairo', city: 'Cairo' },
    { value: 'Africa/Johannesburg', city: 'Johannesburg' },
    { value: 'Europe/Moscow', city: 'Moscow' },
    { value: 'Asia/Riyadh', city: 'Riyadh' },
    { value: 'Asia/Tehran', city: 'Tehran' },
    { value: 'Asia/Dubai', city: 'Dubai' },
    { value: 'Asia/Baku', city: 'Baku' },
    { value: 'Asia/Kabul', city: 'Kabul' },
    { value: 'Asia/Karachi', city: 'Karachi' },
    { value: 'Asia/Tashkent', city: 'Tashkent' },
    { value: 'Asia/Kolkata', city: 'Mumbai' },
    { value: 'Asia/Kathmandu', city: 'Kathmandu' },
    { value: 'Asia/Dhaka', city: 'Dhaka' },
    { value: 'Asia/Almaty', city: 'Almaty' },
    // Fixed: 'Asia/Rangoon' is a deprecated alias for 'Asia/Yangon'.
    { value: 'Asia/Yangon', city: 'Yangon' },
    { value: 'Asia/Bangkok', city: 'Bangkok' },
    { value: 'Asia/Jakarta', city: 'Jakarta' },
    { value: 'Asia/Shanghai', city: 'Shanghai' },
    { value: 'Asia/Singapore', city: 'Singapore' },
    { value: 'Asia/Manila', city: 'Manila' },
    { value: 'Australia/Perth', city: 'Perth' },
    { value: 'Asia/Tokyo', city: 'Tokyo' },
    { value: 'Asia/Seoul', city: 'Seoul' },
    { value: 'Australia/Adelaide', city: 'Adelaide' },
    { value: 'Australia/Sydney', city: 'Sydney' },
    { value: 'Australia/Brisbane', city: 'Brisbane' },
    { value: 'Pacific/Guam', city: 'Guam' },
    { value: 'Australia/Melbourne', city: 'Melbourne' },
    { value: 'Pacific/Norfolk', city: 'Norfolk Island' },
    { value: 'Pacific/Auckland', city: 'Auckland' },
    { value: 'Pacific/Fiji', city: 'Fiji' },
    { value: 'Pacific/Tongatapu', city: 'Nuku\'alofa' },
    { value: 'Pacific/Kiritimati', city: 'Kiritimati' }
];
