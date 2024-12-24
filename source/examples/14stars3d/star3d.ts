/**
 * Project: html5-typescript-canvas
 * File: star3d.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Extends the Particle class to represent a 3D star in a star field.
 */

import { Blitter } from "../../engine/blitter.js";
import { Clipping } from "../../engine/utils/geometry/clipping.js";
import { Color4 } from "../../engine/utils/color/color4.js";
import { Vector3 } from "../../engine/utils/math/vector3.js";
import { Particle } from "../../engine/utils/particle/particle.js";

import { randomRange } from "../../engine/utils/helper.js";

export class Star3D extends Particle {
    private width: number;            // Screen width in pixels
    private height: number;           // Screen height in pixels

    private near: number;             // Near plane distance (minimum depth)
    private far: number;              // Far plane distance (maximum depth)

    private centerX: number;          // X-coordinate of the screen center
    private centerY: number;          // Y-coordinate of the screen center

    private centerXscaled: number;    // Scaled center X-coordinate for reset bounds
    private centerYscaled: number;    // Scaled center Y-coordinate for reset bounds

    private scale: number;            // Scale factor based on far plane and screen size

    private x!: number;               // Projected 2D X-coordinate of the star
    private y!: number;               // Projected 2D Y-coordinate of the star

    /**
     * Creates a new instance of the Star3D class.
     * 
     * @param {Vector3} position - Initial 3D position of the star.
     * @param {Vector3} velocity - Velocity vector of the star (Z-axis movement).
     * @param {Color4} color - RGBA color of the star.
     * @param {number} width - Width of the screen in pixels.
     * @param {number} height - Height of the screen in pixels.
     * @param {number} near - Near plane distance (minimum depth).
     * @param {number} far - Far plane distance (maximum depth).
     */
    constructor(position: Vector3, velocity: Vector3, color: Color4, width: number, height: number, near: number, far: number) {
        super(position, velocity, color);

        this.width = width;
        this.height = height;

        this.near = near;
        this.far = far;

        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.scale = this.far / Math.max(this.centerX, this.centerY);

        this.centerXscaled = this.centerX * this.scale;
        this.centerYscaled = this.centerY * this.scale;
    }

    /**
     * Updates the star's position based on its velocity.
     * 
     * If the star reaches the near plane, it is reset to a random position
     * at the far plane.
     * 
     * @param {number} deltaTime - The time elapsed since the last update, in seconds.
     */
    public update(deltaTime: number): void {
        this.position.add(this.velocity.clone().scale(deltaTime));

        if (this.position.z <= this.near) {
            this.reset();
        }
    }

    /**
     * Renders the star on the screen.
     * 
     * The star's brightness is based on its depth (Z position). Brighter stars
     * appear closer to the viewer.
     * 
     * @param {Blitter} blitter - Instance of the Blitter class for canvas operations.
     */
    public render(blitter: Blitter): void {
        const shade: number = 255 - this.position.z;

        this.color.red = shade;
        this.color.green = shade;
        this.color.blue = shade;

        blitter.setPixel(this.x, this.y, this.color, false);
    }

    /**
     * Projects the star's 3D position to 2D screen space.
     * 
     * If the star's projected position is outside the visible area, it is reset
     * and re-projected.
     * 
     * @param {Clipping} clipping - Instance of the Clipping class to handle screen bounds.
     */
    public project(clipping: Clipping): void {
        this.projection();

        if (clipping.outside(this.x, this.y)) {
            this.reset();
            this.projection();
        }
    }

    /**
     * Calculates the star's 2D screen coordinates based on its 3D position.
     */
    private projection(): void {
        this.x = Math.round((this.position.x / this.position.z) * this.centerX + this.centerX);
        this.y = Math.round((this.position.y / this.position.z) * this.centerY + this.centerY);
    }

    /**
     * Resets the star to a random position at the far plane.
     * 
     * The star is assigned a random X and Y position within scaled screen bounds,
     * and its Z position is set to the farthest depth.
     */
    private reset(): void {
        this.position.x = randomRange(-this.centerXscaled, this.centerXscaled);
        this.position.y = randomRange(-this.centerYscaled, this.centerYscaled);
        this.position.z = this.far;
    }
}