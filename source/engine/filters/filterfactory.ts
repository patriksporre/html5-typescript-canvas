/**
 * Project: html5-typescript-canvas
 * File: filterfactory.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements a factory class for creating instances of filters.
 *   The factory simplifies the creation process and ensures a consistent way
 *   to access different filter types within the engine.
 */

import { GrayscaleFilter } from "./grayscalefilter.js"; // GrayscaleFilter class for converting images to grayscale

/**
 * The FilterFactory class provides static methods to create filter instances.
 * 
 * This design centralizes the instantiation of filters, making the codebase
 * more modular and extensible. New filter types can easily be added to the
 * factory without modifying existing code.
 */
export class FilterFactory {
    /**
     * Creates an instance of the GrayscaleFilter.
     * 
     * The GrayscaleFilter processes an image or backbuffer by converting its
     * colors to grayscale using a weighted average formula.
     * 
     * @returns {GrayscaleFilter} A new instance of the GrayscaleFilter.
     */
    static createGrayscale(): GrayscaleFilter {
        return new GrayscaleFilter();
    }
}