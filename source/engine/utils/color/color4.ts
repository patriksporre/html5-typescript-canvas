/**
 * Project: html5-typescript-canvas
 * File: color4.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file defines the Color4 class, which represents a color with
 *   alpha, red, green, and blue components. It includes methods for
 *   creating colors from various formats and converting them to numeric
 *   representations.
 */

import { clamp } from "../../utils/helper.js"      // Helper functions

interface Color4Parameters {
    alpha?: number,                         // Alpha component (0-255), optional
    red?: number,                           // Red component (0-255), optional
    green?: number,                         // Green component (0-255), optional
    blue?: number,                          // Blue component (0-255), optional
    caching?: boolean                       // If to cache the color value, optional
}

export class Color4 {
    public alpha: number;                   // Alpha component (0-255)
    public red: number;                     // Red component (0-255)
    public green: number;                   // Green component (0-255)
    public blue: number;                    // Blue component (0-255)

    private cache: number | null = null;    // The numerical representation of the color
    private caching: boolean;               // To cache the numerical representation or not

    /**
     * Creates a new Color4 instance with optional alpha, red, green, and blue values.
     * 
     * @param {Color4Parameters} params - Object containing color parameters (alpha, red, green, blue)
     * Defaults to { alpha: 255, red: 0, green: 0, blue: 0 } if not provided
     */
    public constructor({alpha = 255, red = 0, green = 0, blue = 0, caching = true}: Color4Parameters = {}) {
        this.alpha = clamp(alpha, 0, 255);
        this.red = clamp(red, 0, 255);
        this.green = clamp(green, 0, 255);
        this.blue = clamp(blue, 0, 255);

        this.caching = caching;
    }
    /**
     * Sets the color components from a 32 bit integer in AABBGGRR format.
     * 
     * @param color - 32 bit integer representing the color
     * @returns The updated Color4 instance
     */
    public fromAABBGGRR(color: number): Color4 {
        this.alpha = (color >> 24) & 0xff;
        this.red = (color >> 0) & 0xff;
        this.green = (color >> 8) & 0xff;
        this.blue = (color >> 16) & 0xff;

        this.cache = color;

        return this;
    }

    /**
     * Sets the color components from a 32 bit integer in AARRGGBB format.
     * 
     * @param color - 32 bit integer representing the color
     * @returns The updated Color4 instance
     */
    public fromARRGGBB(color: number): Color4 {
        this.alpha = (color >> 24) & 0xff;
        this.red = (color >> 16) & 0xff;
        this.green = (color >> 8) & 0xff;
        this.blue = (color >> 0) & 0xff;

        this.cache = color;

        return this;
    }

    /**
     * Converts the current color instance to a 32 bit integer in AABBGGRR format.
     * 
     * @returns {number} A 32-bit integer representing the color in AABBGGRR format
     */
    public toAABBGGRR(): number {
        if (this.caching && this.cache === null) {
            this.cache = this.getAABBGGRR();
        }

        return this.cache ?? this.getAABBGGRR();
    }

    /**
     * Computes the 32 bit integer representation of the color in AABBGGRR format.
     * This helper centralizes the bitwise computation logic for reuse.
     * 
     * @returns A 32 bit integer representing the color
     */
    private getAABBGGRR(): number {
        return this.alpha << 24 | this.red << 0 | this.green << 8 | this.blue << 16;
    }

    /**
     * Converts the current color instance to a 32-bit integer in AARRGGBB format.
     * 
     * @returns {number} A 32-bit integer representing the color in AARRGGBB format
     */
    public toAARRGGBB(): number {
        if (this.caching && this.cache === null) {
            this.cache = this.getAARRGGBB();
        }

        return this.cache ?? this.getAARRGGBB();
    }

    /**
     * Computes the 32 bit integer representation of the color in AARRGGBB format.
     * This helper centralizes the bitwise computation logic for reuse.
     * 
     * @returns A 32 bit integer representing the color
     */
    private getAARRGGBB(): number {
        return this.alpha << 24 | this.red << 16 | this.green << 8 | this.blue << 0;
    }

    /**
     * Converts the color to a string representation.
     * 
     * @returns {string} A string representing the color in ARGB format
     */
    public toString(): string {
        return 'argb(' + this.alpha + ', ' + this.red + ', ' + this.green + ', ' + this.blue + ')';
    }

    // Predefined static colors
    static black = new Color4({alpha: 255, red: 0, green: 0, blue: 0}); 
    static white = new Color4({alpha: 255, red: 255, green: 255, blue: 255});
    static red = new Color4({alpha: 255, red: 255, green: 0, blue: 0});
    static green = new Color4({alpha: 255, red: 0, green: 255, blue: 0});
    static blue = new Color4({alpha: 255, red: 0, green: 0, blue: 255});
    static purple = new Color4({alpha: 255, red: 255, green: 0, blue: 255});
}