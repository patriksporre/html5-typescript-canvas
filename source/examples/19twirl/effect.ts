/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a dynamic twirl effect over an image. The effect distorts the image 
 *   based on a center point, where the distortion intensity oscillates sinusoidally 
 *   to create a "dancing" twirl motion. The distortion alternates direction and strength, 
 *   creating a visually engaging pattern.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js";
import { Vector2 } from "../../engine/utils/math/vector2.js";

let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

const image: BitmapImage = new BitmapImage();

const center: Vector2 = new Vector2(); // Center of the twirl effect

const distortion: number = 5;          // Maximum twirl distortion intensity
let radius: number;                    // Radius of the twirl effect

/**
 * Initializes the twirl effect.
 * 
 * Prepares the canvas dimensions, loads the Einstein image, and calculates the 
 * center point and maximum radius for the effect.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing canvas operations.
 */
export async function initialize(blitter?: Blitter) {
    console.log('19twirl | down the drain');

    // Get canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    center.x = width / 2;               // Set the center of the effect to the middle of the screen
    center.y = height / 2;

    radius = Math.min(width, height) / 2; // Set the radius to half the smaller screen dimension

    image.load("../../../images/einstein.png"); // Load the Einstein image
    await image.loading();                     // Wait for the image to finish loading
}

/**
 * Renders the dynamic twirl effect.
 * 
 * Distorts the image using a sinusoidally oscillating twirl intensity based on the distance 
 * from the center point. The distortion alternates direction and strength over time, 
 * creating a smooth "dancing" motion.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    let pointer = 0;

    // Calculate twirl intensity based on a sine wave
    const intensity: number = Math.sin(elapsedTime) * distortion; // Oscillates between -5 and 5

    for (let y = 0; y < height; y++) {
        const dy: number = y - center.y; // Distance from center in the y-direction
        const dy2 = dy * dy;             // Precompute square of dy for distance calculation

        for (let x = 0; x < width; x++) {
            const dx: number = x - center.x; // Distance from center in the x-direction
            const dx2 = dx * dx;             // Precompute square of dx for distance calculation

            const distance: number = Math.sqrt(dx2 + dy2); // Distance from the center

            if (distance < radius) {
                const angle: number = Math.atan2(dy, dx); // Angle relative to the center
                const distortion: number = intensity * (radius - distance) / radius; // Twirl distortion

                const twist: number = angle + distortion; // Twisted angle with distortion applied

                // Calculate distorted coordinates
                const u: number = Math.floor((Math.cos(twist) * distance) + center.x) % image.width;
                const v: number = Math.floor((Math.sin(twist) * distance) + center.y) % image.height;

                // Wrap coordinates for seamless effect
                const wu: number = (u + image.width) % image.width;
                const wv: number = (v + image.height) % image.height;

                // Map distorted coordinates back to the image
                blitter.backbuffer[pointer++] = image.data[wv * image.width + wu];
            } else {
                // Preserve original image for areas outside the twirl radius
                blitter.backbuffer[pointer++] = image.data[y * image.width + x % image.width];
            }
        }
    }
}