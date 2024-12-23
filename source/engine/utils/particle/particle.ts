/**
 * Project: html5-typescript-canvas
 * File: particle.ts
 * Author: Patrik Sporre
 * License: MIT
 * 
 * Description:
 *   Represents a basic particle with position, velocity, and color. 
 *   The particle can be updated over time based on its velocity and 
 *   rendered onto a canvas using the Blitter class.
 */

import { Blitter } from "../../blitter.js";                 // Blitter class for canvas operations
import { Color4 } from "../color/color4.js";                // Color4 class for RGBA color representation
import { Vector3 } from "../math/vector3.js";               // Vector3 class for position and velocity

/**
 * The Particle class encapsulates the properties and behaviors of a single particle.
 */
export class Particle {
    public position: Vector3;   // Current position of the particle
    public velocity: Vector3;   // Velocity determining particle movement
    public color: Color4;       // Color of the particle

    /**
     * Constructs a new Particle instance.
     * 
     * @param {Vector3} position - The initial position of the particle.
     * @param {Vector3} velocity - The velocity vector determining the particle's movement.
     * @param {Color4} color - The color of the particle.
     */
    constructor(position: Vector3, velocity: Vector3, color: Color4) {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
    }

    /**
     * Updates the particle's position based on its velocity.
     * 
     * This method adds the velocity vector to the current position vector,
     * simulating movement over time.
     */
    public update(): void {
        this.position.add(this.velocity);
    }

    /**
     * Renders the particle onto a canvas using the Blitter class.
     * 
     * @param {Blitter} blitter - The Blitter instance used for drawing operations.
     */
    public render(blitter: Blitter): void {
        blitter.setPixel(this.position.x, this.position.y, this.color);
    }
}