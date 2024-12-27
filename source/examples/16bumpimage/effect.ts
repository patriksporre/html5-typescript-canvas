/**
 * Project: html5-typescript-canvas
 * File: effect.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   Implements a dynamic bump mapping effect using real-time rendering and precomputed maps.
 *   The effect emphasizes depth and texture on an image derived from a height map.
 *   A moving light source, traversing a Lissajous curve, dynamically interacts with 
 *   the height map to create a visually engaging interplay of light and shadow.
 *
 *   The implementation supports three variants of bump mapping:
 *   1. Realtime computation for each pixel.
 *   2. Precomputed Phong map with combined diffuse and specular lighting.
 *   3. Precomputed environment map for efficient lighting.
 *
 *   The project demonstrates the use of height maps, normalized vectors, 
 *   and light models to achieve dynamic lighting effects.
 */

import { BitmapImage } from "../../engine/utils/bitmap/bitmapimage.js"; // Bitmap image handler
import { Blitter } from "../../engine/blitter.js";              // Blitter class for managing canvas operations
import { Color4 } from "../../engine/utils/color/color4.js";    // Utility for RGBA color operations
import { Filter } from "../../engine/filters/filter.js";        // Interface for image filters
import { FilterFactory } from "../../engine/filters/filterfactory.js"; // Factory for creating filters
import { LissajousCurve } from "../../engine/utils/path/lissajous.js";  // Generator for Lissajous curves

import { clamp } from "../../engine/utils/helper.js";

// Global variable to hold the image object
const image: BitmapImage = new BitmapImage(); // Stores the loaded image used for height map generation

// Create an instance of the GrayscaleFilter using the FilterFactory
const filter: Filter = FilterFactory.createGrayscale(); // Converts the image to grayscale for processing

// Canvas dimensions in pixels
let width: number;  // Screen width
let height: number; // Screen height

type Point2D = { x: number, y: number }; // Represents a 2D point or position in space

// Moving light source configuration
let path: Point2D;         // Current position of the light source along the Lissajous curve
let light: LissajousCurve; // Instance of LissajousCurve controlling the light source's motion

// Height map derived from the loaded image
let heightMap: Uint8Array; // A 1D array storing pixel heights for bump mapping calculations

// Environment map configuration
const environmentMapHeight: number = 256; // Height of the environment map
const environmentMapWidth: number = 256;  // Width of the environment map
const environmentMap: Uint8Array = new Uint8Array(environmentMapWidth * environmentMapHeight); // Precomputed environment map

// Phong map configuration
const phongMapHeight: number = 256; // Height of the Phong map
const phongMapWidth: number = 256;  // Width of the Phong map
const phongMap: Uint8Array = new Uint8Array(phongMapWidth * phongMapHeight); // Precomputed Phong map
const phongMapSpecularExponent: number = 50; // Specular exponent for Phong highlights

// Reusable Color4 object for efficient color calculations
const color: Color4 = new Color4({ caching: false }); 

// Active variant for rendering
let activeVariant: number = 1; // Default to realtime rendering

/**
 * Event listener for switching rendering variants based on keyboard input.
 */
window.addEventListener('keydown', switchActiveVariant);

/**
 * Handles keydown events to switch between rendering variants.
 * Updates the `activeVariant` based on the pressed key:
 * - '1': Realtime bump mapping
 * - '2': Phong map bump mapping
 * - '3': Environment map bump mapping
 * 
 * Logs the selected variant to the console for debugging.
 * 
 * @param {KeyboardEvent} event - The keyboard event triggering the variant switch
 */
function switchActiveVariant(event: KeyboardEvent) {
    if (event.key === '1') {
        activeVariant = 1;
        console.log('Realtime bump mapping');
    } else if (event.key === '2') {
        activeVariant = 2;
        console.log('Phong map bump mapping');
    } else if (event.key === '3') {
        activeVariant = 3;
        console.log('Environment map bump mapping');
    }
}

