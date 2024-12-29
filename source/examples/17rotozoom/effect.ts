/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a classic rotozoomer effect where a tiled image rotates and zooms dynamically.
 *   The rotation and zoom interact seamlessly to create a visually captivating effect.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js";

let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

const image: BitmapImage = new BitmapImage(); // Bitmap image for the effect

let angle: number = 0; // Current rotation angle for the effect

let pointer: number;        // Pointer to the backbuffer

/**
 * Initializes the rotozoomer effect.
 * 
 * Sets up the screen dimensions, loads the image, and calculates the center points
 * for both the screen and the image. Logs a message upon initialization.
 */
export async function initialize(blitter?: Blitter) {
    console.log('17rotozoom | rotating einstein');

    // Get canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    // Load the image
    image.load("../../../images/einstein.png");
    await image.loading();
}

/**
 * Renders the rotozoomer effect.
 * 
 * The effect combines rotation and zoom to create a visually dynamic display.
 * The image tiles seamlessly to fill the screen while rotating and zooming
 * around its own axis.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    pointer = 0;

    // Update the rotation angle based on elapsed time
    angle += deltaTime;

    // Calculate the sine of elapsed time for smooth zooming
    const cos: number = Math.cos(angle);
    const sin: number = Math.sin(angle);

    const zoom: number = sin + 1; // Smooth zoom oscillation using sine

    // Loop through each pixel on the screen
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Apply rotation and zoom to the coordinates
            const u: number = Math.floor((x * cos - y * sin) * zoom) % image.width; // Rotate and scale horizontally
            const v: number = Math.floor((x * sin + y * cos) * zoom) % image.height; // Rotate and scale vertically

            // Wrap coordinates to ensure seamless tiling
            const wu: number = (u + image.width) % image.width;
            const wv: number = (v + image.height) % image.height;

            // Map the wrapped coordinates to the image data
            blitter.backbuffer[pointer++] = image.data[wv * image.width + wu];
        }
    }
}