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

interface Color4Parameters {
    alpha?: number,                     // Alpha component (0-255), optional
    red?: number,                       // Red component (0-255), optional
    green?: number,                     // Green component (0-255), optional
    blue?: number                       // Blue component (0-255), optional
}

export class Color4 {
    public alpha: number;               // Alpha component (0-255)
    public red: number;                 // Red component (0-255)
    public green: number;               // Green component (0-255)
    public blue: number;                // Blue component (0-255)

    private cache: number | null = null;    // The numerical representation of the color

    /**
     * Creates a new Color4 instance with optional alpha, red, green, and blue values.
     * 
     * @param {Color4Parameters} params - Object containing color parameters (alpha, red, green, blue)
     * Defaults to { alpha: 255, red: 0, green: 0, blue: 0 } if not provided
     */
    public constructor({alpha = 255, red = 0, green = 0, blue = 0}: Color4Parameters = {}) {
        this.alpha = this.clamp(alpha);
        this.red = this.clamp(red);
        this.green = this.clamp(green);
        this.blue = this.clamp(blue);
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
     * Converts the color components to a 32 bit integer in AABBGGRR format.
     * 
     * @returns A 32 bit integer representing the color
     */
    public toAABBGGRR(): number {
        if (this.cache === null) {
            this.cache = this.alpha << 24 | this.red << 0 | this.green << 8 | this.blue << 16;
        }
        return this.cache;
    }

    /**
     * Converts the color components to a 32 bit integer in AARRGGBB format.
     * 
     * @returns A 32 bit integer representing the color
     */
    public toAARRGGBB(): number {
        if (this.cache === null) {
            this.cache = this.alpha << 24 | this.red << 16 | this.green << 8 | this.blue << 0;
        }
        return this.cache;
    }

    /**
     * Clamps a given value to the range [0, 255] and converts it to an integer.
     * 
     * @param {number} value - The value to clamp
     * @returns {number} The clamped and floored value within the range [0, 255]
     */
    private clamp(value: number): number {
        return Math.max(0, Math.min(255, Math.floor(value)));
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
}