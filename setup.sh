#!/bin/bash
# Yao Skill Arsenal Setup Script
# Version: 1.1.0

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
  echo "Usage: ./setup.sh [OPTIONS]"
  echo ""
  echo "Registers skills from local folders into your AI agent environment."
  echo ""
  echo "Options:"
  echo "  -h, --help     Show this help message"
  echo "  -c, --custom   Register ONLY custom skills"
  echo "  -e, --external Register ONLY external skills"
  echo "  -a, --all      Register everything (default)"
  echo ""
  echo "Example:"
  echo "  ./setup.sh --custom"
}

MODE="all"

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -h|--help) show_help; exit 0 ;;
    -c|--custom) MODE="custom" ;;
    -e|--external) MODE="external" ;;
    -a|--all) MODE="all" ;;
    *) echo "Unknown option: $1"; show_help; exit 1 ;;
  esac
  shift
done

echo "🚀 Registering skills in mode: $MODE"

register_skills() {
  local dir_type=$1
  if [ -d "$BASE_DIR/$dir_type" ]; then
    echo "--- Scanning $dir_type ---"
    find "$BASE_DIR/$dir_type" -name "SKILL.md" | while read -r skill_file; do
      skill_dir=$(dirname "$skill_file")
      echo "📦 Registering [$dir_type]: $(basename "$skill_dir")"
      npx skills add "$skill_dir" -y < /dev/null
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
