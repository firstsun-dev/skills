#!/bin/bash
# Firstsun Skill Arsenal Export Script (Gem Sync)
# Version: 1.2.0

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_NAME="firstsun-dev/skills"
TARGET_ROOT="$BASE_DIR/custom"

show_help() {
  echo "Usage: ./export.sh <DOMAIN> [OPTIONS]"
  echo ""
  echo "Imports skills from the remote repository (default) or local arsenal to your current active project."
  echo ""
  echo "Arguments:"
  echo "  DOMAIN         The domain folder under custom/ (e.g., basic, develop, all)"
  echo ""
  echo "Options:"
  echo "  -h, --help     Show this help message"
  echo "  -l, --local    Register using local paths instead of remote ($REPO_NAME)"
  echo ""
  echo "Example:"
  echo "  ./export.sh basic"
  echo "  ./export.sh all --local"
}

DOMAIN=""
USE_REMOTE=true

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -h|--help) show_help; exit 0 ;;
    -l|--local) USE_REMOTE=false ;;
    *)
      if [ -z "$DOMAIN" ]; then
        DOMAIN=$1
      else
        echo "Unknown option: $1"
        show_help
        exit 1
      fi
      ;;
  esac
  shift
done

if [ -z "$DOMAIN" ]; then
  show_help
  exit 0
fi

SEARCH_PATH="$TARGET_ROOT/$DOMAIN"

if [ "$DOMAIN" == "all" ]; then
  SEARCH_PATH="$TARGET_ROOT"
elif [ ! -d "$SEARCH_PATH" ]; then
  echo "❌ Error: Domain '$DOMAIN' not found in $TARGET_ROOT"
  exit 1
fi

echo "🚀 Exporting skills to current project from domain: $DOMAIN"
echo "   Method: $([ "$USE_REMOTE" = true ] && echo "Remote ($REPO_NAME)" || echo "Local")"

find "$SEARCH_PATH" -name "SKILL.md" | while read -r skill_file; do
  skill_dir=$(dirname "$skill_file")
  rel_path="${skill_dir#$BASE_DIR/}"
  
  if [ "$USE_REMOTE" = true ]; then
    echo "🔗 Linking (Remote): $REPO_NAME/$rel_path"
    npx skills add "$REPO_NAME/$rel_path" -y < /dev/null
  else
    echo "🔗 Linking (Local): $rel_path"
    npx skills add "$skill_dir" -y < /dev/null
  fi
done

echo "✅ Done!"
