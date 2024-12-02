/**
 * Project: html5-typescript-canvas
 * File: bitmap.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file defines the Bitmap class, which represents a two-dimensional
 *   bitmap with configurable dimensions and an internal buffer for storing
 *   pixel data. The class provides a foundation for managing and manipulating
 *   bitmap images.
 */

/**
 * Parameters for constructing a Bitmap instance.
 * Both width and height are optional and default to 0.
 */
interface BitmapParameters {
    width?: number; // Width of the bitmap in pixels (default: 0)
    height?: number; // Height of the bitmap in pixels (default: 0)
}

export class Bitmap {
    public width: number; // Width of the bitmap in pixels
    public height: number; // Height of the bitmap in pixels
    public data: Uint32Array; // Internal buffer storing pixel data in AABBGGRR format

    /**
     * Creates a new Bitmap instance with the specified dimensions.
     * The internal buffer is initialized to store pixel data for the given width and height.
     * 
     * @param {BitmapParameters} [params] - Parameters for the bitmap dimensions
     * @param {number} [params.width=0] - The width of the bitmap (default: 0)
     * @param {number} [params.height=0] - The height of the bitmap (default: 0)
     */
    constructor({ width = 0, height = 0 }: BitmapParameters = {}) {
        this.width = Math.floor(width); // Ensure the width is an integer
        this.height = Math.floor(height); // Ensure the height is an integer

        // Initialize the pixel buffer to match the bitmap's dimensions
        this.data = new Uint32Array(this.width * this.height);
    }
}