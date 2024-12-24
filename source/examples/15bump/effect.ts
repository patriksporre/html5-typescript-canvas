/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a 2D bump mapping effect using a generated height map and a moving light source.
 *   The light source simulates movement across the height map, creating dynamic shading.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 utility class for RGBA colors
import { Vector3 } from "../../engine/utils/math/vector3.js";   // Vector3 class for light position

let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

let pointer: number;        // Pointer to the backbuffer

let heightMap: Uint8Array;  // Height map for the bump mapping effect
let light: Vector3 = new Vector3({ x: 1, y: 1 }); // Light source position

const color: Color4 = new Color4({ caching: false }); // Reusable Color4 object for pixel calculations

/**
 * Initializes the 2D bump mapping effect.
 * 
 * This function generates a height map based on a radial wave pattern,
 * simulating a textured surface. The height map values are stored in a
 * Uint8Array for efficient pixel manipulation.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing canvas operations.
 */
export function initialize(blitter?: Blitter) {
    console.log('15bump | the core principle');

    // Get canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    // Initialize the height map
    heightMap = new Uint8Array(width * height);

    // Generate height map using a radial sine wave
    for (let y = 0; y < height; y++) {
        const dy = y - (height / 2); // Distance from center in Y
        for (let x = 0; x < width; x++) {
            const dx = x - (width / 2); // Distance from center in X

            const distance = Math.sqrt((dx * dx) + (dy * dy));  // Radial distance from center
            const wave = Math.sin(distance / 5);                // Generate sine wave pattern
            const brightness = Math.floor((wave + 1) * 127.5);  // Normalize to 0-255 range

            heightMap[y * width + x] = brightness;              // Store in height map
        }
    }
}

/**
 * Renders the bump mapping effect.
 * 
 * This function calculates shading based on the height map and a moving light source.
 * The light source's position changes over time, creating the appearance of dynamic
 * illumination across the textured surface.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    // Update the light source position based on elapsed time
    light.x = Math.sin(elapsedTime);
    light.y = Math.cos(elapsedTime);

    // Loop through each pixel, excluding the borders
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index: number = y * width + x; // Index in the height map and backbuffer

            // Calculate height differences in X and Y directions.
            // 
            // dx is the difference in height between the pixel to the right and the pixel to the left.
            // This represents the slope of the surface in the horizontal direction.
            //
            // dy is the difference in height between the pixel below and the pixel above.
            // This represents the slope of the surface in the vertical direction.
            //
            // These differences (gradients) indicate how steep the surface is in each direction, 
            // which is later used to calculate the pixel's brightness based on the light source.
            const dx: number = heightMap[index + 1] - heightMap[index - 1];
            const dy: number = heightMap[index + width] - heightMap[index - width];

            // Calculate brightness based on light source direction.
            //
            // The brightness is determined by the dot product of the height gradients (dx and dy) 
            // and the light source direction (light.x and light.y).
            //
            // This creates the illusion of highlights and shadows based on the simulated light's position.
            const brightness: number = Math.max(0, Math.min(255, dx * light.x + dy * light.y));

            // Set pixel color based on brightness
            color.red = brightness;
            color.green = brightness;
            color.blue = brightness;

            // Write color to the backbuffer
            blitter.backbuffer[index] = color.toAABBGGRR();
        }
    }
}