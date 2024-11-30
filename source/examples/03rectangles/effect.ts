/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements a dynamic canvas effect. The effect initializes with
 *   a message in the console and renders randomly colored rectangles on the canvas
 *   using the Blitter class.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 class for color manipulation
import { Vector2 } from "../../engine/utils/math/vector2.js";

import { randomRange } from "../../engine/utils/helper.js"      // Helper functions

/**
 * Initializes the effect. Logs a message to the console.
 */
export function initialize() {
    console.log('03rectangles | rectangles everywhere');
}

/**
 * Renders the dynamic effect by drawing a randomly colored rectangle on the canvas.
 * Each frame generates new random coordinates and color values.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    // Generate the first corner of the rectangle with random coordinates
    const v1: Vector2 = new Vector2({
        x: randomRange(blitter.clipping.minX, blitter.clipping.maxX),
        y: randomRange(blitter.clipping.minY, blitter.clipping.maxY)
    });

    // Generate the opposite corner of the rectangle with random coordinates
    const v2: Vector2 = new Vector2({
        x: randomRange(blitter.clipping.minX, blitter.clipping.maxX),
        y: randomRange(blitter.clipping.minY, blitter.clipping.maxY)
    });

    // Generate a random color for the rectangle
    const color: Color4 = new Color4({
        red: randomRange(0, 255),
        green: randomRange(0, 255),
        blue: randomRange(0, 255)
    });

    // Draw the rectangle on the canvas
    blitter.rectangle(v1, v2, color);
}