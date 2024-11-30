/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements a simple effect for the canvas. The effect initializes
 *   with a message in the console and renders a solid blue canvas using the
 *   Blitter class.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 class for color manipulation

/**
 * Initializes the effect. Logs a message to the console.
 */
export function initialize() {
    console.log('02pixels | ant war');
}

/**
 * Renders the effect by clearing the canvas with a solid blue color.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    for (let y = 0; y < blitter.height; y++) {
        for (let x = 0; x < blitter.width; x++) {
            const gray = Math.floor(Math.random() * 256);

            blitter.setPixel(x, y, new Color4({red: gray, green: gray, blue: gray}));
        }
    }
}