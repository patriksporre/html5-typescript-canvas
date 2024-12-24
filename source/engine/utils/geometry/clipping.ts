/**
 * Project: html5-typescript-canvas
 * File: clipping.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file defines the Clipping class, which represents a rectangular
 *   area for managing spatial boundaries in rendering operations.
 */

export class Clipping {
  /**
   * Internal storage for the clipping bounds using an Int16Array.
   * Bounds are stored in the following order:
   * - bounds[0] = minX
   * - bounds[1] = minY
   * - bounds[2] = maxX
   * - bounds[3] = maxY
   */
  private bounds: Int16Array;

  /**
   * Constructs a new Clipping instance with the specified bounds.
   *
   * @param minX - The minimum X coordinate of the clipping area
   * @param minY - The minimum Y coordinate of the clipping area
   * @param maxX - The maximum X coordinate of the clipping area
   * @param maxY - The maximum Y coordinate of the clipping area
   */
  constructor(minX: number, minY: number, maxX: number, maxY: number) {
    this.bounds = new Int16Array([minX, minY, maxX, maxY]);
  }

  /**
   * Retrieves the minimum X coordinate of the clipping area.
   * @returns The minimum X coordinate
   */
  get minX(): number {
    return this.bounds[0];
  }

  /**
   * Retrieves the minimum Y coordinate of the clipping area.
   * @returns The minimum Y coordinate
   */
  get minY(): number {
    return this.bounds[1];
  }

  /**
   * Retrieves the maximum X coordinate of the clipping area.
   * @returns The maximum X coordinate
   */
  get maxX(): number {
    return this.bounds[2];
  }

  /**
   * Retrieves the maximum Y coordinate of the clipping area.
   * @returns The maximum Y coordinate
   */
  get maxY(): number {
    return this.bounds[3];
  }

  /**
   * Checks if a point is inside the clipping area.
   *
   * @param x - The X coordinate of the point
   * @param y - The Y coordinate of the point
   * @returns True if the point is inside, otherwise false
   */
  public inside(x: number, y: number): boolean {
    return (
      x >= this.bounds[0] &&
      x <= this.bounds[2] &&
      y >= this.bounds[1] &&
      y <= this.bounds[3]
    );
  }

  /**
   * Checks if a point is outside the clipping area.
   *
   * @param x - The X coordinate of the point
   * @param y - The Y coordinate of the point
   * @returns True if the point is outside, otherwise false
   */
    public outside(x: number, y: number): boolean {
      return (
        x < this.bounds[0] ||
        x >= this.bounds[2] ||
        y < this.bounds[1] ||
        y >= this.bounds[3]
      );
    }
}
