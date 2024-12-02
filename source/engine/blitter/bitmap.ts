import { Bitmap } from "../utils/bitmap/bitmap.js";
import { Blitter } from "../blitter.js";

/**
 * Draws an arbitrary Uint32Array (i.e., a bitmap) onto the backbuffer.
 * 
 * @param {Blitter} blitter - The Blitter instance providing access to dimensions, clipping, and backbuffers
 * @param {number} width - The width of the Uint32Array
 * @param {number} height - The height of the Uint32Array
 * @param {Uint32Array} pixels - The array of pixels
 * @param {number} x - The starting x position on the backbuffer
 * @param {number} y - The starting y position on the backbuffer
 * @param {boolean} clip - Whether to enforce clipping boundaries (default is true)
 * @param {Uint32Array} backbuffer - The backbuffer ehere the buffer will be drawn
 */
export function drawBuffer(blitter: Blitter, width: number, height: number, pixels: Uint32Array, x: number = 0, y: number = 0, clip: boolean = true, backbuffer: Uint32Array): void {
    // Determine the effective bounds
    const clipMinX = clip ? blitter.clipping.minX : 0;
    const clipMinY = clip ? blitter.clipping.minY : 0;
    const clipMaxX = clip ? blitter.clipping.maxX : blitter.width;
    const clipMaxY = clip ? blitter.clipping.maxY : blitter.height;

    const startX = Math.max(clipMinX, x);
    const startY = Math.max(clipMinY, y);
    const endX = Math.min(clipMaxX, x + width);
    const endY = Math.min(clipMaxY, y + height);

    // Skip drawing if the bitmap is fully outside the backbuffer
    if (startX >= endX || startY >= endY) return;

    // Calculate offsets in the source array
    const sourceStartX = Math.max(0, clipMinX - x);
    const sourceStartY = Math.max(0, clipMinY - y);

    for (let row = startY; row < endY; row++) {
        const sourceIndex = (sourceStartY + (row - startY)) * width + sourceStartX;
        const destIndex = row * blitter.width + startX;

        const rowWidth = endX - startX;
        backbuffer.set(pixels.subarray(sourceIndex, sourceIndex + rowWidth), destIndex);
    }
}

/**
 * Draws a Bitmap object onto the backbuffer.
 * 
 * @param {Blitter} blitter - The Blitter instance providing access to dimensions, clipping, and backbuffers
 * @param {Bitmap} bitmap - The bitmap to draw
 * @param {number} x - The starting x position on the backbuffer
 * @param {number} y - The starting y position on the backbuffer
 * @param {boolean} clip - Whether to enforce clipping boundaries (default is true)
 * @param {Uint32Array} backbuffer - The backbuffer ehere the bitmap will be drawn
 */
export function drawBitmap(blitter: Blitter, bitmap: Bitmap, x: number = 0, y: number = 0, clip: boolean = true, backbuffer: Uint32Array): void {
    drawBuffer(blitter, bitmap.width, bitmap.height, bitmap.data, x, y, clip, backbuffer);
}