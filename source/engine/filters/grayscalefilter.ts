/**
 * Project: html5-typescript-canvas
 * File: grayscalefilter.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a GrayscaleFilter that processes an image by converting each pixel 
 *   to grayscale using a weighted average of the red, green, and blue channels.
 */

import { BaseFilter } from "./basefilter.js"; // Base class for implementing image filters

/**
 * GrayscaleFilter class
 * 
 * Converts an image to grayscale by processing each pixel in the backbuffer.
 * The conversion is based on the standard luminosity formula:
 *   gray = 0.299 * red + 0.587 * green + 0.114 * blue
 * 
 * The alpha channel is preserved.
 */
export class GrayscaleFilter extends BaseFilter {
    /**
     * Processes the backbuffer and applies the grayscale effect.
     * 
     * @param {Uint32Array} backbuffer - The backbuffer containing the image pixels
     * @param {number} width - The width of the image in pixels
     * @param {number} height - The height of the image in pixels
     */
    process(backbuffer: Uint32Array, width: number, height: number): void {
        for (let i = 0; i < backbuffer.length; i++) {
            const pixel: number = backbuffer[i]; // Extract the current pixel

            // Extract individual color channels (red, green, blue) and alpha
            const channels = this.extractChannels(pixel);

            // Calculate the grayscale value using the luminosity formula
            const gray = Math.round(0.299 * channels.red + 0.587 * channels.green + 0.114 * channels.blue);

            // Reconstruct the pixel with the grayscale value and the original alpha channel
            backbuffer[i] = (pixel & 0xff000000) | (gray << 16) | (gray << 8) | gray;
        }
    }
}