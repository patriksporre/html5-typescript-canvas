/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements an effect that displays a loaded image on the canvas
 *   using the Blitter class. The image is loaded asynchronously during the
 *   initialization phase and rendered frame by frame. The effect demonstrates
 *   the use of a GrayscaleFilter to process the image into grayscale before rendering.
 */

import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js";     // BitmapImage class for loading images from file
import { Blitter } from "../../engine/blitter.js";                          // Blitter class for managing canvas operations
import { Filter } from "../../engine/filters/filter.js";                    // Base Filter class for image processing
import { FilterFactory } from "../../engine/filters/filterfactory.js";      // Factory for creating filter instances

// Global variable to hold the image object
const image: BitmapImage = new BitmapImage();

// Create an instance of the GrayscaleFilter using the FilterFactory
const filter: Filter = FilterFactory.createGrayscale();

/**
 * Initializes the effect.
 * 
 * This method performs the following tasks:
 * - Logs the initialization process to the console.
 * - Loads the image asynchronously and waits until it is fully loaded.
 * - Applies the grayscale filter to the image during initialization.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for setup
 */
export async function initialize(blitter?: Blitter) {
    console.log("09grayscale | a first filter");

    // Load the image and wait until it is fully loaded
    image.load("../../../images/einstein.png");
    await image.loading();

    // Pre-process the image with the GrayscaleFilter
    filter.process(image.data, image.width, image.height);
}

/**
 * Renders the grayscale effect by drawing the pre-processed grayscale image onto the canvas.
 * 
 * This method renders the image directly from the backbuffer after it has been processed
 * by the GrayscaleFilter during initialization.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    // Draw the pre-processed grayscale image onto the backbuffer
    blitter.drawBitmap(image);
}