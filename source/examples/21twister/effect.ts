/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a vertical twister effect, simulating a twisting block with four sides.
 *   The twister features several dynamic rendering modes:
 *     - Flat rendering: solid-colored sides
 *     - Gouraud rendering: smooth color gradients between the edges of each side
 *     - Gouraud texture rendering: combines Gouraud shading with a striped texture
 *   The twisting behavior is controlled by sinusoidal functions, allowing for dynamic
 *   and visually appealing effects. Users can toggle between different twisting modes
 *   and rendering methods using keyboard inputs.
 */

import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Color4 utility class for RGBA colors
import { lerp } from "../../engine/utils/helper.js";
import { Vector2 } from "../../engine/utils/math/vector2.js";

// Canvas dimensions
let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

const center: Vector2 = new Vector2(); // Center point of the canvas

const color: Color4 = new Color4({ caching: false }); // Temporary color used for shading calculations

// Colors for the four sides of the twister
const colors: Color4[] = [Color4.red, Color4.green, Color4.blue, Color4.purple];

const twisterWidth: number = 100; // Width of the twister

const angles: number[] = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // Angles for each side of the twister

// Active twist for rendering
let activeTwist: number = 1; // Default twist mode

// Active rendering method
let activeRendering: number = 1; // Default rendering method

/**
 * Event listener for switching twisting and rendering modes using keyboard input.
 * Users can toggle between twist modes (1-4) and rendering modes (f, g, t).
 */
window.addEventListener('keydown', switchActiveVariant);

/**
 * Handles keydown events to switch between twisting and rendering modes.
 * 
 * Twisting Modes:
 * - '1': Simple rotation
 * - '2': Rotation with vertical twist
 * - '3': Rotation with vertical and horizontal twist
 * - '4': Complex twisting with horizontal movement
 * 
 * Rendering Methods:
 * - 'f': Flat rendering (solid-colored sides)
 * - 'g': Gouraud rendering (smooth gradients)
 * - 't': Gouraud texture rendering (gradients with stripes)
 * 
 * @param {KeyboardEvent} event - The keyboard event triggering the variant switch
 */
function switchActiveVariant(event: KeyboardEvent) {
    if (event.key === '1') {
        activeTwist = 1;
        console.log('Simple rotation');
    } else if (event.key === '2') {
        activeTwist = 2;
        console.log('Rotation with vertical twist');
    } else if (event.key === '3') {
        activeTwist = 3;
        console.log('Rotation with vertical and horizontal twist');
    } else if (event.key === '4') {
        activeTwist = 4;
        console.log('Complex twisting and horizontal movement');
    }

    if (event.key === 'f') {
        activeRendering = 1;
        console.log('Flat rendering');
    } else if (event.key === 'g') {
        activeRendering = 2;
        console.log('Gouraud rendering');
    } else if (event.key === 't') {
        activeRendering = 3;
        console.log('Gouraud texture rendering');
    }
}

/**
 * Initializes the twister effect by setting up canvas dimensions and the center point.
 * Logs an initialization message to the console.
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
 * Renders the twister effect frame by frame, updating the display based on the
 * active twisting and rendering modes.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    blitter.clear(Color4.black); // Clear the screen

    const rotation: number = elapsedTime * 0.5; // Base rotation angle

    // Draw the twister line by line
    for (let y = 0; y < height; y++) {
        const normalizedY: number = y / height;

        let twistX: number = 0;
        let twistY: number = 0;
        let angle: number = rotation;

        // Determine twisting behavior based on active mode
        switch (activeTwist) {
            case 1: // Simple rotation
                break;
            case 2: // Rotation with vertical twist
                twistY = Math.sin(rotation) * (Math.PI / height) * y;
                angle += twistY;
                break;
            case 3: // Rotation with vertical and horizontal twist
                twistX = 0.05 * Math.sin(elapsedTime + normalizedY * 5.4) * width;
                twistY = Math.sin(rotation) * (Math.PI / height) * y;
                angle += twistY;
                break;
            case 4: // Complex twisting and horizontal movement
                twistX = 0.05 * Math.sin(elapsedTime + normalizedY * 5.4) * width;
                twistY = elapsedTime + normalizedY +
                    1.4 * Math.sin(normalizedY * 5 + Math.cos(elapsedTime)) +
                    0.55 * Math.sin(normalizedY * 2.3 + Math.cos(elapsedTime * 0.9));
                angle += twistY;
                break;
        }

        const x: number[] = [];

        // Calculate x-coordinates for the four sides of the twister
        for (let i = 0; i < angles.length; i++) {
            x[i] = Math.round(Math.sin(angle + angles[i]) * twisterWidth + center.x + twistX);
        }

        // Render the sides of the twister
        for (let i = 0; i < x.length; i++) {
            const x1: number = x[i];
            const x2: number = x[(i + 1) % x.length];

            const c1: Color4 = colors[i];
            const c2: Color4 = colors[(i + 1) % colors.length];

            if (x1 < x2) {
                // Determine rendering method
                switch (activeRendering) {
                    case 1: // Flat rendering
                        blitter.lineHorizontalAbsolute(x1, x2, y, colors[i]);
                        break;
                    case 2: // Gouraud rendering
                        for (let x = x1; x <= x2; x++) {
                            const t: number = (x - x1) / (x2 - x1);
                            color.red = c1.red + t * (c2.red - c1.red);
                            color.green = c1.green + t * (c2.green - c1.green);
                            color.blue = c1.blue + t * (c2.blue - c1.blue);
                            blitter.setPixel(x, y, color);
                        }
                        break;
                    case 3: // Gouraud texture rendering
                        for (let x = x1; x <= x2; x++) {
                            const t = (x - x1) / (x2 - x1);
                            color.red = c1.red + t * (c2.red - c1.red);
                            color.green = c1.green + t * (c2.green - c1.green);
                            color.blue = c1.blue + t * (c2.blue - c1.blue);

                            const position: number = t * twisterWidth;
                            const isEven = Math.floor(position / 2) % 2 === 0;

                            if (isEven) {
                                color.red *= 0.9;
                                color.green *= 0.9;
                                color.blue *= 0.9;
                            }

                            blitter.setPixel(x, y, color);
                        }
                        break;
                }
            }
        }
    }
}