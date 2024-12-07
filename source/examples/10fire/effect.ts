/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements a classic fire effect using a simple propagation algorithm.
 *   The fire effect is generated in a buffer and rendered to the canvas with a dynamic
 *   palette for visual appeal.
 */

import { Blitter } from "../../engine/blitter.js"; // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js"; // Color4 class for color representation

// Fire buffer and color palette
let fire: Uint8Array; // Fire intensity values (0-255)
const palette: Uint32Array = new Uint32Array(256); // Color palette for fire effect

// Dimensions
let width: number; // Fire buffer width (matches canvas width)
let height: number; // Fire buffer height (matches canvas height + 2 extra rows)

// Temporary pointer for indexing into the fire buffer
let pointer: number;

/**
 * Initializes the fire effect.
 * 
 * - Sets up the fire buffer dimensions
 * - Initializes the fire color palette with shades ranging from black to red, orange, and yellow
 * - Logs a message to the console
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for setup.
 */
export function initialize(blitter?: Blitter) {
    console.log("10fire | light my fire");

    // Initialize fire buffer dimensions
    width = blitter?.clipping.maxX!;
    height = blitter?.clipping.maxY! + 2; // Add two extra rows for the source of the fire

    // Create the fire buffer with an extra row for propagation
    fire = new Uint8Array(width * height);

    // Initialize the color palette
    for (let i = 0; i < 256; i++) {
        palette[i] = new Color4({
            red: Math.min(255, i * 2),                  // Red scales up to 255
            green: Math.min(255, Math.max(0, i - 32)),  // Green kicks in at intensity 32
            blue: Math.min(255, Math.max(0, i - 128))   // Blue appears at higher intensities
        }).toAABBGGRR();
    }
}

/**
 * Renders the fire effect.
 * 
 * - Generates the bottom rows of the fire buffer as the source of the fire
 * - Propagates the fire upward by averaging the intensity values of the pixels below
 * - Renders the fire buffer to the canvas using the precomputed color palette
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number) {
    // Generate the bottom rows of the fire buffer with random high-intensity values
    pointer = width * (height - 2); // Start at the bottom two rows of the buffer
    for (let y = 0; y < 2; y++) { // Fill two rows
        for (let x = 0; x < width; x++) {
            fire[pointer++] = Math.random() < 0.5 ? 255 : 127; // Randomly assign high-intensity values
        }
    }

    // Propagate the fire upwards
    pointer = 0; // Start at the top of the buffer
    for (let y = 0; y < (height - 1); y++) { // Skip the bottom row (source row)
        for (let x = 0; x < width; x++) {
            // Compute the average intensity of the surrounding pixels below
            const value = (
                fire[pointer + width] +         // Directly below
                fire[pointer + width - 1] +     // Below-left
                fire[pointer + width + 1] +     // Below-right
                fire[pointer + width + width]   // Two rows below
            );

            // Set the current pixel's intensity, slightly reduced for cooling
            fire[pointer] = (value - 1) / 4;

            pointer++;
        }
    }

    // Render the fire buffer to the backbuffer using the color palette
    for (let i = 0; i < (blitter.clipping.maxX * blitter.clipping.maxY); i++) {
        blitter.backbuffer[i] = palette[fire[i]]; // Map fire intensity to a color
    }
}