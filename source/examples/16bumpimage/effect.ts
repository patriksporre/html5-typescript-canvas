/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a dynamic bump mapping effect over an image. A moving 
 *   light source traverses a Lissajous curve to create a bumpy lighting effect, 
 *   emphasizing depth and texture based on a height map derived from the image.
 */

import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js"; // Bitmap image handler
import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Utility for RGBA color operations
import { Filter } from "../../engine/filters/filter.js";        // Interface for image filters
import { FilterFactory } from "../../engine/filters/filterfactory.js"; // Factory for creating filters
import { LissajousCurve } from "../../engine/utils/path/lissajous.js";  // Generator for Lissajous curves

// Global variable to hold the image object
const image: BitmapImage = new BitmapImage();

// Create an instance of the GrayscaleFilter using the FilterFactory
const filter: Filter = FilterFactory.createGrayscale();

let width: number;          // Screen width in pixels
let height: number;         // Screen height in pixels

type Point2D = { x: number, y: number }; // Represents a 2D point

let path: Point2D;         // Current position of the moving light source

let heightMap: Uint8Array; // Height map for the bump mapping effect
let light: LissajousCurve; // Lissajous curve representing the light source's movement

const color: Color4 = new Color4({ caching: false }); // Reusable Color4 object for pixel calculations

/**
 * Initializes the bump mapping effect.
 * 
 * Prepares the canvas, loads the Einstein image, applies a grayscale filter, and generates 
 * a height map based on the image's pixel data. Configures the Lissajous curve for the moving 
 * light source.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing canvas operations.
 */
export async function initialize(blitter?: Blitter) {
    console.log('16bumpimage | einstein bump');

    // Get canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    // Load the image and wait until it is fully loaded
    image.load("../../../images/einstein.png");
    await image.loading();
    
    // Pre-process the image with the GrayscaleFilter
    filter.process(image.data, image.width, image.height);

    // Generate the height map by extracting the red channel from the grayscale image
    heightMap = new Uint8Array(image.width * image.height);
    for (let i = 0; i < heightMap.length; i++) {
        const pixel: number = image.data[i];
        heightMap[i] = (pixel >> 16) & 0xff; // Extract the red channel (we only need one)
    }

    // Initialize the Lissajous curve for the moving light source
    light = new LissajousCurve({ a: 2, b: 3, width: width, height: height });
}

/**
 * Renders the bump mapping effect.
 * 
 * Computes the lighting and shading for each pixel based on the height map and the moving 
 * light source. The effect creates a dynamic interplay of light and shadow, emphasizing 
 * the image's texture.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    // Clear the canvas with a black background
    blitter.clear(Color4.black);

    // Update the light source's position along the Lissajous curve
    path = light.update(deltaTime, 0.3);

    // Process each pixel in the canvas
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index: number = y * width + x;

            // Compute height differences in x and y directions
            const dx: number = heightMap[index + 1] - heightMap[index - 1];
            const dy: number = heightMap[index + width] - heightMap[index - width];
            
            // Calculate the light direction vector
            const lx: number = path.x - x;
            const ly: number = path.y - y;
            const length: number = Math.sqrt((lx * lx) + (ly * ly));
            const normalizedLight: { x: number, y: number } = { x: lx / length, y: ly / length };

            // Calculate the lighting intensity using the dot product. Inverse because that suited the image
            const intensity: number = -(dx * normalizedLight.x + dy * normalizedLight.y);

            // Adjust brightness based on intensity
            const brightness: number = Math.max(0, Math.min(255, (intensity * 1.5) + 64));

            // Set pixel color based on brightness
            color.red = brightness;
            color.green = brightness;
            color.blue = brightness;
            
            // Write the computed color to the backbuffer
            blitter.backbuffer[index] = color.toAABBGGRR();
        }
    }
}