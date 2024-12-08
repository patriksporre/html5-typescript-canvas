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
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 utility class for RGBA colors
import { clamp } from "../../engine/utils/helper.js";           // Helper function to clamp values to a specified range

// Global variables for the plasma effect
let palette: Uint32Array;   // Color palette with 256 smooth gradient entries
let plasma: Uint8Array;     // Plasma buffer holding the color indices for each pixel
let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

let pointer: number;        // Index pointer for writing into the backbuffer

/**
 * Initializes the plasma effect.
 * 
 * This function sets up the required color palette and the plasma buffer based
 * on the canvas dimensions. It also logs an initialization message to the console.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing the canvas.
 */
export function initialize(blitter?: Blitter) {
    console.log("11plasma | a thousand options");

    // Set canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;  // Maximum y-coordinate for clipping
    
    // Initialize the plasma buffer with dimensions matching the canvas
    plasma = new Uint8Array(width * height);

    // Create a smooth color palette with 256 entries
    palette = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        palette[i] = new Color4({
            red: Math.sin(0.02 * i + 0) * 127 + 128,   // Smooth sinusoidal red component
            green: Math.sin(0.02 * i + 2) * 127 + 128, // Phase-shifted green component
            blue: Math.sin(0.02 * i + 4) * 127 + 128   // Phase-shifted blue component
        }).toAABBGGRR();                               // Convert to packed AABBGGRR format
    }
}

/**
 * Renders the plasma effect.
 * 
 * The function calculates dynamic plasma values for each pixel based on sinusoidal 
 * equations and maps them to colors from the palette. The center of the plasma effect 
 * drifts over time to create motion. The result is drawn to the backbuffer.
 * 
 * @param {Blitter} blitter - Instance of the Blitter class for handling canvas drawing.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number) {
    pointer = 0; // Reset pointer for the backbuffer index

    // Dynamically calculate the center of gravity for the plasma effect
    const centerX: number = width / 2 + Math.sin(elapsedTime) * 50; // Horizontal drift based on sine wave
    const centerY: number = height / 2 + Math.cos(elapsedTime) * 25; // Vertical drift based on cosine wave

    for (let y = 0; y < height; y++) {
        const dy: number = y - centerY; // Vertical distance from the center

        for (let x = 0; x < width; x++) {
            const dx: number = x - centerX; // Horizontal distance from the center

            // Calculate the plasma value using a blend of sinusoidal equations
            const value: number = (
                128 + (128 * Math.sin(x / 8) + elapsedTime) +                               // Horizontal wave
                128 + (128 * Math.sin(y / 16) + elapsedTime) +                              // Vertical wave
                128 + (128 * Math.sin((x + y) / 16)) +                                      // Diagonal wave
                128 + (128 * Math.sin(Math.sqrt(dx * dx + dy * dy) / 8 + elapsedTime * 4))  // Radial wave
            ) / 4; // Average the combined sinusoidal values

            // Clamp the plasma value to the range [0, 255] for color indexing
            const color: number = clamp(Math.round(value), 0, 255);

            // Write the corresponding color from the palette to the backbuffer
            blitter.backbuffer[pointer++] = palette[color];
        }
    }
}