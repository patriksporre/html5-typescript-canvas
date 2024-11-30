/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements a simple effect for the canvas. The effect initializes
 *   with a message in the console and renders a dynamic "ant war" effect using
 *   randomized brightness, noise, and distortion.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 class for color manipulation
import { clamp } from "../../engine/utils/helper.js"            // Helper functions

const color: Color4 = new Color4({caching: false});             // Create a new Color4 object and instruct to not cache the numerical representation

/**
 * Initializes the effect. Logs a message to the console.
 */
export function initialize() {
    console.log('02pixels | ant war');
}

/**
 * Renders the "ant war" effect with randomized brightness, dynamic noise, 
 * and wavy distortions. The effect mimics the look of an analog TV signal with no input.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
 */
export function render(blitter: Blitter, elapsedTime: number) {
    /**
     * Random overall brightness of the frame to simulate the unstable lighting effect of the
     * analog signal. Brightness ranges between 80% - 100%
     */
    const brightness: number = 0.8 + Math.random() * 0.2;
    color.alpha = Math.floor(256 * brightness); // Set alpha based on brightness to simulate varying intensity

    const time: number = elapsedTime * 50; // Scales elapsed time for smooth distortion animation

    for (let y = 0; y < blitter.height; y++) {
        for (let x = 0; x < blitter.width; x++) {
            const gray: number = Math.floor(Math.random() * 256);
            
            /**
             * 50% chance of applying random noise to each channel. Noise adds slight variations 
             * in color intensity, simulating analog interference.
             */
            const noiseR = Math.random() < 0.5 ? Math.random() * 100 - 50 : 0;
            const noiseG = Math.random() < 0.5 ? Math.random() * 100 - 50 : 0;
            const noiseB = Math.random() < 0.5 ? Math.random() * 100 - 50 : 0;

            /**
             * Wavy distortion effect applied along the x-axis. The distortion oscillates between -20 and 
             * 20 (amplitude), and the frequency is controlled by the factor 0.05
             */
            const distortion = Math.sin((x + time) * 0.05) * 20;

            // Update the color with clamped values
            color.red = clamp(gray + distortion + noiseR, 0, 255);
            color.green = clamp(gray + distortion + noiseG, 0, 255);
            color.blue = clamp(gray + distortion + noiseB, 0, 255);

            blitter.setPixel(x, y, color);
        }
    }
}