/**
 * Project: html5-typescript-canvas
 * File: lissajous.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a dynamic Lissajous Curve generator, which calculates and
 *   traverses points along a sinusoidal trajectory in real-time based on
 *   elapsed time (deltaTime) and speed.
 *
 *   The Lissajous Curve is commonly used for animations or moving objects
 *   along a predefined path, providing a visually pleasing, looping trajectory.
 *   By varying the frequencies (a, b), phase shift (delta), and scaling, it
 *   offers flexible customization for effects such as moving light sources,
 *   oscillating particles, or decorative animations.
 *
 *   The curve generation is time-based, ensuring smooth and frame-independent
 *   motion. Speed changes are seamlessly integrated without causing visual artifacts.
 */

import { Vector2 } from "../math/vector2.js";

/**
 * Defines parameters for constructing a Lissajous Curve.
 */
interface LissajousCurveParameters {
    a?: number; // Frequency of the curve along the x-axis. Default: 3
    b?: number; // Frequency of the curve along the y-axis. Default: 3
    delta?: number; // Phase difference between the x and y oscillations. Default: π/2
    width: number; // The width of the drawing area.
    height: number; // The height of the drawing area.
    uniform?: boolean; // If true, scales the curve uniformly based on the smaller dimension of the drawing area. Default: false
    scale?: number; // Scaling factor for the curve's amplitude. Default: 1
}

/**
 * Represents a Lissajous Curve, providing functionality to generate and traverse the curve's points.
 * Motion along the curve is smooth and controlled by deltaTime and speed.
 */
export class LissajousCurve {
    private a: number;
    private b: number;
    private delta: number;

    private center: Vector2; // Center of the drawing area
    private dimensions: Vector2; // Scaling dimensions for x and y axes
    private time: number = 0; // Current time for animation

    private TWOPI: number = Math.PI * 2;

    /**
     * Constructs a new LissajousCurve object.
     * @param {LissajousCurveParameters} params - Configuration object for the Lissajous curve.
     * Only width and height are mandatory. Other parameters have sensible defaults.
     */
    constructor({ a = 3, b = 3, delta = Math.PI / 2, width, height, uniform = false, scale = 1, }: LissajousCurveParameters) {
        this.a = a;
        this.b = b;
        this.delta = delta;

        // Center of the drawing area
        this.center = new Vector2({ x: width / 2, y: height / 2 });

        // Determines scaling based on the uniform flag
        this.dimensions = uniform
            ? new Vector2({
                  x: Math.min(this.center.x, this.center.y) * scale,
                  y: Math.min(this.center.x, this.center.y) * scale,
              })
            : new Vector2({ x: this.center.x * scale, y: this.center.y * scale });
    }

    /**
     * Updates the position along the curve based on elapsed time or delta time.
     *
     * @param {number} deltaTime - The time elapsed since the last update, in seconds.
     * @param {number} speed - The number of full curve traversals (rotations) per second.
     * @returns {Vector2} A vector containing the current x and y coordinates on the curve.
     */
    public update(deltaTime: number, speed: number): { x: number; y: number } {
        // Increment time using deltaTime and speed
        this.time = (this.time + deltaTime * speed) % this.TWOPI;

        // Ensure time is within [0, 2π] with higher precision
        if (this.time < 0) {
            this.time += this.TWOPI;
        }

        // Calculate the position directly using trigonometric functions
        const x = Math.cos(this.a * this.time + this.delta) * this.dimensions.x + this.center.x;
        const y = Math.cos(this.b * this.time) * this.dimensions.y + this.center.y;

        return { x, y };
    }
}