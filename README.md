# Mathora

> An AI-powered interactive calculus visualization tool that transforms mathematical concepts into dynamic, animated learning experiences.

## Vision

Mathora gives AI models a new superpower: the ability to create rich, animated visualizations to teach students mathematical concepts. Instead of static graphs or simple explanations, AI can now generate complex animation timelines that show functions morphing, integrals being calculated, and concepts coming to life through smooth, professional animations.

The goal is to enhance student learning by making abstract mathematical concepts tangible and intuitive through visual storytelling, powered by AI's understanding of both mathematics and pedagogy.

---

## Features

### Function Rendering & Animation
- **Real-time graphing** of mathematical functions using Three.js
- **Smooth curve rendering** with high-resolution point sampling
- **Animated transitions** - functions can morph to new equations with customizable duration
- **Dynamic domain changes** - animate `xmin` and `xmax` in real-time
- **Flicker-free updates** through intelligent interpolation

### Visual Integrals & Shading
- **Accurate region shading** between functions `f(x)` and `g(x)` or above/below the x-axis
- **Dynamic triangulated mesh** that updates as functions change
- **Smooth morphing** of shaded areas during function transitions
- **Stable geometry** with incremental interpolation for seamless animations

### Sliding Tangent Lines
- **Animated tangent lines** that slide along function curves
- **Dynamic range updates** - tangent can move between custom start and end points
- **Real-time updates** as functions morph or change
- **Smooth transitions** with customizable animation duration

### Camera Animation System
- **Smooth camera movements** to different positions during animations
- **Integrated with timeline actions** - any action can trigger camera movement
- **Automatic look-at behavior** - camera maintains focus on origin during movement
- **OrbitControls integration** - students can manually explore after animations complete

### Timeline-Based Animation System
- **Complex animation sequences** with precise timing control
- **Add, update, remove, and wait actions** for building rich narratives
- **Subtitle system** for synchronized explanations
- **Sequential and parallel animations** support
- **Camera control** - optional camera movement with each action

### AI-Powered Timeline Generation
- **Natural language input** - describe what you want to visualize in plain English
- **LLM-backed backend** generates complete animation timelines from prompts
- **Structured JSON output** following strict TypeScript schemas
- **Example**: "Show me how the integral of sin(x) changes as we shift it vertically"

### Professional UI
- **Custom axes and grid** with labeled tick marks
- **High-visibility design** optimized for educational use
- **Infinite grid plane** with fade distance for depth perception
- **Clean, modern interface** built with Next.js and Tailwind CSS

---

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **React Three Fiber** - 3D graphics in React
- **@react-three/drei** - Useful helpers (Grid, Line, Text components)
- **Three.js** - Core 3D rendering engine
- **Tailwind CSS** - Utility-first styling

### Backend
- **Node.js + Express** - RESTful API server
- **TypeScript** - Type-safe backend code
- **Zod** - Runtime schema validation
- **Google Gemini API** - LLM for timeline generation
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```
MathGPT/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx        # Main landing page
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── math/          # Math visualization components
│   │   │   ├── Axes.tsx   # Coordinate axes rendering
│   │   │   ├── Grid.tsx   # Grid plane
│   │   │   ├── MathScene.tsx  # Main 3D scene
│   │   │   ├── graphFunctions/      # Core visualization components
│   │   │   │   ├── FunctionPlot.tsx    # Function rendering
│   │   │   │   ├── ShadeArea.tsx      # Area shading
│   │   │   │   ├── Point2D.tsx        # Point rendering
│   │   │   │   ├── Label2D.tsx        # Text labels
│   │   │   │   └── slidingTangent.tsx # Sliding tangent lines
│   │   │   ├── cameraFunctions/
│   │   │   │   └── CameraAnimator.tsx # Camera animation system
│   │   │   └── timeline/
│   │   │       ├── TimelineController.tsx  # Animation controller
│   │   │       └── coreFunctionTests/      # Component test timelines
│   │   │           ├── functionPlotTimeline.ts
│   │   │           ├── shadeAreaTimeline.ts
│   │   │           ├── pointAndLabelTimeline.ts
│   │   │           ├── slidingTangentTimeline.ts
│   │   │           └── cameraTimeline.ts
│   │   ├── TeachingView.tsx  # Main teaching interface
│   │   ├── LandingScreen.tsx # Landing page component
│   │   └── MainView.tsx      # Graph view container
│   └── package.json
│
└── backend/                 # Express API server
    └── src/
        ├── index.ts        # Server entry point
        └── routes/
            ├── timeline.ts         # Timeline generation endpoint
            └── services/
                ├── llm.ts          # LLM integration (Gemini)
                ├── prompt.ts       # Prompt engineering
                └── schema.ts       # Zod validation schemas
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Google Gemini API Key** (get one at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MathGPT
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `backend/` directory:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (from `backend/` directory)
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend** (from `frontend/` directory)
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` and start visualizing!

---

## 📖 Usage

1. **Enter a mathematical prompt** on the landing screen
   - Example: "Show me the area between sin(x) and 0.3cos(x) from -π to π"
   - Example: "Graph y = x² and animate it shifting up by 2 units"

2. **Watch the AI generate** a complete animation timeline

3. **Observe the visualization** as functions animate, regions shade, and concepts come to life

4. **Use the controls** to toggle graph, whiteboard, and explanation panels

### Testing Individual Components

You can test individual visualization components by entering specific prompts on the landing screen:

- **"area test"** - Test the area shading functionality
- **"point test"** - Test point and label rendering
- **"function test"** - Test function plotting and animation
- **"tangent test"** - Test sliding tangent line animations
- **"camera test"** - Test camera movement and positioning

Each test runs a predefined timeline showcasing the specific component's capabilities. This makes it easy to verify functionality and see examples of each visualization type.

---

## Future Plans

### Enhanced AI Capabilities
- [ ] Support for 3D function visualization
- [ ] Multi-step problem solving with intermediate visualizations
- [ ] Interactive question-answering with contextual animations
- [ ] Support for parametric equations and polar coordinates

### New Visualization Components
- [ ] Riemann sum visualizations with animated rectangles
- [ ] Custom camera controller for more precise camera movements
- [ ] Additional animation types for specialized math concepts

### Educational Features
- [ ] Step-by-step problem breakdowns
- [ ] Interactive exercises with feedback
- [ ] Export animations as videos or GIFs
- [ ] Collaborative viewing and sharing
- [ ] Integration with learning management systems

### Technical Improvements
- [ ] Performance optimization for complex animations
- [ ] Mobile device support
- [ ] Offline mode with local LLM support
- [ ] Plugin system for custom visualization types
- [ ] Multi-language support

### UI/UX Enhancements
- [ ] Customizable themes and color schemes
- [ ] Accessibility improvements (screen reader support)
- [ ] Keyboard shortcuts for power users
- [ ] Undo/redo functionality
- [ ] Timeline editor for manual fine-tuning

---

## Testing

The project includes a comprehensive test suite for individual visualization components located in `frontend/components/math/timeline/coreFunctionTests/`. Each test provides a complete timeline demonstrating the component's functionality:

- `functionPlotTimeline.ts` - Tests function rendering and morphing
- `shadeAreaTimeline.ts` - Tests area shading between functions
- `pointAndLabelTimeline.ts` - Tests point and label placement
- `slidingTangentTimeline.ts` - Tests animated tangent line sliding
- `cameraTimeline.ts` - Tests camera movement and positioning

You can run these tests by entering specific prompts (see Usage section above) or by importing them directly in your code.

## Contributions
Currently me, Shourya Sheth and Saf Nasim are working on this
