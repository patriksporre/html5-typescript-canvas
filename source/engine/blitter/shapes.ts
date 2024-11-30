import { Blitter } from "../blitter.js";
import { Color4 } from "../utils/color/color4.js";
import { Vector2 } from "../utils/math/vector2.js";

import { clamp } from "../../engine/utils/helper.js"            // Helper functions

/**
 * Draws a filled rectangle on the screen between two specified coordinates.
 * The rectangle is drawn into the provided backbuffer and can optionally be
 * clipped to stay within the screen bounds.
 * 
 * @param {Blitter} blitter - The blitter instance managing the screen and clipping bounds
 * @param {Vector2} v1 - The first corner of the rectangle (can be any corner)
 * @param {Vector2} v2 - The opposite corner of the rectangle
 * @param {Color4} color - The color to fill the rectangle with, in AABBGGRR format
 * @param {boolean} clip - Whether to clip the rectangle to the screen bounds (default is false)
 * @param {Uint32Array} backbuffer - The backbuffer where the rectangle will be drawn
 */
  export function rectangle(blitter: Blitter, v1: Vector2, v2: Vector2, color: Color4, clip: boolean = false, backbuffer: Uint32Array): void {
    // Round all coordinates to integers
    const x1 = Math.floor(v1.x);
    const y1 = Math.floor(v1.y);
    const x2 = Math.floor(v2.x);
    const y2 = Math.floor(v2.y);

    // Clip coordinates if clipping is enabled
    const clippedX1 = clip ? clamp(x1, blitter.clipping.minX, blitter.clipping.maxX) : x1;
    const clippedY1 = clip ? clamp(y1, blitter.clipping.minY, blitter.clipping.maxY) : y1;
    const clippedX2 = clip ? clamp(x2, blitter.clipping.minX, blitter.clipping.maxX) : x2;
    const clippedY2 = clip ? clamp(y2, blitter.clipping.minY, blitter.clipping.maxY) : y2;

    // Calculate the rectangle dimensions
    const width = Math.abs(clippedX2 - clippedX1);
    const height = Math.abs(clippedY2 - clippedY1);

    // Skip rendering if dimensions are invalid
    if (width === 0 || height === 0) return;

    // Determine the top-left corner of the rectangle
    const startX = Math.min(clippedX1, clippedX2);
    const startY = Math.min(clippedY1, clippedY2);

    // Precompute the color value
    const colorNumerical = color.toAABBGGRR();

    // Calculate the starting position in the backbuffer
    let position = startY * blitter.width + startX;

    // Fill the rectangle in the backbuffer
    for (let y = 0; y < height; y++) {
        backbuffer.fill(colorNumerical, position, position + width);
        position += blitter.width;
    }
}