/**
 * Project: html5-typescript-canvas
 * File: basefilter.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Provides an abstract base class for implementing image filters. Includes 
 *   utility methods for extracting and reconstructing color channels.
 */

import { Filter } from "./filter.js"; // Filter interface definition

/**
 * BaseFilter class
 * 
 * Abstract base class for image filters. Provides a blueprint for creating 
 * filters with the process method that operates on a backbuffer. 
 * Includes utility methods for handling pixel color data.
 */
export abstract class BaseFilter implements Filter {
    /**
     * Abstract method to process the backbuffer.
     * 
     * @param {Uint32Array} backbuffer - The backbuffer containing the image pixels
     * @param {number} width - The width of the image in pixels
     * @param {number} height - The height of the image in pixels
     * 
     * This method must be implemented by subclasses to define specific filter logic.
     */
    abstract process(backbuffer: Uint32Array, width: number, height: number): void;

    /**
     * Extracts the red, green, and blue channels from a pixel.
     * 
     * @param {number} pixel - A 32 bit integer in AABBGGRR format
     * @returns {Object} An object containing the red, green, and blue channel values
     */
    protected extractChannels(pixel: number): {red: number, green: number, blue: number} {
        const red = (pixel >> 0) & 0xff;     // Extract red channel
        const green = (pixel >> 8) & 0xff;   // Extract green channel
        const blue = (pixel >> 16) & 0xff;   // Extract blue channel

        return {red, green, blue};
    }

    /**
     * Constructs a 32 bit pixel in AABBGGRR format from its components.
     * 
     * @param {number} alpha - The alpha channel value (0-255)
     * @param {number} red - The red channel value (0-255)
     * @param {number} green - The green channel value (0-255)
     * @param {number} blue - The blue channel value (0-255)
     * @returns {number} A 32 bit integer representing the color in AABBGGRR format
     */
    protected toAABBGGRR(alpha: number, red: number, green: number, blue: number): number {
        return (alpha << 24) | (red << 0) | (green << 8) | (blue << 16);
    }
}