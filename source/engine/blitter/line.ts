import { Blitter } from "../blitter.js";
import { Color4 } from "../utils/color/color4.js";
import { lerp } from "../utils/helper.js";
import { Vector2 } from "../utils/math/vector2";

/**
 * Draw a horizontal line with desired color, supports optional clipping and custom backbuffers.
 * 
 * @param {Blitter} blitter - The Blitter instance providing access to dimensions, clipping, and backbuffers
 * @param {number} x1 - The first x-coordinate (start point)
 * @param {number} x2 - The second x-coordinate (end point)
 * @param {number} y - The y-coordinate
 * @param {Color4} color - The color of the line
 * @param {boolean} clip - Whether to clip the line to screen bounds (default: false)
 * @param {Uint32Array} backbuffer - The backbuffer to draw to (default: main backbuffer)
 */
export function lineHorizontalAbsolute(blitter: Blitter, x1: number, x2: number, y: number, color: Color4, clip: boolean = false, backbuffer: Uint32Array): void {
    if (y < 0 || y >= blitter.clipping.maxY) return; // The line is not visible vertically

    // Ensure x1 is the smaller value and x2 is the larger value
    x1 = Math.min(x1, x2);
    x2 = Math.max(x1, x2);

    if (clip) {
        // Clip horizontally
        x1 = Math.max(0, x1);
        x2 = Math.min(blitter.clipping.maxX - 1, x2);
    }

    // Calculate the starting pointer in the backbuffer
    const pointer: number = y * blitter.width + x1;

    // Draw the horizontal line
    for (let x = 0; x <= (x2 - x1); x++) {
        backbuffer[pointer + x] = color.toAABBGGRR();
    }
}

/**
 * Draw a horizontal line with desired color, supports optional clipping and custom backbuffers.
 * 
 * @param {Blitter} blitter - The Blitter instance providing access to dimensions, clipping, and backbuffers
 * @param {Vector2} v1 - The first coordinate (start point)
 * @param {Vector2} v2 - The second coordinate (end point)
 * @param {Color4} color - The color of the line
 * @param {boolean} clip - Whether to clip the line to screen bounds (default: false)
 * @param {Uint32Array} backbuffer - The backbuffer to draw to (default: main backbuffer)
 */
export function lineHorizontalVector(blitter: Blitter, v1: Vector2, v2: Vector2, color: Color4, clip: boolean = false, backbuffer: Uint32Array): void {
    if (v1.y !== v2.y) return; // Ensure the line is horizontal

    if (v1.y < 0 || v1.y >= blitter.clipping.maxY) return; // The line is not visible vertically

    let x1 = Math.min(v1.x, v2.x);
    let x2 = Math.max(v1.x, v2.x);

    if (clip) {
        x1 = Math.max(0, x1);
        x2 = Math.min(blitter.clipping.maxX - 1, x2);
    }

    const pointer: number = v1.y * blitter.width + x1;

    for (let x = 0; x <= (x2 - x1); x++) {
        backbuffer[pointer + x] = color.toAABBGGRR();
    }
}