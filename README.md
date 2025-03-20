# glTF Animation Explorer

A powerful tool for exploring and testing animated glTF models for game development. Built with React, TypeScript, and React Three Fiber.

![glTF Animation Explorer](https://github.com/mrdoob/three.js/raw/dev/examples/screenshots/webgl_animation_skinning_morph.jpg)

## Features

- **Drag & Drop Loading**: Easily load glTF and GLB files with drag-and-drop functionality
- **Example Model**: Try the included RobotExpressive model with 14 different animations
- **Animation Controls**: View, play, and control all animations in your model
- **Animation Speed Control**: Adjust playback speed from 0.0x to 2.0x
- **Export Functionality**: Export THREE.AnimationAction data for use in your games
- **Dark Theme UI**: Modern dark interface that complements 3D content
- **Responsive Layout**: Works well on different screen sizes
- **Transform Controls**: Adjust position, rotation, and scale of your models
- **Scene Settings**: Customize the viewing environment with grid, axes, and background options

## Use Cases

- Test animations for your game models
- Compare different animation styles
- Adjust and fine-tune animation parameters
- Export animation settings for use in your game engine
- Quickly visualize and debug animations

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/glTF-explorer.git

# Navigate to the project directory
cd glTF-explorer

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. Launch the application using `npm run dev`
2. Either drag and drop a glTF/GLB file or click "Load Example Robot"
3. Use the animation controls in the right sidebar to play, pause, and adjust animations
4. Export animation data using the "Export" button for each animation
5. Adjust model position, rotation, and scale as needed

## Built With

- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Three.js**: 3D rendering library
- **React Three Fiber**: React renderer for Three.js
- **drei**: Useful helpers for React Three Fiber
- **Zustand**: State management

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js for the example RobotExpressive model
- The React Three Fiber community for their excellent documentation
