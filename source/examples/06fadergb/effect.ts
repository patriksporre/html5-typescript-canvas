 /**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements an RGB fading effect where an image transitions smoothly
 *   toward a target color (black in this case) over time. The interpolation
 *   uses a sinusoidal curve for a natural fading effect. The image is loaded
 *   asynchronously during initialization and rendered frame-by-frame.
 */

import { Blitter } from "../../engine/blitter.js"; // Blitter class for managing canvas operations
import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js"; // BitmapImage class for loading images from file
import { Color4 } from "../../engine/utils/color/color4.js"; // Color4 utility for handling colors
import { lerp } from "../../engine/utils/helper.js"; // Helper function for linear interpolation

// Global variable to hold the image object
let image: BitmapImage = new BitmapImage();

/**
 * Initializes the effect.
 * 
 * Asynchronously loads the image and ensures it is ready for rendering.
 * Logs the initialization process to the console.
 */
export async function initialize() {
    console.log("06fadergb | fade to black");

    // Load the image and wait until it is fully loaded
    image.load("../../../images/einstein.png");
    await image.loading();
}

/**
 * Renders the RGB fading effect by drawing the loaded image onto the canvas.
 * 
 * Each pixel of the image is interpolated toward a target color (black) over time.
 * The blending process maintains smooth transitions using a sinusoidal curve
 * to calculate the interpolation factor.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    const delta = blitter.width - image.width; // Padding between rows to align with the backbuffer width
    let backbufferIndex: number = 0;           // Current index in the backbuffer
    let imageIndex: number = 0;                // Current index in the image data

    // Define the target color (black in this case)
    const targetRed = Color4.black.red;
    const targetGreen = Color4.black.green;
    const targetBlue = Color4.black.blue;

    // Calculate the interpolation factor based on a sinusoidal curve
    const frequency = 0.2; // Controls the speed of the fade effect
    const t = (Math.sin(frequency * elapsedTime * Math.PI) + 1) / 2; // Normalize to [0, 1]

    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            // Extract the 32 bit pixel in AABBGGRR format
            const pixel = image.data[imageIndex++];

            // Extract RGB components from the pixel
            const red = (pixel >> 0) & 0xff;
            const green = (pixel >> 8) & 0xff;
            const blue = (pixel >> 16) & 0xff;

            // Use lerp to interpolate each channel toward the target color
            const blendedRed = Math.round(lerp(red, targetRed, t));
            const blendedGreen = Math.round(lerp(green, targetGreen, t));
            const blendedBlue = Math.round(lerp(blue, targetBlue, t));

            // Reconstruct the pixel with the new RGB values and full opacity
            blitter.backbuffer[backbufferIndex++] = (255 << 24) | (blendedBlue << 16) | (blendedGreen << 8) | blendedRed;
        }
        backbufferIndex += delta; // Adjust for the padding between image rows
    }
}