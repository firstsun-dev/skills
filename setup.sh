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
    
    # Create backup of lock file to preserve original sources during registration
    [ -f "$BASE_DIR/skills-lock.json" ] && cp "$BASE_DIR/skills-lock.json" "$BASE_DIR/skills-lock.json.bak"

    find "$BASE_DIR/$dir_type" -name "SKILL.md" | while read -r skill_file; do
      skill_dir=$(dirname "$skill_file")
      rel_path="${skill_dir#$BASE_DIR/}"
      
      # Determine skill name/slug from frontmatter or directory
      skill_name=$(grep -m 1 "^name:" "$skill_file" | sed 's/name: *//' | tr -d '"'\'': ')
      [ -z "$skill_name" ] && skill_name=$(basename "$skill_dir")
      
      if [ "$USE_REMOTE" = true ]; then
        if [ "$dir_type" == "custom" ]; then
          echo "📦 Registering (Remote): $REPO_NAME/$rel_path"
          npx skills add "$REPO_NAME/$rel_path" $SCOPE_FLAG $AGENT_FLAG -y < /dev/null
        else
          # For external skills, we register the local version (fast & curated)
          # but we will revert the lock file entry to its original source below.
          echo "📦 Registering (Local-Inspection): $rel_path"
          npx skills add "$skill_dir" $SCOPE_FLAG $AGENT_FLAG -y < /dev/null
          
          # Hygiene: Restore original remote source for external skill if it existed
          if [ -f "$BASE_DIR/skills-lock.json.bak" ] && command -v jq >/dev/null; then
            orig_source=$(jq -r ".skills[\"$skill_name\"].source // empty" "$BASE_DIR/skills-lock.json.bak")
            # Only restore if the original was a true external remote source
            if [ -n "$orig_source" ] && [[ "$orig_source" != "$BASE_DIR"* ]] && [[ "$orig_source" != "./"* ]] && [[ "$orig_source" != "$REPO_NAME" ]]; then
              echo "🛡️  Preserving original source for $skill_name: $orig_source"
              orig_data=$(jq -c ".skills[\"$skill_name\"]" "$BASE_DIR/skills-lock.json.bak")
              jq ".skills[\"$skill_name\"] = $orig_data" "$BASE_DIR/skills-lock.json" > "$BASE_DIR/skills-lock.json.tmp" && mv "$BASE_DIR/skills-lock.json.tmp" "$BASE_DIR/skills-lock.json"
            fi
          fi
        fi
      else
        echo "📦 Registering (Local): $rel_path"
        npx skills add "$skill_dir" $SCOPE_FLAG $AGENT_FLAG -y < /dev/null
      fi
    done
    
    # Restore complete backup if in local mode to avoid dirtying skills-lock.json with local paths
    if [ "$USE_REMOTE" = false ] && [ -f "$BASE_DIR/skills-lock.json.bak" ]; then
      echo "🛡️  Restoring original skills-lock.json in local mode"
      mv "$BASE_DIR/skills-lock.json.bak" "$BASE_DIR/skills-lock.json"
    else
      rm -f "$BASE_DIR/skills-lock.json.bak"
    fi
  fi
}

if [ "$MODE" == "all" ] || [ "$MODE" == "custom" ]; then
  register_skills "custom"
fi

if [ "$MODE" == "all" ] || [ "$MODE" == "external" ]; then
  register_skills "external"
fi

echo "✅ Done!"