/**
 * Initializes the bump mapping effect.
 * 
 * This function sets up the bump mapping environment by:
 * - Configuring the canvas dimensions.
 * - Loading and processing the Einstein image to create a height map.
 * - Initializing the Lissajous curve for the light source's movement.
 * - Generating the environment map and Phong map with precomputed lighting values.
 * 
 * @param {Blitter} [blitter] - Optional instance of the Blitter class for managing canvas operations.
 */
export async function initialize(blitter?: Blitter) {
    console.log('16bumpimage | einstein bump');

    // Step 1: Configure canvas dimensions
    width = blitter?.clipping.maxX!;    // Maximum x-coordinate for clipping
    height = blitter?.clipping.maxY!;   // Maximum y-coordinate for clipping

    // Step 2: Load and process the Einstein image
    image.load("../../../images/einstein.png");  // Load image
    await image.loading();                       // Wait for the image to load

    // Apply grayscale filter to the image
    filter.process(image.data, image.width, image.height);

    // Generate the height map by extracting the red channel (grayscale values)
    heightMap = new Uint8Array(image.width * image.height);
    for (let i = 0; i < heightMap.length; i++) {
        const pixel: number = image.data[i];
        heightMap[i] = (pixel >> 16) & 0xff; // Extract the red channel
    }

    // Step 3: Initialize the Lissajous curve for the moving light source
    light = new LissajousCurve({ a: 2, b: 3, width: width, height: height });

    // Step 4: Generate precomputed lighting maps
    generateEnvironmentMap(environmentMap, environmentMapWidth, environmentMapHeight);  // Environment map
    generatePhongMap(phongMap, phongMapWidth, phongMapHeight, phongMapSpecularExponent); // Phong map
}

/**
 * Generates an environment map for bump mapping, containing precomputed lighting values.
 * 
 * The environment map represents diffuse lighting intensity based on surface normals within a 
 * unit circle. Values outside the unit circle are set to zero.
 * 
 * @param {Uint8Array} map - The environment map to populate.
 * @param {number} width - The width of the map.
 * @param {number} height - The height of the map.
 */
function generateEnvironmentMap(map: Uint8Array, width: number, height: number): void {
    let pointer: number = 0;

    for (let y = 0; y < height; y++) {
        const dy: number = (y - height / 2) / (height / 2); // Normalize y to [-1, 1]
        const dy2 = dy * dy;                                // Precompute dy squared
    
        for (let x = 0; x < width; x++) {
            const dx: number = (x - width / 2) / (width / 2); // Normalize x to [-1, 1]
            const dx2 = dx * dx;                              // Precompute dx squared
    
            const squared = dx2 + dy2; // Sum of squares for radius check
    
            map[pointer++] = squared > 1 
                ? 0 // Outside radius
                : Math.floor(Math.sqrt(1 - squared) * 255); // Compute intensity
        }
    }
}

/**
 * Generates a phong map for bump mapping, combining diffuse and specular lighting components.
 * 
 * The Phong map represents precomputed lighting values for surface normals within a unit circle. 
 * It accounts for diffuse lighting (dot product of the light vector and surface normal) and 
 * specular highlights (controlled by the specular exponent). Values outside the unit circle 
 * are set to zero.
 * 
 * @param {Uint8Array} map - The Phong map to populate.
 * @param {number} width - The width of the map.
 * @param {number} height - The height of the map.
 * @param {number} specularExponent - The specular exponent controlling the sharpness of highlights.
 */
function generatePhongMap(map: Uint8Array, width: number, height: number, specularExponent: number): void {
    let pointer: number = 0;

    for (let y = 0; y < height; y++) {
        const ny: number = (y - height / 2) / (height / 2); // Normalize y to [-1, 1]
        const ny2 = ny * ny;                                // Precompute ny squared
    
        for (let x = 0; x < width; x++) {
            const nx: number = (x - width / 2) / (width / 2); // Normalize x to [-1, 1]
            const nx2 = nx * nx;                              // Precompute nx squared
    
            const squared = nx2 + ny2; // Sum of squares for radius check
    
            if (squared > 1) {
                map[pointer++] = 0; // Outside the unit circle
                continue;
            }
    
            // Calculate the diffuse component
            const nz: number = Math.sqrt(1 - squared); // Compute the Z component of the normal
            const diffuse = nz;
    
            // Calculate the specular component
            const specular: number = Math.pow(nz, specularExponent);
    
            // Combine diffuse and specular lighting components
            const intensity: number = Math.floor((diffuse + specular) * 255);
            map[pointer++] = Math.min(255, intensity);
        }
    }
}

