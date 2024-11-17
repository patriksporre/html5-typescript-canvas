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
    alpha?: number,         // Alpha component (0-255)
    red?: number,           // Red component (0-255)
    green?: number,         // Green component (0-255)
    blue?: number           // Blue component (0-255)
}

export class Color4 {
    public alpha: number;   // Alpha component (0-255)
    public red: number;     // Red component (0-255)
    public green: number;   // Green component (0-255)
    public blue: number;    // Blue component (0-255)

    static black = new Color4({alpha: 255, red: 0, green: 0, blue: 0});         // Predefined static color: black
    static white = new Color4({alpha: 255, red: 255, green: 255, blue: 255});   // Predefined static color: white
    static red = new Color4({alpha: 255, red: 255, green: 0, blue: 0});         // Predefined static color: red
    static green = new Color4({alpha: 255, red: 0, green: 255, blue: 0});       // Predefined static color: green
    static blue = new Color4({alpha: 255, red: 0, green: 0, blue: 255});        // Predefined static color: blue

    /**
     * Creates a new Color4 instance with optional alpha, red, green, and blue values.
     * 
     * @param params - Object containing color parameters (alpha, red, green, blue)
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

        return this;
    }

    /**
     * Converts the color components to a 32 bit integer in AABBGGRR format.
     * 
     * @returns A 32 bit integer representing the color
     */
    public toAABBGGRR(): number {
        return this.alpha << 24 | this.red << 0 | this.green << 8 | this.blue << 16;
    }

    /**
     * Converts the color components to a 32 bit integer in AARRGGBB format.
     * 
     * @returns A 32 bit integer representing the color
     */
    public toAARRGGBB(): number {
        return this.alpha << 24 | this.red << 16 | this.green << 8 | this.blue << 0;
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
}