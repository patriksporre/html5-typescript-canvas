/**
 * Project: html5-typescript-canvas
 * File: vector2.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements the Vector2 class for handling two-dimensional vectors.
 *   The Vector2 class provides basic functionality for working with 2D vectors,
 *   including initialization and cloning operations.
 */

/**
 * Represents the parameters for a two-dimensional vector, where each coordinate is optional.
 */
interface Vector2Parameters {
    x?: number; // The x-coordinate of the vector (default: 0)
    y?: number; // The y-coordinate of the vector (default: 0)
}

/**
 * Vector2 class for handling two-dimensional vectors. 
 * This class provides a simple representation of a 2D vector and includes 
 * methods for initialization and cloning.
 */
export class Vector2 {
    public x: number; // The x-coordinate of the vector
    public y: number; // The y-coordinate of the vector

    /**
     * Constructs a new Vector2 object.
     * 
     * @param {Vector2Parameters} vector2 - An object containing x and y coordinates.
     * Each coordinate is optional and defaults to 0 if not provided.
     */
    constructor({x = 0, y = 0}: Vector2Parameters = {}) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds the components of another vector to this vector.
     * 
     * This method modifies the current vector in place by adding the corresponding
     * components of the provided vector (other) to this vector's components.
     * 
     * @param {Vector2} other - The vector to add to this vector.
     * @returns {this} The updated vector (this instance) for chaining
     */
    public add(other: Vector2): this {
        this.x = this.x + other.x;
        this.y = this.y + other.y;

        return this;
    }

    /**
     * Subtracts the components of another vector from this vector.
     * 
     * This method modifies the current vector in place by subtracting the corresponding
     * components of the provided vector (other) from this vector's components.
     * 
     * @param {Vector2} other - The vector to subtract from this vector.
     * @returns {this} The updated vector (this instance) for chaining
     */
    public sub(other: Vector2): this {
        this.x = this.x - other.x;
        this.y = this.y - other.y;

        return this;
    }

    /**
     * Scales this vector by a scalar value.
     * 
     * This method modifies the current vector in place by multiplying each component
     * of the vector by the provided scalar.
     * 
     * @param {number} scalar - The value to scale the vector by.
     * @returns {this} The updated vector (this instance) for chaining.
     */
    public scale(scalar: number): this {
        this.x = this.x * scalar;
        this.y = this.y * scalar;

        return this;
    }

    /**
     * Creates a new Vector2 instance with the same x and y values as this vector.
     * 
     * @returns {Vector2} A new Vector2 object with identical x and y coordinates
     */
    public clone(): Vector2 {
        return new Vector2({x: this.x, y: this.y});
    }

    /**
     * Converts this vector to a string representation.
     * 
     * @returns {string} A string in the format "(x, y)"
     */
    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}