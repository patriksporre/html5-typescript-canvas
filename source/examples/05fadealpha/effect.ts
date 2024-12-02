/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements an alpha blending effect where an image fades in and out 
 *   over time using a sinusoidal curve for the alpha channel. The image 
 *   is loaded asynchronously during initialization and rendered frame-by-frame.
 */

import { Blitter } from "../../engine/blitter.js"; // Blitter class for managing canvas operations
import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js"; // BitmapImage class for loading images from file

// Global variable to hold the image object
let image: BitmapImage = new BitmapImage();

/**
 * Initializes the effect.
 * 
 * Loads the image asynchronously and ensures it is ready for rendering.
 * Logs the initialization process to the console.
 */
export async function initialize() {
    console.log("05fadealpha | alpha blending");

    // Load the image and wait until it is fully loaded
    image.load("../../../images/einstein.png");
    await image.loading();
}

/**
 * Renders the alpha blending effect by drawing the loaded image onto the canvas.
 * 
 * The alpha channel of each pixel is dynamically adjusted based on elapsed time
 * to create a smooth fade-in and fade-out effect.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    const delta = blitter.width - image.width;  // Difference between canvas and image width
    let backbufferIndex: number = 0;            // Current index in the backbuffer
    let imageIndex: number = 0;                 // Current index in the image data

    // Calculate the alpha value for the fade effect using a sinusoidal curve
    const frequency = 0.2; // Controls the speed of the fade effect
    const alpha = Math.round(127.5 * (1 + Math.sin(frequency * elapsedTime * Math.PI)));

    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            // Extract the 32 bit pixel in AABBGGRR format
            const pixel = image.data[imageIndex++];

            // Preserve the RGB components while replacing the alpha channel
            const rgb = pixel & 0x00ffffff;

            // Write the pixel with updated alpha to the backbuffer
            blitter.backbuffer[backbufferIndex++] = (alpha << 24) | rgb;
        }
        backbufferIndex += delta; // Adjust for the padding between image rows
    }
}