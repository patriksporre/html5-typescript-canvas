/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a zoom effect where the image oscillates between a minimum 
 *   and maximum zoom level, centering the zoom at the middle of the screen.
 *   The image is loaded asynchronously and rendered frame by frame.
 */

import { Blitter } from "../../engine/blitter.js"; // Blitter class for managing canvas operations
import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js"; // BitmapImage class for loading images from file
import { Color4 } from "../../engine/utils/color/color4.js";

// Global variable to hold the image object
const image: BitmapImage = new BitmapImage();

// Background color
const background: number = Color4.black.toAABBGGRR();

// Screen center coordinates
let screenCenterX: number;
let screenCenterY: number;

// Image center coordinates
let imageCenterX: number;
let imageCenterY: number;

// Zoom parameters
const minZoom: number = 0.5;     // Minimum zoom factor
const maxZoom: number = 8.0;     // Maximum zoom factor
const frequency: number = 0.2;   // Speed of zoom oscillation

/**
 * Initializes the effect.
 * 
 * Loads the image asynchronously and calculates the center coordinates for 
 * both the screen and the image.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for setup
 */
export async function initialize(blitter?: Blitter) {
    console.log("07zoom | nearest-pixel sampling");

    // Load the image and wait until it is fully loaded
    image.load("../../../images/einstein.png");
    await image.loading();

    // Calculate the screen center coordinates
    screenCenterX = blitter?.clipping.maxX! / 2;
    screenCenterY = blitter?.clipping.maxY! / 2;

    // Calculate the image center coordinates
    imageCenterX = image.width / 2;
    imageCenterY = image.height / 2;
}

/**
 * Renders the zoom effect by drawing the loaded image onto the canvas.
 * 
 * The zoom level oscillates between a minimum and maximum value, and the
 * image is scaled around the center of the screen.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    let backbufferIndex = 0; // Index to write to the backbuffer

    // Calculate the zoom factor using a sinusoidal function
    const zoom = minZoom + (maxZoom - minZoom) * (0.5 * (1 + Math.sin(frequency * elapsedTime * Math.PI)));

    /**
    The inner loop maps each screen pixel to a corresponding image pixel based on the zoom factor.
    1.  Calculate the normalized screen coordinates relative to the screen center
    2.  Scale the normalized coordinates by dividing them by the zoom factor
    3.  Map the scaled coordinates back to image space by adding the image center coordinates
    4.  If the mapped coordinates are within the bounds of the image:
            - Copy the pixel from the image to the backbuffer
        Otherwise:
            - Set the pixel in the backbuffer to the background color
    This process ensures that the image is scaled and centered dynamically while pixels
    outside the image boundaries are filled with a background color.
    */

    for (let y = 0; y < blitter.clipping.maxY; y++) {
        for (let x = 0; x < blitter.clipping.maxX; x++) {
            // Compute the image-space coordinates for the current screen pixel
            const normalizedX = (x - screenCenterX) / zoom; // Distance from screen center, scaled by zoom
            const normalizedY = (y - screenCenterY) / zoom;

            const imageX = Math.floor(normalizedX + imageCenterX); // Map to image-space X coordinate
            const imageY = Math.floor(normalizedY + imageCenterY); // Map to image-space Y coordinate

            if (imageX >= 0 && imageX < image.width && imageY >= 0 && imageY < image.height) {
                // Calculate the index of the corresponding pixel in the image
                const imageIndex = imageY * image.width + imageX;

                // Copy the pixel to the backbuffer
                blitter.backbuffer[backbufferIndex] = image.data[imageIndex];
            } else {
                // Fill with black if the mapped coordinates are out of image bounds
                blitter.backbuffer[backbufferIndex] = background;
            }

            backbufferIndex++; // Move to the next pixel in the backbuffer
        }
    }
}