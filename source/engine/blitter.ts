/**
 * Project: html5-typescript-canvas
 * File: blitter.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file defines the Blitter singleton class, which manages the canvas setup,
 *   backbuffer operations, and low-level pixel manipulation. The class provides methods
 *   for initializing the canvas, managing its dimensions and background color, and rendering
 *   the backbuffer to the screen.
 */

import { Clipping } from './utils/geometry/clipping.js';
import { Color4 } from './utils/color/color4.js';

/**
 * Parameters for initializing the canvas.
 */
interface CanvasParameters {
    width: number,                              // Width of the canvas in pixels
    height: number,                             // Height of the canvas in pixels
    background?: Color4                         // Background color of the canvas (optional, defaults to Color4.white)     
}

export class Blitter {
    private static instance: Blitter;           // Static instance of the Blitter singleton

    public width: number = 0;                   // Canvas width (default set to 0)
    public height: number = 0;                  // Canvas height (default set to 0)
    public background!: Color4;                 // Background color (default Color4.white)

    private clipping!: Clipping;                // Clipping region

    private canvas!: HTMLCanvasElement;         // HTML canvas element managed by the Blitter
    private context!: CanvasRenderingContext2D; // 2D rendering context of the canvas

    private backbuffer8!: ImageData;            // 8 bit buffer for the canvas (used for rendering)
    private backbuffer32!: Uint32Array;         // 32 bit view of the backbuffer for pixel manipulation

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
     *   - background (Color4, optional): The background color of the canvas.
     *     Defaults to Color4.white if not provided
     */
    public create({width, height, background = Color4.white}: CanvasParameters): void {
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.background = background;

        // Initialize the clipping region to match the canvas dimensions
        this.clipping = new Clipping(0, 0, this.width, this.height);

        // Create and configure the canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Retrieve the 2D rendering context
        this.context = this.canvas.getContext('2d')!;

        // Initialize the backbuffer for rendering
        this.backbuffer8 = this.context.getImageData(0, 0, this.width, this.height);
        this.backbuffer32 = new Uint32Array(this.backbuffer8.data.buffer);
    }

    /**
     * Appends the canvas element to the document's body, making it visible on the page.
     */
    public show(): void {
        document.body.appendChild(this.canvas);
    }

    /**
     * Renders the current backbuffer to the canvas.
     */
    public blit(): void {
        this.context.putImageData(this.backbuffer8, 0, 0);
    }

    /**
     * Plot a pixel at position x and y with desired color, supports clipping and another backbuffer
     * @param {number} x - The x position
     * @param {number} y - The y position
     * @param {number} color - The color in AABBGGRR format
     * @param {boolean} clip - True if clip, false if not (default is false)
     * @param {Uint32Array} backbuffer - The backbuffer to draw to, by default the backbuffer used as a double buffer
     */
  public putPixel(x: number, y: number, color: Color4, clip: boolean = false, backbuffer: Uint32Array = this.backbuffer32): void {
    if (clip) {
        if (x < this.clipping.minX || x >= this.clipping.maxX || y < this.clipping.minY || y >= this.clipping.maxY) {
            return;
        }
    }

    backbuffer[y * this.width + x] = color.toAABBGGRR();
  }
}