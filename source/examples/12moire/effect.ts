/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Implements a dynamic moiré effect using two moving foci. The interference pattern
 *   evolves over time, with optional noise added for a more organic look.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 utility class for RGBA colors

let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

let centerX: number;        // Horizontal center of the screen
let centerY: number;        // Vertical center of the screen

let pointer: number;        // Pointer to the backbuffer

const color: Color4 = new Color4({ caching: false }); // Reusable Color4 object for pixel calculations

/**
 * Initializes the moiré effect.
 * 
 * Sets up the canvas dimensions and computes the screen center.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing canvas operations
 */
export function initialize(blitter?: Blitter) {
    console.log('12moire | interference');

    // Set canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    // Compute screen center
    centerX = width / 2;
    centerY = height / 2;
}

/**
 * Renders the moiré effect by calculating interference patterns
 * between two moving foci and applying them to the canvas.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {

    pointer = 0;

    // Calculate the motion paths for the two foci
    const path1X: number = Math.sin(elapsedTime / 2) * (centerX / 2);
    const path1Y: number = Math.cos(elapsedTime / 3) * (centerY / 2);
    const path2X: number = Math.sin(elapsedTime / 3) * (centerX / 2);
    const path2Y: number = Math.cos(elapsedTime / 2) * (centerY / 2);

    // Determine the current positions of the two foci
    const foci1X: number = centerX + path1X;
    const foci1Y: number = centerY + path1Y;
    const foci2X: number = centerX + path2X;
    const foci2Y: number = centerY + path2Y;

    const ringWidth: number = 16; // Controls the spacing between rings

    for (let y = 0; y < height; y++) {
        // Precompute vertical distances for efficiency
        const dy1: number = y - foci1Y;
        const dy2: number = y - foci2Y;

        for (let x = 0; x < width; x++) {
            // Compute horizontal distances
            const dx1: number = x - foci1X;
            const dx2: number = x - foci2X;

            // Calculate distances to both foci
            const distance1: number = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
            const distance2: number = Math.sqrt((dx2 * dx2) + (dy2 * dy2));

            // Compute shade based on XOR of distances and ringWidth
            const shade: number = Math.floor((distance1 ^ distance2) / ringWidth) % 2 === 0 ? 255 : 0;

            // Apply the computed shade to the reusable Color4 object
            color.red = shade;
            color.green = shade;
            color.blue = shade;

            // Write the pixel color to the backbuffer
            blitter.backbuffer[pointer++] = color.toAABBGGRR();
        }
    }
}