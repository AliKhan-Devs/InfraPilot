# InfraPilot Backend

The backend powers InfraPilot's agentic infrastructure workflow. It exposes HTTP endpoints for architecture generation and ZIP export, and broadcasts real-time workflow progress to the frontend with Socket.IO.

## Responsibilities

- Accept infrastructure prompts from the frontend
- Run the multi-stage LangGraph workflow
- Return blueprint data and generated Terraform
- Package generated Terraform into a downloadable ZIP archive
- Emit workflow stage updates such as `architecting`, `researching`, `coding`, `reviewing`, and `completed`

## Stack

- Express
- TypeScript
- Socket.IO
- LangGraph
- LangChain
- JSZip

## API endpoints

### `GET /health`

Returns a simple backend health response.

### `POST /api/v1/architect`

Accepts:

```json
{
  "prompt": "Design a secure AWS platform for a containerized application"
}
```

Returns a JSON payload containing:

- `success`
- `blueprint`
- `terraformCode`
- `securityReview`
- `history`

### `POST /api/v1/download-infra`

Accepts:

```json
{
  "terraformCode": "terraform ...",
  "projectName": "my-infra-project"
}
```

Returns a ZIP archive for download.

## Realtime events

Socket.IO is used to notify the frontend when workflow stages begin.

- Event: `node_start`
- Expected stage values: `architecting`, `researching`, `coding`, `reviewing`, `completed`, `error`

## Project layout

- `src/server.ts`: Express server, HTTP server, Socket.IO setup, route registration
- `src/socket.ts`: socket connection initialization
- `src/routes/agentRoutes.ts`: architecture generation route
- `src/routes/downloadRoutes.ts`: ZIP download route
- `src/controllers/agentController.ts`: request handling for the agent workflow
- `src/controllers/downloadController.ts`: archive generation logic
- `src/agents/graph.ts`: LangGraph workflow definition
- `src/agents/nodes/`: agent steps for architecture, research, coding, and review
- `src/agents/tools/`: tool integrations used by the workflow

## Setup

1. `cd backend`
2. `npm install`
3. Configure environment variables if needed
4. `npm run dev`

## Environment

- `PORT` defaults to `5000`
- CORS is currently configured for `http://localhost:5173`

## Development notes

- The backend package name is currently `archai-api`, but the product branding in the UI and docs is `InfraPilot`.
- The server is intended for local frontend integration and would need environment-based origin configuration for production use.
