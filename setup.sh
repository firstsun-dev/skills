#!/bin/bash
BASE_DIR="/home/tianyao/yao-agent-skills"
echo "🚀 Registering skills from custom/ and external/..."

# 遍歷兩個頂層目錄
for TYPE in custom external; do
  if [ -d "$BASE_DIR/$TYPE" ]; then
    find "$BASE_DIR/$TYPE" -name "SKILL.md" | while read -r skill_file; do
      skill_dir=$(dirname "$skill_file")
      echo "📦 Registering [$TYPE]: $(basename "$skill_dir")"
      npx skills add "$skill_dir" -g -y < /dev/null
    done
  fi
done
echo "✅ Done!"