/**
 * Renders the bump mapping effect based on the active variant.
 * 
 * This function orchestrates the rendering process by determining which bump 
 * mapping technique to use based on the activeVariant setting. It supports:
 * - Realtime bump mapping (computing lighting per pixel dynamically).
 * - Phong map-based bump mapping (using precomputed diffuse and specular lighting values).
 * - Environment map-based bump mapping (using precomputed diffuse lighting values).
 * 
 * The light source's position is updated along a Lissajous curve, and the canvas 
 * is cleared before rendering begins. Depending on the selected variant, it delegates 
 * the rendering task to the corresponding method.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for managing canvas operations.
 * @param {number} elapsedTime - The total elapsed time since the effect started, in seconds.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
export function render(blitter: Blitter, elapsedTime: number, deltaTime: number) {
    // Clear the canvas with a black background
    blitter.clear(Color4.black);

    // Update the light source's position along the Lissajous curve
    path = light.update(deltaTime, 0.3);

    // Delegate rendering based on the selected variant
    switch (activeVariant) {
        case 1:
            renderRealtime(blitter, deltaTime);
            break;
        case 2:
            renderPhongMap(blitter, deltaTime);
            break;
        case 3:
            renderEnvironmentMap(blitter, deltaTime);
            break;
    }
}

/**
 * Computes and renders the bump mapping effect dynamically in real time.
 * 
 * This method calculates the lighting intensity for each pixel based on the 
 * height map and a moving light source. The dot product between the height 
 * differences (normals) and the light vector determines the brightness.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for canvas operations.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
function renderRealtime(blitter: Blitter, deltaTime: number) {
    for (let y = 1; y < height - 1; y++) { // Iterate over rows, excluding edges
        const rowHeightMap: number = y * width; // Precompute row offset in the height map

        // Calculate the light's vertical direction and square it
        const ly: number = path.y - y; // Vertical component of the light vector
        const ly2: number = ly * ly;   // Square of the vertical component

        for (let x = 1; x < width - 1; x++) { // Iterate over columns, excluding edges
            const index: number = rowHeightMap + x; // Compute 1D index for the current pixel

            // Compute height differences in x and y directions to approximate the surface normal
            const dx: number = heightMap[index + 1] - heightMap[index - 1]; // Horizontal difference
            const dy: number = heightMap[index + width] - heightMap[index - width]; // Vertical difference
            
            // Calculate the light's horizontal direction and square it
            const lx: number = path.x - x; // Horizontal component of the light vector
            const lx2: number = lx * lx;   // Square of the horizontal component

            // Compute the magnitude of the light vector
            const length: number = Math.sqrt(lx2 + ly2); // Length of the light vector
            const nLight: { x: number, y: number } = { x: lx / length, y: ly / length }; // Normalize light vector

            // Compute the lighting intensity as the dot product of the surface normal and the light vector
            // The result is inverted to suit the image's lighting effect
            const intensity: number = -(dx * nLight.x + dy * nLight.y);

            // Adjust and clamp brightness to ensure it remains within the valid range [0, 255]
            const brightness: number = Math.max(0, Math.min(255, (intensity * 1.5) + 64));

            // Assign brightness to the color object
            color.red = brightness;
            color.green = brightness;
            color.blue = brightness;
            
            // Write the computed color to the backbuffer at the current pixel's index
            blitter.backbuffer[index] = color.toAABBGGRR();
        }
    }
}

/**
 * Renders the bump mapping effect using a precomputed phong map.
 * 
 * The phong map is a specialized lighting map that includes both diffuse and 
 * specular lighting components. It uses surface normals and a fixed specular 
 * exponent to create realistic highlights. The function utilizes the renderWithMap 
 * helper to compute the lighting effect based on the Phong map.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for managing canvas operations.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
function renderPhongMap(blitter: Blitter, deltaTime: number) {
    renderWithMap(blitter, deltaTime, phongMap, phongMapWidth, phongMapHeight);
}

/**
 * Renders the bump mapping effect using a precomputed environment map.
 * 
 * The environment map stores precomputed lighting intensity values for various 
 * light directions. It is optimized for diffuse-only lighting and provides a 
 * simple and efficient method for rendering dynamic lighting effects. The function 
 * leverages the renderWithMap helper to apply the environment map.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for managing canvas operations.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 */
