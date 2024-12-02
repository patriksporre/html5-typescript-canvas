/**
 * Project: html5-typescript-canvas
 * File: bitmapimage.ts
 * Author: Patrik Sporre
 * License: MIT
 * Description:
 *   This file defines the BitmapImage class, which extends the Bitmap class and
 *   provides functionality for loading image resources asynchronously. The class
 *   utilizes an offscreen canvas for processing image data and provides a promise
 *   to handle loading states.
 */

import { Bitmap } from "./bitmap.js";

export class BitmapImage extends Bitmap {
    private image: HTMLImageElement = new Image(); // HTMLImageElement for loading the image
    private canvas: HTMLCanvasElement = document.createElement('canvas'); // Offscreen canvas for image processing
    private context: CanvasRenderingContext2D = this.canvas.getContext('2d')!; // Canvas 2D context for drawing
    
    private bitmap8!: ImageData; // ImageData representing the loaded image
    
    private loadingState: Promise<void>; // Promise to track the image loading state

    /**
     * Initializes the BitmapImage instance and prepares the promise to track the loading state.
     */
    constructor() {
        super();

        this.loadingState = new Promise((resolve, reject) => {
            this.image.onload = () => {
                this.loader();
                resolve(); // Resolve the promise when the image is successfully loaded
            };

            this.image.onerror = () => {
                reject(new Error('Failed to load image')); // Reject the promise if the image fails to load
            };
        });
    }

    /**
     * Loads the image from the specified URL.
     * 
     * @param {string} url - The URL of the image to load.
     */
    public load(url: string): void {
        this.image.src = url;
    }

    /**
     * Returns the promise representing the image loading state.
     * Allows the caller to wait until the image is fully loaded.
     * 
     * @returns {Promise<void>} A promise that resolves when the image is loaded.
     */
    public loading(): Promise<void> {
        return this.loadingState;
    }

    /**
     * Handles the onload event for the image and populates the bitmap data.
     */
    private loader(): void {
        this.width = this.image.width;
        this.height = this.image.height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.context.drawImage(this.image, 0, 0);

        this.bitmap8 = this.context.getImageData(0, 0, this.width, this.height);
        this.data = new Uint32Array(this.bitmap8.data.buffer); // Update the Bitmap data with the image's pixel data
    }
}