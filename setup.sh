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

      if [ "$USE_REMOTE" = true ]; then
        if [ "$dir_type" == "custom" ]; then
          echo "📦 Registering (Remote): $REPO_NAME/$rel_path"
          npx skills add "$REPO_NAME/$rel_path" $SCOPE_FLAG $AGENT_FLAG -y < /dev/null
        else
          # For external skills, we register the local version (fast & curated)
          # but we force the lock file entry back to its original upstream source below.
          echo "📦 Registering (Local-Inspection): $rel_path"
          npx skills add "$skill_dir" $SCOPE_FLAG $AGENT_FLAG -y < /dev/null
        fi
      else
        echo "📦 Registering (Local): $rel_path"
        npx skills add "$skill_dir" $SCOPE_FLAG $AGENT_FLAG -y < /dev/null
      fi
    done

    if [ "$USE_REMOTE" = false ] && [ -f "$BASE_DIR/skills-lock.json.bak" ]; then
      # Restore complete backup in local mode to avoid dirtying skills-lock.json with local paths
      echo "🛡️  Restoring original skills-lock.json in local mode"
      mv "$BASE_DIR/skills-lock.json.bak" "$BASE_DIR/skills-lock.json"
    elif [ "$dir_type" == "external" ] && [ -f "$BASE_DIR/skills-lock.json.bak" ] && command -v jq >/dev/null; then
      # Force-restore source/sourceType/skillPath for every skill that was already
      # sourceType=="github" before this run, keyed by exact JSON key from the backup
      # taken above — never by string-matching whatever `npx skills add <local-dir>`
      # just wrote. `npx` always resolves to the latest published `skills` package,
      # so a serialization-format change there (e.g. no "./" prefix on a local path)
      # can silently defeat a heuristic that inspects the new value; matching on the
      # pre-run snapshot's own key/sourceType is immune to that.
      echo "🛡️  Restoring upstream source/sourceType/skillPath for external skills"
      jq -s --arg repo "$REPO_NAME" '
        .[0] as $orig | .[1] as $new |
        $new
        | .skills |= with_entries(
            ($orig.skills[.key] // null) as $o
            | if ($o != null and $o.sourceType == "github" and $o.source != $repo)
              then .value.source = $o.source
                 | .value.sourceType = $o.sourceType
                 | (if $o.skillPath then .value.skillPath = $o.skillPath else .value end)
              else .
              end
          )
      ' "$BASE_DIR/skills-lock.json.bak" "$BASE_DIR/skills-lock.json" > "$BASE_DIR/skills-lock.json.tmp" \
        && mv "$BASE_DIR/skills-lock.json.tmp" "$BASE_DIR/skills-lock.json"
      rm -f "$BASE_DIR/skills-lock.json.bak"
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
