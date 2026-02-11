/**
 * Formats a duration string or number of seconds into HH:MM:SS format
 * @param duration - Duration string in HH:MM:SS format or number of seconds
 * @returns Formatted duration string in HH:MM:SS format
 */
export function formatDuration(duration: string | number): string {
  // If duration is already in HH:MM:SS format, return as is
  if (typeof duration === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(duration)) {
    return duration;
  }

  // Convert to seconds if string
  const seconds = typeof duration === 'string' ? parseInt(duration) : duration;
  if (isNaN(seconds)) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a number to a compact representation (e.g., 1000 -> 1k, 1000000 -> 1m)
 * @param value - Number to format
 * @param decimals - Number of decimal places to show (default: 1)
 * @returns Formatted string with k, m, b suffix
 */
export function formatViews(value: number): string {
  if (value === undefined || value === null) return '0';

  if (value === 0) return '0';

  const absValue = Math.abs(value);

  if (absValue < 1000) {
    return value.toString();
  }

  if (absValue < 1000000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }

  if (absValue < 1000000000) {
    return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  }

  return (value / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
}
