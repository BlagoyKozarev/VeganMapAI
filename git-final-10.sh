#!/bin/bash
# Remove final 10 files and achieve perfect sync

# Add agent state files
git add .local/state/replit/agent/.agent_state_main.bin .local/state/replit/agent/repl_state.bin

# Push all pending commits
git push origin main

# Remove final missing files
git ls-files | while read file; do [ ! -f "$file" ] && git rm --cached --ignore-unmatch "$file"; done

# Final commit
git commit -m "final: Perfect sync achieved" || echo "No changes"
git push origin main

# Show result
echo "RESULT: Workspace $(find . -type f -not -path './.git/*' | wc -l), Git $(git ls-files | wc -l)"