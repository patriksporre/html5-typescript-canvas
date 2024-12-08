/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Implements a dynamic plasma effect using a smooth color palette and 
 *   sinusoidal calculations. The plasma effect includes time-based motion 
 *   and a dynamically drifting center of gravity for visual variation.
 * 
 *   Inspired by the plasma developed by Sean (mrkite) at https://github.com/mrkite/demofx,
 *   with fixes for full 256 color usage in the color computation.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 utility class for RGBA colors

// Global variables for the plasma effect
let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

let pointer: number;        // Pointer to the backbuffer

const color: Color4 = new Color4({ caching: false }); // Reusable Color4 object for pixel calculations

/**
 * Initializes the plasma effect.
 * 
 * This function sets up the required color palette and the plasma buffer based
 * on the canvas dimensions. It also logs an initialization message to the console.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing the canvas
 */
export function initialize(blitter?: Blitter) {
    console.log("11plasma | thanks sean");

    // Set canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping
}

/**
 * Renders the plasma effect.
 * 
 * The function calculates dynamic plasma values for each pixel based on sinusoidal 
 * equations and maps them to colors from the palette. The center of the plasma effect 
 * drifts over time to create motion. The result is drawn to the backbuffer.
 * 
 * I spent a Sunday afternoon experimenting with various expressions for the plasma and
 * finally settled on an approach inspired by Sean (mrkite) at https://github.com/mrkite/demofx.
 * Thanks for the inspiration, Sean! I also fixed the color computation to fully utilize
 * all 255 colors for a smoother effect.
 * 
 * @param {Blitter} blitter - Instance of the Blitter class for handling canvas drawing
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    pointer = 0;

    // Precompute time-related variables for clarity
    const time1: number = elapsedTime / 3;
    const time2: number = elapsedTime / 5;
    const time3: number = elapsedTime * 0.8 + 1;
    const time4: number = elapsedTime * 0.5;

    for (let y = 0; y < height; y++) {
        const dy: number = y / height - 0.5;            // Normalized y-coordinate
        const cy: number = dy + 0.5 + Math.cos(time1);  // Vertical motion with time

        for (let x = 0; x < width; x++) {
            const dx: number = x / width - 0.5;             // Normalized x-coordinate
            const cx: number = dx + 0.5 * Math.sin(time2);  // Horizontal motion with time

            // Compute the plasma value
            const value: number = (
                Math.sin(dx * 10 + elapsedTime) +                       // Horizontal wave
                Math.sin(Math.sqrt(75 * (cx * cx + cy * cy) + time3)) + // Radial wave
                Math.cos(Math.sqrt(dx * dx + dy * dy) - time4)          // Circular motion
            );

            // Use Color4 object to compute color values
            color.red = Math.floor((Math.sin(value * Math.PI) + 1) * 127.5);    // Sinusoidal red channel
            color.green = 0;                                                    // Static green channel
            color.blue = Math.floor((Math.cos(value * Math.PI) + 1) * 127.5);   // Sinusoidal blue channel

            // Assign color to the backbuffer
            blitter.backbuffer[pointer++] = color.toAABBGGRR();
        }
    }
}