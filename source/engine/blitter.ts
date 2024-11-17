/**
 * Project: html5-typescript-canvas
 * File: blitter.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *  This file contains the singleton Blitter class which manages the canvas
 *  set up and low-level pixel manipulation
 */

import { Clipping } from './utils/geometry/clipping.js';
import { Color4 } from './utils/color/color4.js';

interface CanvasParameters {
    width: number,
    height: number,
    background?: Color4
}

export class Blitter {
    private static instance: Blitter;       // Static instance of the Blitter singleton

    public width: number = 0;               // Canvas width (default set to 0)
    public height: number = 0;              // Canvas height (default set to 0)
    public background!: Color4;             // Background color (default Color4.white)

    private clipping!: Clipping;            // Clipping region

    /**
     * Private constructor to prevent direct instantiation.
     * Use getInstance() to access the singleton instance
     */
    private constructor() {
    }

    /**
     * Retrieves the singleton instance of the Blitter class.
     * If no instance exists, it creates one.
     * 
     * @returns {Blitter} The singleton instance of the Blitter class
     */
    public static getInstance(): Blitter {
        if (!Blitter.instance) {
            Blitter.instance = new Blitter();
        }

        return Blitter.instance;
    }

    /**
     * Creates and initializes the canvas with the specified dimensions and background color.
     * 
     * @param {CanvasParameters} params - An object containing the canvas parameters:
     *   - width (number): The width of the canvas in pixels
     *   - height (number): The height of the canvas in pixels
     *   - background (Color4, optional): The background color of the canvas
     *     Defaults to Color4.white if not provided
     */
    public create({width, height, background = Color4.white}: CanvasParameters): void {
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.background = background;

        this.clipping = new Clipping(0, 0, this.width, this.height);
    }
}