function renderEnvironmentMap(blitter: Blitter, deltaTime: number) {
    renderWithMap(blitter, deltaTime, environmentMap, environmentMapWidth, environmentMapHeight);
}


/**
 * Renders a bump-mapped effect using a given map (e.g., environment map or Phong map).
 * 
 * This function uses the provided map to compute pixel intensities based on the height map
 * and a moving light source. Only pixels within the non-zero regions of the map are rendered.
 * 
 * @param {Blitter} blitter - An instance of the Blitter class for managing canvas operations.
 * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
 * @param {Uint8Array} map - The map to use for rendering (e.g., environment map or Phong map).
 * @param {number} mapWidth - The width of the provided map.
 * @param {number} mapHeight - The height of the provided map.
 */
function renderWithMap(blitter: Blitter, deltaTime: number, map: Uint8Array, mapWidth: number, mapHeight: number) {
    // Calculate the top-left corner of the map relative to the canvas
    const px = Math.floor(path.x - mapWidth / 2);
    const py = Math.floor(path.y - mapHeight / 2);

    // Iterate through the map's height
    for (let y = 0; y < mapHeight; y++) {
        const ay = py + y; // Calculate the absolute y-coordinate on the canvas
        if (ay < 0 || ay >= height) continue; // Skip if out of bounds

        const rowHeightMap = ay * width; // Precompute the row index in the height map
        const rowMap = y * mapWidth;     // Precompute the row index in the map

        // Iterate through the map's width
        for (let x = 0; x < mapWidth; x++) {
            const ax = px + x; // Calculate the absolute x-coordinate on the canvas
            if (ax < 0 || ax >= width) continue; // Skip if out of bounds

            const indexHeightMap = rowHeightMap + ax; // Index in the height map
            const indexMap = rowMap + x;             // Index in the provided map

            // Skip pixels outside the non-zero region of the map
            if (map[indexMap] === 0) continue;

            // Compute height differences (normals) in x and y directions
            const dx = heightMap[indexHeightMap + 1] - heightMap[indexHeightMap - 1]; // Neighbors in x-direction
            const dy = heightMap[indexHeightMap + width] - heightMap[indexHeightMap - width]; // Neighbors in y-direction

            // Calculate the normalized coordinates (nx, ny) for the map lookup
            const nx = clamp(Math.floor(dx + x), 0, 255);
            const ny = clamp(Math.floor(dy + y), 0, 255);

            // Retrieve the brightness value from the map
            const brightness = map[(ny * mapWidth) + nx];

            // Set the pixel color based on brightness
            color.red = brightness;
            color.green = brightness;
            color.blue = brightness;

            // Write the computed color to the backbuffer
            blitter.backbuffer[indexHeightMap] = color.toAABBGGRR();
        }
    }
}






function renderEnvironmentMapPreview(blitter: Blitter) {
    const uint32EnvMap = convertUint8ToUint32(environmentMap);
    blitter.drawBuffer(256, 256, uint32EnvMap, 0, 0); // Draw the environment map at (0, 0)
}

function renderPhongMapPreview(blitter: Blitter) {
    const uint32EnvMap = convertUint8ToUint32(phongMap);
    blitter.drawBuffer(256, 256, uint32EnvMap, 0, 0); // Draw the environment map at (0, 0)
}

function convertUint8ToUint32(envMap: Uint8Array): Uint32Array {
    const size = envMap.length;
    const uint32Array = new Uint32Array(size);

    for (let i = 0; i < size; i++) {
        const intensity = envMap[i]; // Grayscale intensity
        uint32Array[i] = (255 << 24) | (intensity << 16) | (intensity << 8) | intensity; // ARGB format
    }

    return uint32Array;
}