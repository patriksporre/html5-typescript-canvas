/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a 2D star field effect where stars move horizontally with 
 *   random speeds and brightness. Stars wrap around the screen, reappearing 
 *   on the left side with new properties when they exit on the right.
 */

import { Blitter } from "../../engine/blitter.js";                  // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";        // Color4 utility class for RGBA colors
import { Vector3 } from "../../engine/utils/math/vector3.js";       // Vector3 class for position and velocity

import { randomRange } from "../../engine/utils/helper.js";         // Utility function for generating random numbers

import { Star2D } from "./star2d.js";

let width: number;              // Screen width in pixels
let height: number;             // Screen height in pixels

const stars: Star2D[] = [];     // Array of particles representing stars
const count: number = 400;      // Total number of stars in the field

const slowest: number = 1;      // Minimum horizontal speed for stars
const fastest: number = 5;      // Maximum horizontal speed for stars
const speed: number = 60;       // The number of frames per second we aim for

/**
 * Initializes the 2D star field effect.
 * 
 * Sets up the canvas dimensions and creates a set of stars with random initial
 * positions, velocities, and brightness levels.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing canvas operations
 */
export function initialize(blitter?: Blitter) {
    console.log('13stars2d | back in space');

    // Set canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    // Create stars with random properties
    for (let i = 0; i < count; i++) {
        const position: Vector3 = new Vector3({
            x: Math.random() * width,
            y: Math.random() * height
        });

        const velocity: Vector3 = new Vector3({
            x: randomRange(slowest, fastest) * speed // Random speed for parallax effect
        });

        const shade: number = randomRange(128, 255); // Brightness level (128-255)
        const color: Color4 = new Color4({ red: shade, green: shade, blue: shade });

        stars.push(new Star2D(position, velocity, color, width, height, slowest, fastest, speed));
    }
}

/**
 * Renders the 2D star field effect.
 * 
 * Updates and renders each star. Stars that exit the right side of the screen
 * reappear on the left with new vertical positions and velocities.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    // Clear the screen to black
    blitter.clear(Color4.black);

    // Update and render each star
    for (const star of stars) {
        star.update(deltaTime);

        star.render(blitter);
    }
}