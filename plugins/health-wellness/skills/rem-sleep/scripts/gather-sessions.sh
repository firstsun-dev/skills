#!/bin/bash
# gather-sessions.sh - Collect recent session data for memory consolidation
# Usage: ./gather-sessions.sh [days_back] [--native]
#
# Options:
#   days_back   Number of days to look back (default: 3)
#   --native    Use native grep/jq instead of Repo Prompt

DAYS_BACK=${1:-3}
USE_NATIVE=false

# Check for --native flag
for arg in "$@"; do
    if [ "$arg" == "--native" ]; then
        USE_NATIVE=true
    fi
done

# OpenClaw session logs location (adjust if different)
SESSIONS_DIR="${OPENCLAW_SESSIONS:-$HOME/.openclaw/agents/main/sessions}"

# Repo Prompt CLI location (macOS)
RP_CLI="/Applications/Repo Prompt.app/Contents/MacOS/repoprompt-mcp"

echo "=== REM Sleep: Gathering Sessions (last $DAYS_BACK days) ==="
echo "Sessions directory: $SESSIONS_DIR"
echo ""

# Get cutoff date
if [[ "$OSTYPE" == "darwin"* ]]; then
    CUTOFF=$(date -v-${DAYS_BACK}d +%Y-%m-%d)
else
    CUTOFF=$(date -d "$DAYS_BACK days ago" +%Y-%m-%d)
fi

echo "Looking for sessions since: $CUTOFF"
echo ""

# Patterns to search for
PATTERNS=("decision" "learned" "important" "remember" "TODO" "preference" "mistake" "realized" "note to self")

# Check if Repo Prompt is available and not forcing native
if [ -f "$RP_CLI" ] && [ "$USE_NATIVE" = false ]; then
    echo "Using: Repo Prompt"
    echo ""
    
    # List recent session files
    echo "=== Recent Session Files ==="
    "$RP_CLI" -e "tree $SESSIONS_DIR" 2>/dev/null
    echo ""

    # Search for consolidation-worthy patterns
    for pattern in "${PATTERNS[@]}"; do
        echo ""
        echo "=== Searching: \"$pattern\" ==="
        "$RP_CLI" -e "search \"$pattern\" --context-lines 2" 2>/dev/null | head -50
    done
else
    echo "Using: Native grep/jq (Repo Prompt not found or --native specified)"
    echo ""
    
    # Check if sessions directory exists
    if [ ! -d "$SESSIONS_DIR" ]; then
        echo "Error: Sessions directory not found at $SESSIONS_DIR"
        echo "Set OPENCLAW_SESSIONS env var or adjust the script."
        exit 1
    fi
    
    # List recent session files
    echo "=== Recent Session Files ==="
    find "$SESSIONS_DIR" -name "*.jsonl" -mtime -${DAYS_BACK} -ls 2>/dev/null
    echo ""
    
    # Search for patterns using grep
    for pattern in "${PATTERNS[@]}"; do
        echo ""
        echo "=== Searching: \"$pattern\" ==="
        
        # Search in JSONL files, extract content field, grep for pattern
        find "$SESSIONS_DIR" -name "*.jsonl" -mtime -${DAYS_BACK} -exec cat {} \; 2>/dev/null | \
            jq -r 'select(.content != null) | "\(.role // "?"): \(.content)"' 2>/dev/null | \
            grep -i "$pattern" | head -30
        
        # If jq fails, fall back to raw grep
        if [ ${PIPESTATUS[1]} -ne 0 ]; then
            grep -r -i "$pattern" "$SESSIONS_DIR" --include="*.jsonl" 2>/dev/null | head -30
        fi
    done
fi

echo ""
echo "=== Gathering Complete ==="
echo ""
echo "Next steps:"
echo "1. Review the above for consolidation candidates"
echo "2. Update memory/$(date +%Y-%m-%d).md with today's events"
echo "3. Distill important learnings to MEMORY.md"
