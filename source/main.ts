/**
 * Project: html5-typescript-canvas
 * File: main.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description: This file contains the entry point and main rendering loop for the canvas project
 */

import { Blitter } from './engine/blitter.js';
import { Color4 } from './engine/utils/color/color4.js';

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
    blitter.create({width: 640, height: 480});
    blitter.show();

    requestAnimationFrame(main);
}

/**
 * Main
 * This is the main rendering loop and is called once every frame
 */
function main(): void {
    blitter.clear();

    blitter.setPixel(320, 240, Color4.blue);

    console.log(blitter.getPixel(320, 240)?.toString())

    blitter.blit();

    //requestAnimationFrame(main);
}