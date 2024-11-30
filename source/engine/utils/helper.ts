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

/**
 * Generates a random number within a specified range.
 *
 * @param {number} min - The minimum value of the range (inclusive)
 * @param {number} max - The maximum value of the range (exclusive)
 * @returns {number} A random number between min (inclusive) and max (exclusive)
 */
export function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}