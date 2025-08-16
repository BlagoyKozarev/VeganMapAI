#!/usr/bin/env bash
set -euo pipefail
LIST="$(ls -1t Docs_Audit_*/archive_list.txt | head -n1)"
test -f "$LIST" || { echo "archive_list.txt not found"; exit 1; }
BACKUP="$(ls -1t Archive_Docs_backup_*.tar.gz | head -n1)"
test -f "$BACKUP" || { echo "Backup .tar.gz not found"; exit 1; }
echo "About to remove originals listed in: $LIST"
read -p "Type YES to proceed: " ans
[[ "$ans" == "YES" ]] || { echo "Aborted."; exit 1; }
tr -d '\n' < "$LIST" | awk -v RS='\0' '{print}' | while IFS= read -r p; do
  [ -f "$p" ] && rm -f "$p"
done
echo "Done."
