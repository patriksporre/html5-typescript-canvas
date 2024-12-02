/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements an effect that displays a loaded image on the canvas
 *   using the Blitter class. The image is loaded asynchronously during the
 *   initialization phase and rendered during each frame.
 */

import { Blitter } from "../../engine/blitter.js"; // Blitter class for managing canvas operations
import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js"; // BitmapImage class for loading images from file

// Global variable to hold the image object
let image: BitmapImage = new BitmapImage();

/**
 * Initializes the effect.
 * 
 * Loads the image asynchronously and logs the initialization process to the console.
 */
export async function initialize() {
    console.log("04image | einstein");

    // Load the image and wait until it is fully loaded
    image.load("../../../images/einstein.png");
    await image.loading();
}

/**
 * Renders the effect by drawing the loaded image onto the canvas.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    // Draw the loaded image using the Blitter instance
    blitter.drawBitmap(image);
}