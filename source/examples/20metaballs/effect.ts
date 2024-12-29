/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   [replace]
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 utility class for RGBA colors
import { Vector3 } from "../../engine/utils/math/vector3.js";
import { LissajousCurve } from "../../engine/utils/path/lissajous.js";
import { Metaball } from "./metaball.js";

import { randomRange } from "../../engine/utils/helper.js";

type Point2D = { x: number, y: number }; // Represents a 2D point or position in space

let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

const color: Color4 = new Color4({ caching: false }); // Reusable Color4 object for pixel calculations

const metaballs: Metaball[] = []; // Array of Metaball instances
const lissajous: LissajousCurve[] = []; // Array of LissajousCurve instances for movement

const count: number = 5;    // Number of metaballs
const threshold: number = 25; // Field threshold for rendering brightness

/**
 * Initializes the metaballs effect, setting up dimensions, metaballs, and their movement paths.
 * Logs a message to the console for debugging purposes.
 *
 * @param {Blitter} blitter - An instance of the Blitter class for managing the canvas.
 */
export function initialize(blitter?: Blitter) {
    console.log('20metaballs | black hole sun');

    // Get canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    // Initialize metaballs and their Lissajous paths
    for (let i = 0; i < count; i++) {
        metaballs.push(
            new Metaball(
                new Vector3(),  // Initial position
                new Vector3(),  // Initial velocity (not used in this effect)
                Color4.white,   // Color
                150             // Radius of influence
            )
        );

        lissajous.push(
            new LissajousCurve({
                a: randomRange(2, 6),  // Frequency along the x-axis
                b: randomRange(2, 6),  // Frequency along the y-axis
                width: width,          // Canvas width
                height: height,        // Canvas height
                scale: 0.6             // Scale down the movement amplitude
            })
        );
    }
}

/**
 * Renders the metaballs effect by computing and visualizing their scalar field.
 * Metaballs move along precomputed Lissajous paths and their overlapping fields
 * generate dynamic grayscale intensities.
 *
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} elapsedTime - Total elapsed time since the effect started, in seconds.
 * @param {number} deltaTime - Time elapsed since the last frame, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    let pointer = 0;

    // Clear the screen to black
    blitter.clear(Color4.black);

    // Update metaball positions along their Lissajous paths
    for (let i = 0; i < count; i++) {
        const path: Point2D = lissajous[i].update(deltaTime, 0.2);

        metaballs[i].position.x = path.x;
        metaballs[i].position.y = path.y;
    }

    // Compute the scalar field and render metaballs
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let field: number = 0;

            // Sum the contributions of all metaballs to the scalar field
            for (const metaball of metaballs) {
                const dx: number = x - metaball.position.x;
                const dy: number = y - metaball.position.y;

                const squared: number = dx * dx + dy * dy;

                if (squared > 0) {
                    const influence: number = (metaball.diameter * metaball.diameter) / squared;
                    field = field + influence;
                }
            }
            
            // Normalize the field value to a range [0, 255]
            const intensity = Math.min(255, Math.max(0, Math.floor((field / threshold) * 255)));

            // Render the pixel as a grayscale value
            color.red = intensity;
            color.green = intensity;
            color.blue = intensity;

            blitter.backbuffer[pointer++] = color.toAABBGGRR();
        }
    }
}