/**
 * Project: html5-typescript-canvas
 * File: main.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description: This file contains the entry point and main rendering loop for the canvas project
 */

import { Blitter } from './engine/blitter.js';

const blitter: Blitter = Blitter.getInstance();

/**
 * Entry point: waits for the windown to load before initializing the application
 */
window.addEventListener('load', initialize);

/**
 * Initialize
 * Sets up any required resources or initial state, then starts the main loop
 */
function initialize(): void {
    requestAnimationFrame(main);
}

/**
 * Main
 * This is the main rendering loop and is called once every frame
 */
function main(): void {
    requestAnimationFrame(main);
}