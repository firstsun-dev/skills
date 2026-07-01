#!/bin/bash
set -e

echo "=== Harness Initialization: Firstsun Skill Arsenal ==="

echo "=== Repo structure sanity ==="
test -f SKILLS_LIST.md && echo "OK: SKILLS_LIST.md present" || { echo "FAIL: SKILLS_LIST.md missing"; exit 1; }
test -f skills-lock.json && echo "OK: skills-lock.json present" || { echo "FAIL: skills-lock.json missing"; exit 1; }
test -f custom/basic/skill-manager/SKILL.md && echo "OK: skill-manager SOP present" || { echo "FAIL: skill-manager/SKILL.md missing"; exit 1; }

echo "=== Every skill directory has a SKILL.md (one level deep, respecting nesting) ==="
missing=0
for dir in custom/*/*/ external/*/*/; do
  [ -d "$dir" ] || continue
  if [ ! -f "${dir}SKILL.md" ]; then
    # Could be a justified category container (>10 skills in domain) with nested skills one level deeper
    if ! find "$dir" -mindepth 2 -maxdepth 2 -name SKILL.md | grep -q .; then
      echo "MISSING SKILL.md: $dir"
      missing=$((missing + 1))
    fi
  fi
done
if [ "$missing" -gt 0 ]; then
  echo "FAIL: $missing directories without a discoverable SKILL.md"
  exit 1
fi
echo "OK: all skill directories resolve to a SKILL.md"

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature_list.json to see current feature state"
echo "2. Pick ONE unfinished feature to work on"
echo "3. For skill add/move/edit work, follow the skill-manager SOP and run /validate-skills before marking done"
echo "4. Re-run ./init.sh before claiming done"
