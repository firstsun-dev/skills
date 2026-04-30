#!/bin/bash
# Yao Skill Arsenal Export Script (Gem Sync)
# Version: 1.1.0

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_ROOT="$BASE_DIR/custom"

show_help() {
  echo "Usage: ./export.sh <DOMAIN> [OPTIONS]"
  echo ""
  echo "Imports local custom skills to your current active project."
  echo ""
  echo "Arguments:"
  echo "  DOMAIN         The domain folder under custom/ (e.g., basic, develop, all)"
  echo ""
  echo "Options:"
  echo "  -h, --help     Show this help message"
  echo ""
  echo "Example:"
  echo "  ./export.sh basic"
  echo "  ./export.sh all"
}

DOMAIN=""

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -h|--help) show_help; exit 0 ;;
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

find "$SEARCH_PATH" -name "SKILL.md" | while read -r skill_file; do
  skill_dir=$(dirname "$skill_file")
  echo "🔗 Linking: $(basename "$skill_dir")"
  npx skills add "$skill_dir" -y < /dev/null
done

echo "✅ Done!"
