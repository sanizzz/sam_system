# Solace Agent Mesh Hackathon Quickstart

A hackathon-ready template for building and deploying [Solace Agent Mesh](https://github.com/SolaceLabs/solace-agent-mesh) (SAM) apps with custom agents, plus a demo product: **Cold Calling Lead Aggregator**.

## What You Get

- **Backend**: Multi-agent workflow powered by SAM (Python)
- **Frontend**: Next.js app with real-time SSE updates
- **Configs**: Ready-to-run agent definitions and orchestrator
- **Docs**: Deployment guides and AI-assisted dev setup

## Demo App: Cold Calling Lead Aggregator

AI-agent-powered web app that generates local business leads and tailored cold-call pitches.

### Agent Workflow

1. **LeadDiscoveryAgent** generates synthetic local business leads
2. **WebsiteAuditAgent** analyzes each business for opportunities
3. **PitchDraftingAgent** writes tailored cold-call pitches
4. **LeadAggregatorAgent** compiles a final JSON artifact
5. **OrchestratorAgent** coordinates the workflow end-to-end

### Frontend Routes

- `/` landing page
- `/intake` data collection form
- `/leads/[uuid]` live agent stream via SSE

## Quick Start

### 1. Prerequisites

- Python 3.11+
- Node.js 18+
- LLM API credentials

See [LLM setup guide](docs/llm-setup.md) for options.

### 2. Configure Environment

```bash
cp .env.example .env
# Add your LLM API credentials to .env
```

### 3. Start SAM Backend

```bash
uv sync
uv run sam run configs/
```

This starts the orchestrator, all agents, and the HTTP SSE gateway on `http://localhost:8000/api/v1`.

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` and click **Get Started**.

## Run & Deploy Options

| Platform | Guide                                           | When to Use                              |
| -------- | ----------------------------------------------- | ---------------------------------------- |
| Docker   | [Run with Docker](docs/deployment/docker.md)    | Quick start, no Python setup needed      |
| CLI      | [Run with CLI](docs/deployment/cli.md)          | Local dev, faster iteration (no rebuild) |
| Railway  | [Deploy to Railway](docs/deployment/railway.md) | Public deployment, sharing               |

For persistent storage across restarts, see [Persistent Storage with Supabase](docs/persistence.md).

## Project Structure

```
configs/
  agents/                # Agent YAML definitions
  orchestrator.yaml       # Orchestrator configuration
docs/                     # Setup and deployment guides
frontend/                 # Next.js app
src/                      # Custom Python tools
```

## Demo Examples

Agents showing progressive complexity:

| Level    | Agent                                                               | What It Does                                                            |
| -------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Basic    | [`changelog-basic.yaml`](configs/agents/changelog-basic.yaml)       | Instruction-only, no tools                                              |
| Enriched | [`changelog-enriched.yaml`](configs/agents/changelog-enriched.yaml) | Adds built-in artifact tools to save files                              |
| Advanced | [`changelog-github.yaml`](configs/agents/changelog-github.yaml)     | Custom Python tools ([`git_tools.py`](src/git_tools.py)) for GitHub API |
| Advanced | [`docs-agent.yaml`](configs/agents/docs-agent.yaml)                 | MCP integration (Context7) for live documentation lookup                |

Try: _"Generate a changelog for SolaceLabs/solace-agent-mesh"_ or _"Look up the Next.js App Router docs"_

## AI-Assisted Development

Pre-configured for [Google Antigravity](https://antigravity.google/), [Gemini CLI](https://github.com/google-gemini/gemini-cli), and [Claude Code](https://claude.ai/code) with [Context7](https://context7.com) for up-to-date SAM docs.

See [Vibe Coding Guide](docs/vibe-coding.md) for setup and known limitations.

## Resources

- [Solace Agent Mesh Documentation](https://solacelabs.github.io/solace-agent-mesh/docs/documentation/getting-started/introduction/)
