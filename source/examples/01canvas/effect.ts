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
    console.log('01canvas | a blue canvas');
}

/**
 * Renders the effect by clearing the canvas with a solid blue color.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    blitter.clear(Color4.blue);
}