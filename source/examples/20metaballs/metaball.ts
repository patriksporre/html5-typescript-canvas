/**
 * Project: html5-typescript-canvas
 * File: metaball.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Defines a Metaball class, representing a circular influence field
 *   moving in 2D space with dynamic position, velocity, and color.
 */

import { Vector3 } from "../../engine/utils/math/vector3.js";
import { Color4 } from "../../engine/utils/color/color4.js";
import { Particle } from "../../engine/utils/particle/particle.js";

/**
 * Represents a metaball, a circular field of influence used in scalar field visualization.
 */
export class Metaball extends Particle {
    public radius: number; // Radius of the metaball
    public diameter: number; // Diameter of the metaball, precomputed for efficiency

    /**
     * Constructs a new Metaball object.
     * 
     * @param {Vector3} position - Initial position of the metaball
     * @param {Vector3} velocity - Velocity of the metaball (not used in this implementation)
     * @param {Color4} color - Color of the metaball
     * @param {number} radius - Radius of the metaball
     */
    constructor(position: Vector3, velocity: Vector3, color: Color4, radius: number) {
        super(position, velocity, color);

        this.radius = Math.floor(radius);
        this.diameter = this.radius + this.radius;
    }
}