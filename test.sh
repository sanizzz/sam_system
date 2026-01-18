#!/bin/bash
# Test script for the Cold Calling Lead Aggregator

echo "🚀 Cold Calling Lead Aggregator - Test Script"
echo "=============================================="
echo ""

# Check if SAM is configured
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy .env.example to .env and configure your LLM API credentials"
    exit 1
fi

echo "✅ Environment file found"

# Check Python dependencies
echo ""
echo "📦 Checking Python dependencies..."
if ! command -v uv &> /dev/null; then
    echo "❌ Error: uv is not installed"
    echo "Please install uv: https://docs.astral.sh/uv/"
    exit 1
fi

echo "✅ uv is installed"

# Sync Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
uv sync

# Check Node.js dependencies
echo ""
echo "📦 Checking Node.js dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing Node.js dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✅ Node.js dependencies installed"

# Start SAM backend in background
echo ""
echo "🎯 Starting SAM backend..."
echo "Agents: Orchestrator, LeadDiscovery, WebsiteAudit, PitchDrafting, LeadAggregator"
echo "Gateway: HTTP SSE on port 8000"
echo ""

# Kill any existing SAM processes
pkill -f "sam run" || true

# Start SAM
uv run sam run configs/ > sam_output.log 2>&1 &
SAM_PID=$!

echo "SAM started with PID: $SAM_PID"
echo "Waiting for SAM to initialize (20 seconds)..."
sleep 20

# Check if SAM is running
if ! ps -p $SAM_PID > /dev/null; then
    echo "❌ Error: SAM failed to start"
    echo "Check sam_output.log for details"
    cat sam_output.log
    exit 1
fi

echo "✅ SAM backend is running"

# Check if gateway is responding
echo ""
echo "🔍 Testing gateway endpoint..."
if curl -s http://localhost:8000/api/v1/version > /dev/null; then
    echo "✅ Gateway is responding"
else
    echo "❌ Error: Gateway is not responding"
    echo "Check sam_output.log for details"
    tail -n 50 sam_output.log
    kill $SAM_PID
    exit 1
fi

# Start Next.js frontend
echo ""
echo "🌐 Starting Next.js frontend..."
cd frontend
npm run dev > ../frontend_output.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "Frontend started with PID: $FRONTEND_PID"
echo "Waiting for frontend to initialize (10 seconds)..."
sleep 10

# Check if frontend is running
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo "❌ Error: Frontend failed to start"
    echo "Check frontend_output.log for details"
    cat frontend_output.log
    kill $SAM_PID
    exit 1
fi

echo "✅ Frontend is running"

echo ""
echo "=============================================="
echo "🎉 All systems are running!"
echo "=============================================="
echo ""
echo "📍 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Gateway:  http://localhost:8000"
echo ""
echo "📋 To test the application:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Click 'Get Started'"
echo "   3. Fill in the intake form:"
echo "      - Freelancer type: web developer"
echo "      - Location: Ottawa, ON"
echo "      - Services: SEO, redesign, performance"
echo "      - Lead count: 5 (for testing)"
echo "   4. Submit and watch the agents work!"
echo ""
echo "📝 Logs:"
echo "   SAM backend: sam_output.log"
echo "   Frontend: frontend_output.log"
echo ""
echo "🛑 To stop all services:"
echo "   kill $SAM_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to view logs, or run 'tail -f sam_output.log' in another terminal"
echo ""

# Keep script running and show logs
tail -f sam_output.log
