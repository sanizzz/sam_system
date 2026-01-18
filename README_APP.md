# Cold Calling Lead Aggregator

AI-agent-powered web application for generating local business leads with tailored cold calling pitches.

## Architecture

### Backend (Solace Agent Mesh)
- **OrchestratorAgent**: Coordinates the multi-agent workflow
- **LeadDiscoveryAgent**: Generates synthetic local business leads
- **WebsiteAuditAgent**: Analyzes businesses and identifies improvement opportunities
- **PitchDraftingAgent**: Creates personalized cold call pitches
- **LeadAggregatorAgent**: Compiles all data into a structured JSON artifact

### Frontend (Next.js)
- **`/` (Homepage)**: Landing page with project overview
- **`/intake`**: Form to collect freelancer information (type, location, services, etc.)
- **`/leads/[uuid]`**: Real-time display of agent activity via SSE with markdown rendering

### Communication
- Next.js communicates with SAM via the HTTP SSE Gateway
- Server-Sent Events (SSE) stream agent progress and results in real-time
- Gateway endpoint: `http://localhost:8000/api/v1`

## Quick Start

### 1. Set up environment variables
```bash
cp .env.example .env
# Add your LLM API credentials to .env
```

### 2. Start SAM backend
```bash
uv sync
uv run sam run configs/
```

This starts:
- Orchestrator agent
- 4 specialized agents (LeadDiscovery, WebsiteAudit, PitchDrafting, LeadAggregator)
- HTTP SSE Gateway on port 8000

### 3. Start Next.js frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Use the application
1. Navigate to `http://localhost:3000`
2. Click "Get Started"
3. Fill in the intake form:
   - Freelancer type (e.g., "web developer")
   - Location (e.g., "Ottawa, ON")
   - Services offered (e.g., "SEO, redesign, performance")
   - Target industries (optional)
   - Selling points (optional)
   - Number of leads (default: 25)
4. Submit and watch agents work in real-time
5. Review generated leads with tailored pitches

## Features

✅ Multi-agent AI collaboration via SAM
✅ Real-time SSE streaming of agent progress
✅ Markdown rendering of pitches
✅ Synthetic data generation (no external APIs)
✅ Session persistence with UUID
✅ Responsive UI with TailwindCSS

## Agent Workflow

1. User submits intake form → Creates task for OrchestratorAgent
2. Orchestrator delegates to LeadDiscoveryAgent → Generates business leads
3. Orchestrator delegates to WebsiteAuditAgent → Analyzes each business
4. Orchestrator delegates to PitchDraftingAgent → Creates personalized pitches
5. Orchestrator delegates to LeadAggregatorAgent → Compiles final JSON artifact
6. Frontend streams all progress messages and displays results

## Demo Constraints

- **No external APIs**: All business data and audit findings are synthetically generated
- **Synthetic data**: Realistic but fictional business information
- Focus on demonstrating SAM's multi-agent orchestration capabilities

## Development

### Backend Development
```bash
# Run SAM with specific configs
uv run sam run configs/

# Check logs
tail -f orchestrator-agent.log
```

### Frontend Development
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Lint code
```

### Adding New Agents
1. Create agent YAML in `configs/agents/`
2. Update orchestrator's `allow_list` in `configs/orchestrator.yaml`
3. Update orchestrator's `instruction` to include new agent in workflow

## Tech Stack

- **Backend**: Solace Agent Mesh 1.13.3, Python 3.11
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS
- **Markdown**: react-markdown with remark-gfm
- **Communication**: Server-Sent Events (EventSource)
