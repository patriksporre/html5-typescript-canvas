/**
 * Project: html5-typescript-canvas
 * File: filter.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Defines the Filter interface for implementing image filters that operate
 *   on a backbuffer. All filters must implement the process method.
 */

/**
 * Filter Interface
 * 
 * Represents an image filter that can process a backbuffer. 
 * Filters implement the process method, which modifies the pixels in 
 * the backbuffer based on specific filter logic.
 */
export interface Filter {
    /**
     * Processes the backbuffer to apply a filter effect.
     * 
     * @param {Uint32Array} backbuffer - The backbuffer containing the image pixels
     * @param {number} width - The width of the image in pixels
     * @param {number} height - The height of the image in pixels
     * 
     * This method should implement the logic to transform the backbuffer.
     */
    process(backbuffer: Uint32Array, width: number, height: number): void;
}