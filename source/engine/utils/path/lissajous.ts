/**
 * Project: html5-typescript-canvas
 * File: lissajous.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a Lissajous Curve generator, which creates and traverses
 *   precomputed points based on sinusoidal oscillations in two dimensions.
 *
 *   The Lissajous Curve is commonly used for animations or moving objects
 *   along a predefined path, providing a visually pleasing, looping trajectory.
 *   By varying the frequencies (a, b), phase shift (delta), and scaling, it
 *   offers flexible customization for effects such as moving light sources,
 *   oscillating particles, or decorative animations.
 */

import { Vector2 } from "../math/vector2.js";

/**
 * Defines parameters for constructing a Lissajous Curve.
 */
interface LissajousCurveParameters {
    a?: number; // Frequency of the curve along the x-axis. Default: 3
    b?: number; // Frequency of the curve along the y-axis. Default: 3
    delta?: number; // Phase difference between the x and y oscillations. Default: π/2
    step?: number; // Incremental step for computing the curve points. Affects the resolution. Default: 0.01
    width: number; // The width of the drawing area.
    height: number; // The height of the drawing area.
    uniform?: boolean; // If true, scales the curve uniformly based on the smaller dimension of the drawing area. Default: false
    scale?: number; // Scaling factor for the curve's amplitude. Default: 1
}

/**
 * Represents a Lissajous Curve, providing functionality to generate and traverse the curve's points.
 * The curve is precomputed based on the provided parameters, allowing efficient animation.
 */
export class LissajousCurve {
    private a: number;
    private b: number;
    private delta: number;

    private track: { x: number; y: number }[] = []; // Precomputed points on the Lissajous curve
    private time: number = 0; // Current time for animation
    private step: number; // Incremental step for computing the curve points

    private TWOPI: number = Math.PI * 2;

    /**
     * Constructs a new LissajousCurve object.
     * @param {LissajousCurveParameters} params - Configuration object for the Lissajous curve.
     * Only width and height are mandatory. Other parameters have sensible defaults.
     */
    constructor({a = 3, b = 3, delta = Math.PI / 2, step = 0.01, width, height, uniform = false, scale = 1,}: LissajousCurveParameters) {
        this.a = a;
        this.b = b;
        this.delta = delta;
        this.step = step;

        // Center of the drawing area
        const center: Vector2 = new Vector2({ x: width / 2, y: height / 2 });

        // Determines scaling based on the uniform flag
        const dimensions: Vector2 = uniform
        ? new Vector2({
            x: Math.min(center.x, center.y) * scale,
            y: Math.min(center.x, center.y) * scale,
            })
        : new Vector2({ x: center.x * scale, y: center.y * scale });

        // Precompute the track points
        for (let t = 0; t <= Math.PI * 2; t += step) {
        const x = Math.sin(this.a * t + this.delta) * dimensions.x + center.x;
        const y = Math.cos(this.b * t) * dimensions.y + center.y;
        this.track.push({ x, y });
        }
    }

    /**
     * Updates the position along the curve based on elapsed time or delta time.
     *
     * @param {number} deltaTime - The time elapsed since the last update, in seconds.
     * @param {number} speed - The speed multiplier for traversal along the curve.
     * @returns {Object} An object containing the current x and y coordinates on the curve
     */
    public update(deltaTime: number, speed: number): { x: number; y: number } {
        // Increment time using deltaTime to control the speed of traversal
        this.time = this.time + deltaTime * speed;

        // Wrap around time to stay within the bounds of the track array
        const index = Math.floor((this.time % this.TWOPI) / this.step);

        return this.track[index];
    }
}