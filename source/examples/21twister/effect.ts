/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a vertical twister effect, simulating a twisting block with four sides.
 *   The sides are colored differently (red, green, blue, yellow) and the twist
 *   animates based on a sinusoidal function. The amplitude of the twist oscillates
 *   over time, giving a dynamic visual effect.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 utility class for RGBA colors
import { Vector2 } from "../../engine/utils/math/vector2.js";

// Canvas dimensions
let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

const center: Vector2 = new Vector2();

// Colors for the four sides of the twister
const colors: Color4[] = [Color4.red, Color4.green, Color4.blue, Color4.yellow];

const twisterWidth: number = 80; // Width of the twister

const angles: number[] = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

// Active variant for rendering
let activeVariant: number = 1; // Default variant

/**
 * Event listener for switching rendering variants based on keyboard input.
 */
window.addEventListener('keydown', switchActiveVariant);

/**
 * Handles keydown events to switch between rendering variants.
 * Updates the activeVariant variable based on the pressed key.
 * 
 * @param {KeyboardEvent} event - The keyboard event triggering the variant switch
 */
function switchActiveVariant(event: KeyboardEvent) {
    const key: number = parseInt(event.key, 10);
    if (key >= 1 && key <= 4) {
        activeVariant = key;
        console.log('Active variant: ' + activeVariant);
    }
}

/**
 * Initializes the twister effect. Logs a message to the console and sets up canvas dimensions.
 * 
 * @param {Blitter} blitter - The blitter instance used for canvas operations.
 */
export function initialize(blitter?: Blitter) {
    console.log('21twister | twist');

    // Get canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    center.x = width / 2;
    center.y = height / 2;
}

/**
 * Renders the twister effect frame by frame.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    blitter.clear(Color4.black); // Clear the screen

    const rotation: number = elapsedTime * 0.5;

    // The twister is drawn top to bottom
    for (let y = 0; y < height; y++) {
        const normalizedY: number = y / height;

        let twistX: number = 0;
        let twistY: number = 0;
        let angle: number = rotation;

        // Calculate twist and angle based on the active variant
        switch (activeVariant) {
            case 1: // Simple rotation
                break;
            case 2: // Rotation with vertical twist
                twistY = Math.sin(rotation) * (Math.PI / height) * y;
                angle = angle + twistY;
                break;
            case 3: // Rotation with vertical and horizontal twist
                twistX = 0.05 * Math.sin(elapsedTime + normalizedY * 5.4) * width;
                twistY = Math.sin(rotation) * (Math.PI / height) * y;
                angle = angle + twistY;
                break;
            case 4: // Complex twisting and horizontal movement
                const cos: number = Math.cos(elapsedTime);
                twistX = 0.05 * Math.sin(elapsedTime + normalizedY * 5.4) * width;
                twistY = elapsedTime + normalizedY +
                    1.4 * Math.sin(normalizedY * 5 + cos) +
                    0.55 * Math.sin(normalizedY * 2.3 + cos * 0.9);
                angle = angle + twistY;
                break;
        }

        const x: number[] = [];
        
        // Calculate the x-coordinates for each side of the twister
        for (let i = 0; i < angles.length; i++) {
            x[i] = Math.round(Math.sin(angle + angles[i]) * twisterWidth + center.x + twistX);
        }

        // Draw the twister sides
        for (let i = 0; i < x.length; i++) {
            const x1: number = x[i];
            const x2: number = x[(i + 1) % x.length];
            if (x1 < x2) {
                blitter.lineHorizontalAbsolute(x1, x2, y, colors[i]);
            }
        }
    }
}