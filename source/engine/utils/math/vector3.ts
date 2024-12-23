/**
 * Project: html5-typescript-canvas
 * File: vector3.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file implements the Vector3 class for handling three-dimensional vectors.
 *   The Vector3 class provides basic functionality for working with 3D vectors,
 *   including initialization and cloning operations.
 */

/**
 * Represents the parameters for a three-dimensional vector, where each coordinate is optional.
 */
interface Vector3Parameters {
    x?: number; // The x-coordinate of the vector (default: 0)
    y?: number; // The y-coordinate of the vector (default: 0)
    z?: number; // The z-coordinate of the vector (default: 0)
}

/**
 * Vector3 class for handling three-dimensional vectors. 
 * This class provides a simple representation of a 3D vector and includes 
 * methods for initialization and cloning.
 */
export class Vector3 {
    public x: number; // The x-coordinate of the vector
    public y: number; // The y-coordinate of the vector
    public z: number; // The z-coordinate of the vector

    /**
     * Constructs a new Vector3 object.
     * 
     * @param {Vector3Parameters} vector3 - An object containing x and y coordinates.
     * Each coordinate is optional and defaults to 0 if not provided.
     */
    constructor({x = 0, y = 0, z = 0}: Vector3Parameters = {}) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Adds the components of another vector to this vector.
     * 
     * This method modifies the current vector in place by adding the corresponding
     * components of the provided vector (other) to this vector's components.
     * 
     * @param {Vector3} other - The vector to add to this vector.
     * @returns {this} The updated vector (this instance) for chaining
     */
    public add(other: Vector3): this {
        this.x = this.x + other.x;
        this.y = this.y + other.y;
        this.z = this.z + other.z;

        return this;
    }

    /**
     * Subtracts the components of another vector from this vector.
     * 
     * This method modifies the current vector in place by subtracting the corresponding
     * components of the provided vector (other) from this vector's components.
     * 
     * @param {Vector3} other - The vector to subtract from this vector.
     * @returns {this} The updated vector (this instance) for chaining
     */
    public sub(other: Vector3): this {
        this.x = this.x - other.x;
        this.y = this.y - other.y;
        this.z = this.z - other.z;

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
        this.z = this.z * scalar;

        return this;
    }

    /**
     * Creates a new Vector3 instance with the same x, y and z values as this vector.
     * 
     * @returns {Vector3} A new Vector3 object with identical x, y and z coordinates
     */
    public clone(): Vector3 {
        return new Vector3({x: this.x, y: this.y, z: this.z});
    }

    /**
     * Converts this vector to a string representation.
     * 
     * @returns {string} A string in the format "(x, y, z)"
     */
    public toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
}