/**
 * Clamps a number to be within a specified range.
 *
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum allowable value
 * @param {number} max - The maximum allowable value
 * @returns {number} The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}