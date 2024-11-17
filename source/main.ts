window.addEventListener('load', initialize);

function initialize(): void {
    requestAnimationFrame(main);        // start the main() loop
}

function main(): void {
    requestAnimationFrame(main);
}