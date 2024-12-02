/**
 * Project: html5-typescript-canvas
 * File: engine.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file defines the core engine logic for loading and running effects.
 *   It manages the rendering loop, time tracking, and interaction with the
 *   Blitter class to display effects on a 2D canvas. The engine provides
 *   a loader function for initializing and running effects dynamically
 *   from a given path.
 */

import { Blitter } from './blitter.js';             // Blitter class for canvas operations
import { Effect } from "./effect.js";           // Effect interface defining effect structure

// Singleton instance of the Blitter for rendering operations
const blitter: Blitter = Blitter.getInstance();

/**
 * Dynamically loads an effect module and initializes the rendering loop.
 * 
 * @param {string} path - The path to the effect module (must implement the Effect interface)
 */
export async function loader(path: string) {
    // Initialize the Blitter with a canvas size of 640x480
    blitter.create({width: 640, height: 480});
    blitter.show();

    // Dynamically import the effect module
    const effect: Effect = await import(path);

    // Call the effect's initialization method
    effect.initialize();

    // State variables
    let running: boolean = true;                    // Whether the rendering loop is running
    let elapsedTime: number = 0;                    // Accumulated time while the loop is running
    let lastTimestamp: number = performance.now();  // Timestamp of the last frame

    // Start the rendering loop
    requestAnimationFrame(main);

    /**
     * The main rendering loop, responsible for updating and rendering each frame.
     * 
     * @param {number} timestamp - Current timestamp provided by requestAnimationFrame
     */
    function main(timestamp: number) {
        const delta = (timestamp - lastTimestamp) / 1000; // Time difference in seconds
        lastTimestamp = timestamp;

        // Update elapsed time only if the loop is running
        if (running) {
            elapsedTime = elapsedTime + delta;
        }

        // Call the effect's render method
        effect.render(blitter, elapsedTime);

        // Blit the updated frame to the canvas
        blitter.blit();

        // Schedule the next frame
        requestAnimationFrame(main);
    }

    // Event listener to toggle the loop's running state when the spacebar is pressed
    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            running = !running;
        }
    });
}
