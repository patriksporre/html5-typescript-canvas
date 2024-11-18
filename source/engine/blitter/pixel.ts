import { Blitter } from "../blitter.js";
import { Color4 } from "../utils/color/color4.js";

/**
 * Sets a pixel at the specified position in the given backbuffer.
 * 
 * @param {Blitter} blitter - The Blitter instance providing access to dimensions, clipping, and backbuffers
 * @param {number} x - The X coordinate of the pixel to plot
 * @param {number} y - The Y coordinate of the pixel to plot
 * @param {Color4} color - The color of the pixel to plot, represented as a Color4 object
 * @param {boolean} clip - Whether to enforce clipping boundaries (default is false)
 * @param {Uint32Array} backbuffer - The backbuffer where the pixel will be drawn (required)
 */
export function setPixel(blitter: Blitter, x: number, y: number, color: Color4, clip: boolean = false, backbuffer: Uint32Array): void {
  if (clip) {
    if (
      x < blitter.clipping.minX || x >= blitter.clipping.maxX ||
      y < blitter.clipping.minY || y >= blitter.clipping.maxY) {
      return;
    }
  }

  backbuffer[y * blitter.width + x] = color.toAABBGGRR();
}

/**
 * Retrieves the color of a pixel at the specified position from the given backbuffer.
 * 
 * @param {Blitter} blitter - The Blitter instance providing access to dimensions, clipping, and backbuffers
 * @param {number} x - The X coordinate of the pixel to retrieve
 * @param {number} y - The Y coordinate of the pixel to retrieve
 * @param {boolean} clip - Whether to enforce clipping boundaries (default is false)
 * @param {Uint32Array} backbuffer - The backbuffer to read from
 * 
 * @returns {Color4 | null} A Color4 object representing the pixel's color, or null if the pixel is out of bounds
 */
export function getPixel(blitter: Blitter, x: number, y: number, clip: boolean = false, backbuffer: Uint32Array): Color4 | null {
    if (clip) {
        if (
          x < blitter.clipping.minX || x >= blitter.clipping.maxX ||
          y < blitter.clipping.minY || y >= blitter.clipping.maxY) {
          return null;
        }
      }

      return new Color4().fromAABBGGRR(backbuffer[y * blitter.width + x]);
}