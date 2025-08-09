#!/bin/bash

echo "=== Git Commit за Context промени ==="
echo ""
echo "Стъпка 1: Добавяне на context папката"
git add context/

echo ""
echo "Стъпка 2: Проверка на статуса"
git status

echo ""
echo "Стъпка 3: Commit на промените"
git commit -m "chore: clean up context folder and add status.json

- Remove test-trigger.txt  
- Add status.json with initial entry for context structure and mirror workflow
- Set last_update to 2025-08-08T00:00:00Z"

echo ""
echo "Стъпка 4: Push към GitHub"
git push origin main

echo ""
echo "✅ Готово! Context промените са качени в GitHub."