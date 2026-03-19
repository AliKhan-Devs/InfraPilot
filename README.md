# InfraPilot

InfraPilot is an AI-assisted cloud architecture and Terraform generation system. It takes a natural-language infrastructure prompt, runs it through a multi-stage agent workflow, returns a service blueprint, generates Terraform, and lets users export the result as a downloadable ZIP package.

## What it does

- Converts infrastructure requirements into a structured architecture plan
- Runs a staged workflow across architecture, research, code generation, and review
- Produces Terraform output for the proposed system
- Visualizes the resulting service blueprint in the frontend
- Streams workflow progress to the UI with Socket.IO
- Exports generated infrastructure artifacts as a ZIP file

## Repository structure

- `backend/`: Express + TypeScript API, LangGraph workflow, download endpoints, Socket.IO server
- `frontend/`: React + Vite application for prompting, reviewing output, and viewing the architecture map

## Tech stack

- Frontend: React, Vite, Tailwind CSS v4, Socket.IO client, React Flow
- Backend: Express, TypeScript, Socket.IO, LangGraph, LangChain, JSZip

## Local development

1. Start the backend:
   `cd backend`
   `npm install`
   `npm run dev`
2. Start the frontend in a second terminal:
   `cd frontend`
   `npm install`
   `npm run dev`

## Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

## Workflow overview

1. User enters an infrastructure prompt in the frontend.
2. Frontend sends the prompt to `POST /api/v1/architect`.
3. Backend runs the agent graph through architecture, research, code, and review stages.
4. Socket.IO emits stage progress updates to the UI.
5. Frontend renders Terraform output and a visual blueprint.
6. User can export the generated infrastructure bundle through `POST /api/v1/download-infra`.

## Core features

- Monochrome, portfolio-ready frontend UI
- Prompt-driven infrastructure design flow
- Terraform code output panel
- Architecture map powered by React Flow
- Research note surfacing in the UI
- Downloadable ZIP packaging for generated infrastructure

## Documentation

- Backend documentation: `backend/README.md`
- Frontend documentation: `frontend/README.md`

## Current notes

- The app is currently configured for local development with the frontend calling `http://localhost:5000`.
- CORS and Socket.IO origin settings are set for `http://localhost:5173`.
- Production deployment would benefit from environment-based API and frontend origin configuration.
