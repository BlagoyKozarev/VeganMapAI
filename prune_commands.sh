#!/usr/bin/env bash
set -euo pipefail
test -f "docs_backup_20250816_153958.tar.gz" || { echo "Backup archive missing: docs_backup_20250816_153958.tar.gz"; exit 1; }
echo "About to remove 358 files."
# Review first: less "prune_candidates_20250816_153958.txt"
while IFS= read -r p; do
  rm -f "$p"
done < "prune_candidates_20250816_153958.txt"
echo "Done."
