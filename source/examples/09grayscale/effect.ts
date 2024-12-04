/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements an effect that displays a loaded image on the canvas
 *   using the Blitter class. The image is loaded asynchronously during the
 *   initialization phase and rendered frame by frame. The effect demonstrates
 *   the use of a GrayscaleFilter to convert the image to grayscale during rendering.
 */

import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js";     // BitmapImage class for loading images from file
import { Blitter } from "../../engine/blitter.js";                          // Blitter class for managing canvas operations
import { Filter } from "../../engine/filters/filter.js";                    // Base Filter class for image processing
import { GrayscaleFilter } from "../../engine/filters/grayscalefilter.js";  // GrayscaleFilter class for grayscale conversion

// Global variable to hold the image object
const image: BitmapImage = new BitmapImage();

// Create an instance of the GrayscaleFilter
const filter: Filter = new GrayscaleFilter();

/**
 * Initializes the effect.
 * 
 * Loads the image asynchronously and calculates necessary properties
 * for rendering. Logs the initialization process to the console.
 */
export async function initialize() {
    console.log("09grayscale | a first filter");

    // Load the image and wait until it is fully loaded
    image.load("../../../images/einstein.png");
    await image.loading();
}

/**
 * Renders the grayscale effect by applying the GrayscaleFilter
 * to the loaded image.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    // Draw the loaded image onto the backbuffer using the Blitter instance
    blitter.drawBitmap(image);

    // Apply the GrayscaleFilter to convert the image to grayscale
    blitter.applyFilter(filter);
}