#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

OLLAMA_STARTED=false
BACKEND_PID=""
FRONTEND_PID=""

echo "======================================"
echo "        AgentPay - Inicialização"
echo "======================================"

# --------------------------------------
# Verificar Ollama
# --------------------------------------

echo ""
echo "▶ Verificando Ollama..."

if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✓ Ollama já está rodando."
else
    echo "▶ Ollama não está rodando."
    echo "▶ Iniciando Ollama..."

    ollama serve > /tmp/agentpay-ollama.log 2>&1 &
    OLLAMA_PID=$!
    OLLAMA_STARTED=true

    echo "✓ Ollama iniciado (PID: $OLLAMA_PID)"

    echo "▶ Aguardando Ollama ficar disponível..."

    for i in {1..30}; do
        if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
            echo "✓ Ollama está pronto."
            break
        fi

        sleep 1
    done
fi

# --------------------------------------
# Verificar modelo
# --------------------------------------

echo ""
echo "▶ Verificando modelo qwen3:1.7b..."

if ollama list | grep -q "qwen3:1.7b"; then
    echo "✓ Modelo qwen3:1.7b encontrado."
else
    echo "❌ Modelo qwen3:1.7b não encontrado."
    echo ""
    echo "Execute:"
    echo "    ollama pull qwen3:1.7b"
    echo ""

    exit 1
fi

# --------------------------------------
# Backend
# --------------------------------------

echo ""
echo "▶ Iniciando Backend..."

cd "$ROOT_DIR/backend"

npm start > /tmp/agentpay-backend.log 2>&1 &
BACKEND_PID=$!

echo "✓ Backend iniciado (PID: $BACKEND_PID)"

sleep 3

# --------------------------------------
# Frontend
# --------------------------------------

echo ""
echo "▶ Iniciando Frontend..."

cd "$ROOT_DIR/frontend"

npm run dev -- --host 0.0.0.0 > /tmp/agentpay-frontend.log 2>&1 &
FRONTEND_PID=$!

echo "✓ Frontend iniciado (PID: $FRONTEND_PID)"

# --------------------------------------
# Informações
# --------------------------------------

echo ""
echo "======================================"
echo "       AgentPay iniciado!"
echo "======================================"
echo ""
echo "Ollama:   http://localhost:11434"
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Modelo:   qwen3:1.7b"
echo ""
echo "Logs:"
echo "Ollama:   tail -f /tmp/agentpay-ollama.log"
echo "Backend:  tail -f /tmp/agentpay-backend.log"
echo "Frontend: tail -f /tmp/agentpay-frontend.log"
echo ""
echo "Pressione CTRL+C para encerrar."
echo ""

# --------------------------------------
# Encerramento
# --------------------------------------

cleanup() {

    echo ""
    echo "======================================"
    echo "Encerrando AgentPay..."
    echo "======================================"

    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi

    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    if [ "$OLLAMA_STARTED" = true ] && [ -n "$OLLAMA_PID" ]; then
        kill "$OLLAMA_PID" 2>/dev/null || true
    fi

    echo "✓ Processos encerrados."
}

trap cleanup SIGINT SIGTERM

wait