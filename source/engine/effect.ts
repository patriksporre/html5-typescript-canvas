/**
 * Project: html5-typescript-canvas
 * File: interfaces.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file defines the Effect interface, which serves as a contract for
 *   all effect modules to implement. The interface ensures that each effect
 *   provides methods for initialization and rendering.
 */

import { Blitter } from "./blitter.js";                 // Blitter class for managing canvas rendering

/**
 * The Effect interface defines the structure of an effect module.
 * Each effect must implement the following methods:
 * 
 * - initialize: called once before the rendering loop starts, used to set up
 *   any state or resources needed by the effect
 * 
 * - render: called on every frame during the rendering loop, used to update
 *   and draw the effect to the canvas
 */
export interface Effect {
    /**
     * Initializes the effect. This method is called once before the rendering loop starts.
     */
    initialize(blitter?: Blitter): void;

    /**
     * Renders the effect for a given frame.
     * 
     * @param {Blitter} blitter - An instance of the Blitter class for canvas operations
     * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds
     */
    render(blitter: Blitter, elapsedTime: number, deltaTime: number): void;
}