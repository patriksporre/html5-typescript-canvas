/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Extends the Particle class to represent a 2D star in a parallax star field.
 */

import { Blitter } from "../../engine/blitter.js";
import { Color4 } from "../../engine/utils/color/color4.js";
import { Vector3 } from "../../engine/utils/math/vector3.js";
import { Particle } from "../../engine/utils/particle/particle.js";

import { randomRange } from "../../engine/utils/helper.js";

export class Star2D extends Particle {
    private width: number;      // Screen width in pixels
    private height: number;     // Screen height in pixels

    private slowest: number;    // Minimum horizontal speed for the star
    private fastest: number;    // Maximum horizontal speed for the star
    private speed: number;      // Base speed multiplier

    /**
     * Constructor for the Star2D class.
     * 
     * @param {Vector3} position - Initial position of the star.
     * @param {Vector3} velocity - Initial velocity of the star.
     * @param {Color4} color - Color of the star.
     * @param {number} width - Screen width in pixels.
     * @param {number} height - Screen height in pixels.
     * @param {number} slowest - Minimum horizontal speed for the star.
     * @param {number} fastest - Maximum horizontal speed for the star.
     * @param {number} speed - Base speed multiplier for star velocity.
     */
    constructor(position: Vector3, velocity: Vector3, color: Color4, width: number, height: number, slowest: number, fastest: number, speed: number) {
        super(position, velocity, color);

        this.width = width;
        this.height = height;

        this.slowest = slowest;
        this.fastest = fastest;
        this.speed = speed;
    }

    /**
     * Updates the position of the star.
     * 
     * If the star exits the right side of the screen, it reappears on the left
     * side with a new random vertical position and velocity.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
     */
    public update(deltaTime: number): void {
        this.position.add(this.velocity.clone().scale(deltaTime));

        // Wrap around when the star exits the right edge of the screen
        if (this.position.x >= this.width) {
            this.position.x = 0; // Reset to the left edge
            this.position.y = Math.random() * this.height; // Random vertical position
            this.velocity.x = randomRange(this.slowest, this.fastest) * this.speed; // New random speed
        }
    }

    /**
     * Renders the star to the screen.
     * 
     * Draws a single pixel at the star's position with the star's color.
     * 
     * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
     */
    public render(blitter: Blitter): void {
        blitter.setPixel(this.position.x, this.position.y, this.color, false);
    }
}