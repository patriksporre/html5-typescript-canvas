/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   [replace]
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 utility class for RGBA colors

let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

let pointer: number;        // Pointer to the backbuffer

const color: Color4 = new Color4({ caching: false }); // Reusable Color4 object for pixel calculations

/**
 * Initializes the effect. Logs a message to the console.
 */
export function initialize(blitter?: Blitter) {
    console.log('00template | [replace]');

    // Get canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping
}

/**
 * [replace]
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    pointer = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Generate XOR pattern
            color.red = x ^ y;
            color.green = x ^ y;
            color.blue = x ^ y;

            // Write the pixel color to the backbuffer
            blitter.backbuffer[pointer++] = color.toAABBGGRR();
        }
    }
}