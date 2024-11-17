
# html5-typescript-canvas

This repository demonstrates low-level pixel operations on an HTML5 canvas using TypeScript. The focus is on a "C"-style programming approach, prioritizing minimalism and direct control without relying on third party libraries or language extensions.

## Key Features
- **Low-level pixel operations**: direct manipulation of the canvas at the pixel level
- **TypeScript implementation**: strong typing and modern JavaScript features for maintainable code
- **Minimal dependencies**: no heavy frameworks or libraries - just lean and mean, straightforward programming

## Getting Started

### 1. Install Required Tools
Ensure you have the following tools installed:
- **TypeScript**: Install globally with:
  ```bash
  npm install -g typescript
  ```
- **http-server**: Install globally with:
  ```bash
  npm install -g http-server
  ```

### 2. Start the TypeScript Watcher
Run the following command in the project root to monitor changes to `.ts` files and compile them automatically:
```bash
tsc --watch
```

### 3. Start the Local Web Server
In a separate terminal, run the following command to serve the project files locally:
```bash
http-server --cors -c-1
```

Once started, navigate to the provided URL (e.g., `http://127.0.0.1:8080`) to view the project.

### 4. Stopping the Processes
- To stop the **TypeScript Watcher**, press `Ctrl + C` in the terminal running `tsc --watch`
- To stop the **Local Web Server**, press `Ctrl + C` in the terminal running `http-server`

## License
This project is licensed under the MIT License.

## Author
Developed by Patrik Sporre.