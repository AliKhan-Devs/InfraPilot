# InfraPilot Frontend

The frontend is the user-facing interface for InfraPilot. It lets users describe cloud infrastructure requirements, watch the agent workflow progress in real time, inspect generated Terraform, and view the resulting architecture map.

## Main user experience

- Enter a prompt describing the target system
- Run the architecture generation workflow
- Follow progress through the plan, research, code, and review stages
- Inspect generated Terraform in the output panel
- Switch to a visual blueprint view for the generated services
- Export the generated infrastructure ZIP package

## Stack

- React
- Vite
- Tailwind CSS v4
- Axios
- Socket.IO client
- `@xyflow/react` for architecture visualization
- Lucide React for icons

## Key files

- `src/App.jsx`: top-level layout, API calls, socket event handling, download flow
- `src/components/PromptPanel.jsx`: prompt input and primary action
- `src/components/StatusStepper.jsx`: pipeline stage indicator
- `src/components/OutputPanel.jsx`: Terraform and blueprint summary tabs
- `src/components/ArchitectureDiagram.jsx`: React Flow based architecture map
- `src/index.css`: global theme and React Flow styling
- `src/main.jsx`: app bootstrap and React Flow stylesheet import

## API integration

The frontend expects the backend to be available at `http://localhost:5000`.

- `POST /api/v1/architect`
- `POST /api/v1/download-infra`
- Socket.IO connection to `http://localhost:5000`

## Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:5173`

## Build commands

- Development: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`

## UI notes

- The current interface uses a monochrome visual system intended to feel more professional and portfolio-ready.
- The architecture canvas uses React Flow with custom node styling and a simplified infrastructure pipeline layout.
- The frontend is currently wired to local backend URLs and should be moved to environment variables for deployment.
