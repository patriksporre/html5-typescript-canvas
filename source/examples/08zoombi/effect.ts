/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a zoom effect where the image oscillates between a minimum 
 *   and maximum zoom level, centering the zoom at the middle of the screen.
 *   The image is loaded asynchronously and rendered frame by frame using 
 *   bilinear sampling for smoother scaling.
 */

import { Blitter } from "../../engine/blitter.js"; // Blitter class for managing canvas operations
import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js"; // BitmapImage class for loading images from file
import { Color4 } from "../../engine/utils/color/color4.js";

import { lerp } from "../../engine/utils/helper.js"; // Helper function for linear interpolation

// Create a new Color4 object and instruct to not cache the numerical representation
const color: Color4 = new Color4({caching: false});

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
    console.log("08zoombi | bilinear sampling");

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
 * Renders the zoom effect with bilinear sampling by drawing the loaded image 
 * onto the canvas. The image is scaled smoothly using bilinear interpolation.
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
    1. Map each screen pixel to a fractional coordinate in image space
    2. Decompose the fractional coordinate into:
        - Integer part (representing the nearest pixel grid in image space)
        - Fractional part (used for bilinear interpolation)
    3. Sample the four neighboring pixels using the getPixel method
    4. Perform bilinear interpolation by blending the neighboring pixels' colors:
        - Horizontally blend the top two and bottom two pixels
        - Vertically blend the results of the horizontal blends
    5. Write the interpolated color to the backbuffer
    6. If the mapped coordinates are out of bounds, fill the pixel with a background color
    */

    for (let y = 0; y < blitter.clipping.maxY; y++) {
        for (let x = 0; x < blitter.clipping.maxX; x++) {
            // Map screen coordinates to fractional image coordinates
            const imageX = (x - screenCenterX) / zoom + imageCenterX;
            const imageY = (y - screenCenterY) / zoom + imageCenterY;

            // Decompose into integer and fractional parts
            const floorX = Math.floor(imageX); // Integer X coordinate (left)
            const floorY = Math.floor(imageY); // Integer Y coordinate (top)
            const fracX = imageX - floorX;     // Fractional X coordinate (horizontal interpolation)
            const fracY = imageY - floorY;     // Fractional Y coordinate (vertical interpolation)

            // Sample the four neighboring pixels using Blitter's getPixel method
            const p00 = blitter.getPixel(floorX, floorY, true, image.data);         // Top-left
            const p10 = blitter.getPixel(floorX + 1, floorY, true, image.data);     // Top-right
            const p01 = blitter.getPixel(floorX, floorY + 1, true, image.data);     // Bottom-left
            const p11 = blitter.getPixel(floorX + 1, floorY + 1, true, image.data); // Bottom-right

            if (p00 && p10 && p01 && p11) {
                // Perform bilinear interpolation on each color channel

                // Perform bilinear interpolation for the red channel
                // Step 1: Interpolate horizontally between the top two neighbors (p00 and p10) based on fracX
                const redTopBlend = lerp(p00.red, p10.red, fracX); // Horizontal blend: Top row
                // Step 2: Interpolate horizontally between the bottom two neighbors (p01 and p11) based on fracX
                const redBottomBlend = lerp(p01.red, p11.red, fracX); // Horizontal blend: Bottom row
                // Step 3: Interpolate vertically between the results of the horizontal blends based on fracY
                const blendedRed = lerp(redTopBlend, redBottomBlend, fracY); // Final blend: Combine top and bottom blends

                // Perform bilinear interpolation for the green channel (follows the same steps as red)
                const greenTopBlend = lerp(p00.green, p10.green, fracX); // Horizontal blend: Top row
                const greenBottomBlend = lerp(p01.green, p11.green, fracX); // Horizontal blend: Bottom row
                const blendedGreen = lerp(greenTopBlend, greenBottomBlend, fracY); // Final blend: Combine top and bottom blends

                // Perform bilinear interpolation for the blue channel (follows the same steps as red)
                const blueTopBlend = lerp(p00.blue, p10.blue, fracX); // Horizontal blend: Top row
                const blueBottomBlend = lerp(p01.blue, p11.blue, fracX); // Horizontal blend: Bottom row
                const blendedBlue = lerp(blueTopBlend, blueBottomBlend, fracY); // Final blend: Combine top and bottom blends

                // Update the color object and write it to the backbuffer
                color.red = blendedRed;
                color.green = blendedGreen;
                color.blue = blendedBlue;
                blitter.backbuffer[backbufferIndex++] = color.toAABBGGRR();
            } else {
                // Handle pixels outside the image boundaries by setting them to the background color
                blitter.backbuffer[backbufferIndex++] = background;
            }
        }
    }
}