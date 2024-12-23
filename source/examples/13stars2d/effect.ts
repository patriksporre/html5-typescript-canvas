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
import { Particle } from "../../engine/utils/particle/particle.js"; // Particle class for star representation

import { randomRange } from "../../engine/utils/helper.js";     // Utility function for generating random numbers

let width: number;              // Screen width in pixels
let height: number;             // Screen height in pixels

const stars: Particle[] = [];   // Array of particles representing stars
const count: number = 400;      // Total number of stars in the field

const slowest: number = 1;      // Minimum horizontal speed for stars
const fastest: number = 5;      // Maximum horizontal speed for stars

const wantedFPS: number = 60;   // The number of frames per second we aim for

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
            x: randomRange(slowest, fastest) * wantedFPS // Random speed for parallax effect
        });

        const shade: number = randomRange(128, 255); // Brightness level (128-255)
        const color: Color4 = new Color4({ red: shade, green: shade, blue: shade });

        stars.push(new Particle(position, velocity, color));
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
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    // Clear the screen to black
    blitter.clear(Color4.black);

    // Update and render each star
    for (const star of stars) {
        star.update(deltaTime);

        // Wrap around when a star exits the screen
        if (star.position.x >= width) {
            star.position.x = 0; // Reset to the left edge
            star.position.y = Math.random() * height; // Random vertical position
            star.velocity.x = randomRange(slowest, fastest) * wantedFPS; // New random speed
        }

        star.render(blitter);
    }
}