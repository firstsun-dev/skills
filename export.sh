#!/bin/bash
DOMAIN=$1
BASE_DIR="/home/tianyao/yao-agent-skills"
TARGET_ROOT="$BASE_DIR/custom"
echo "Importing skills to current project from domain: $DOMAIN"
SEARCH_PATH="$TARGET_ROOT/$DOMAIN"
[ "$DOMAIN" == "all" ] && SEARCH_PATH="$TARGET_ROOT"
find "$SEARCH_PATH" -name "SKILL.md" | while read -r skill_file; do
  skill_dir=$(dirname "$skill_file")
  npx skills add "$skill_dir" -y
done
