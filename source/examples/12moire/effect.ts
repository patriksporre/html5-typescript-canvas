/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a dynamic moiré effect using two moving foci. The interference pattern
 *   evolves over time, with the foci following smooth Lissajous curves. This creates
 *   an engaging visual effect, enhanced by configurable parameters such as ring width
 *   and curve frequencies.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 utility class for RGBA colors
import { LissajousCurve } from "../../engine/utils/path/lissajous.js";

let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

let pointer: number;        // Pointer to the backbuffer

type Point2D = { x: number, y: number }; // Represents a 2D point

let path1: Point2D;         // Current position of the first focus
let path2: Point2D;         // Current position of the second focus

let lissajous1: LissajousCurve; // Lissajous curve generator for the first focus
let lissajous2: LissajousCurve; // Lissajous curve generator for the second focus

const color: Color4 = new Color4({ caching: false }); // Reusable Color4 object for pixel calculations

/**
 * Initializes the moiré effect.
 * 
 * Sets up canvas dimensions, calculates the screen center, and configures the 
 * Lissajous curve generators for the moving foci.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing canvas operations.
 */
export function initialize(blitter?: Blitter) {
    console.log('12moire | interference');

    // Set canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    // Configure Lissajous curve generators
    lissajous1 = new LissajousCurve({ a: 2, b: 3, delta: Math.PI / 2, width: width, height: height });
    lissajous2 = new LissajousCurve({ a: 3, b: 4, delta: Math.PI / 4, width: width, height: height });
}

/**
 * Renders the moiré effect by calculating interference patterns
 * between two moving foci and applying them to the canvas.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    pointer = 0;

    // Update the positions of the foci using Lissajous curves
    path1 = lissajous1.update(deltaTime, 0.3); // First focus, scaled speed
    path2 = lissajous2.update(deltaTime, 0.3); // Second focus, scaled speed

    const ringWidth: number = 16; // Controls the spacing between interference rings

    for (let y = 0; y < height; y++) {
        // Precompute vertical distances for efficiency
        const dy1: number = y - path1.y;
        const dy2: number = y - path2.y;

        for (let x = 0; x < width; x++) {
            // Compute horizontal distances
            const dx1: number = x - path1.x;
            const dx2: number = x - path2.x;

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