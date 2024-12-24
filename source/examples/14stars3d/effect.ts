/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Implements a 3D star field effect where stars move towards the viewer from 
 *   random positions in 3D space. Closer stars appear brighter, and when stars 
 *   reach the screen or move outside the viewable area, they are reset to a 
 *   random position at maximum depth.
 */

import { Blitter } from "../../engine/blitter.js";                  // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";        // Color4 utility class for RGBA colors
import { Vector3 } from "../../engine/utils/math/vector3.js";       // Vector3 class for position and velocity
import { Particle } from "../../engine/utils/particle/particle.js"; // Particle class for star representation

import { randomRange } from "../../engine/utils/helper.js";         // Utility function for generating random numbers

import { Star3D } from "./star3d.js";

let width: number;              // Screen width in pixels
let height: number;             // Screen height in pixels

let centerX: number;            // X-coordinate of the screen center
let centerY: number;            // Y-coordinate of the screen center

const stars: Star3D[] = [];     // Array of particles representing stars
const count: number = 400;      // Total number of stars in the field

const near: number = 1;         // Near plane (i.e. minimum depth) (stars reappear when reaching this depth)
const far: number = 255;        // Far plan (i.e maximum depth) (furthest stars start here)

const minV: number = 10;        // Minimum speed for stars in the Z-direction
const maxV: number = 100;       // Maximum speed for stars in the Z-direction

/**
 * Initializes the 3D star field effect.
 * 
 * This function sets up the canvas dimensions, calculates the screen center,
 * and creates a number of stars with random positions, velocities, and colors.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing canvas operations.
 */
export function initialize(blitter?: Blitter) {
    console.log('14stars3d | head first');

    // Set canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    // Calculate screen center
    centerX = width / 2;
    centerY = height / 2;

    // Initialize stars with random positions, velocities, and colors
    for (let i = 0; i < count; i++) {
        const position: Vector3 = new Vector3({
            x: randomRange(-centerX, centerX),  // Random X position
            y: randomRange(-centerY, centerY),  // Random Y position
            z: randomRange(near, far)           // Random depth (Z position)
            //z: far
        });

        const velocity: Vector3 = new Vector3({
            z: -randomRange(minV, maxV)         // Negative Z-velocity (towards the viewer)
        });

        const color: Color4 = new Color4({ caching: false }); // Color for each star

        stars.push(new Star3D(position, velocity, color, width, height, near, far));
    }
}

/**
 * Renders the 3D star field effect.
 * 
 * This function updates each star's position, projects it from 3D to 2D coordinates,
 * calculates its brightness based on depth, and draws it on the screen. Stars that 
 * move too close or leave the visible screen are reset to random positions at the 
 * maximum depth.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    // Clear the screen to black
    blitter.clear(Color4.black);

    for (const star of stars) {
        // Update the star's position based on its velocity
        star.update(deltaTime);

        // Project the star to screen space
        star.project(blitter.clipping);

        // Render the star on screen
        star.render(blitter);
    }
}