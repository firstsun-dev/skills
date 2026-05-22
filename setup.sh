#!/bin/bash
# Firstsun Skill Arsenal Setup Script
# Version: 1.2.0

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_NAME="firstsun-dev/skills"

show_help() {
  echo "Usage: ./setup.sh [OPTIONS]"
  echo ""
  echo "Registers skills from the remote repository (default) or local folders into your AI agent environment."
  echo ""
  echo "Options:"
  echo "  -h, --help           Show this help message"
  echo "  -c, --custom         Register ONLY custom skills"
  echo "  -e, --external       Register ONLY external skills"
  echo "  -A, --all            Register everything (default)"
  echo "  -l, --local          Register using local paths instead of remote ($REPO_NAME)"
  echo "  -g, --global         Install globally (user-level) instead of project-local"
  echo "  -a, --agent <names>  Specify agents to install to (e.g. \"claude-code gemini\")"
  echo ""
  echo "Example:"
  echo "  ./setup.sh --custom --agent \"claude-code\""
}

MODE="all"
USE_REMOTE=true
SCOPE_FLAG=""
AGENT_FLAG=""

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -h|--help) show_help; exit 0 ;;
    -c|--custom) MODE="custom" ;;
    -e|--external) MODE="external" ;;
    -A|--all) MODE="all" ;;
    -l|--local) USE_REMOTE=false ;;
    -g|--global) SCOPE_FLAG="-g" ;;
    -a|--agent) AGENT_FLAG="--agent $2"; shift ;;
    *) echo "Unknown option: $1"; show_help; exit 1 ;;
  esac
  shift
done

echo "🚀 Registering skills in mode: $MODE"
echo "   Method: $([ "$USE_REMOTE" = true ] && echo "Remote ($REPO_NAME)" || echo "Local")"
echo "   Scope:  ${SCOPE_FLAG:-project-local}"
[ -n "$AGENT_FLAG" ] && echo "   Agents: ${AGENT_FLAG#--agent }"

register_skills() {
  local dir_type=$1
  if [ -d "$BASE_DIR/$dir_type" ]; then
    echo "--- Scanning $dir_type ---"
    find "$BASE_DIR/$dir_type" -name "SKILL.md" | while read -r skill_file; do
      skill_dir=$(dirname "$skill_file")
      rel_path="${skill_dir#$BASE_DIR/}"
      
      if [ "$USE_REMOTE" = true ]; then
        echo "📦 Registering (Remote): $REPO_NAME/$rel_path"
        npx skills add "$REPO_NAME/$rel_path" $SCOPE_FLAG $AGENT_FLAG -y < /dev/null
      else
        echo "📦 Registering (Local): $rel_path"
        npx skills add "$skill_dir" $SCOPE_FLAG $AGENT_FLAG -y < /dev/null
      fi
    done
  fi
}

if [ "$MODE" == "all" ] || [ "$MODE" == "custom" ]; then
  register_skills "custom"
fi

if [ "$MODE" == "all" ] || [ "$MODE" == "external" ]; then
  register_skills "external"
fi

echo "✅ Done!"
