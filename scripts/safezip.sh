#!/usr/bin/env bash
set -euo pipefail

# ── Параметри (можеш да ги променяш при нужда)
OUTDIR="share"
OUTZIP="${OUTDIR}/veganmapai-share.zip"       # винаги едно и също име
STAGING=".share_staging"
BASELIST="include.baseline.lst"
PERSIST_INC="assist.include"                  # постоянни допълнения
REQUEST_INC="assist.request"                  # еднократни за този run
MAX_MB_PER_FILE="${MAX_MB_PER_FILE:-2}"       # максимум 2MB на файл (override с env)
MAX_FILES="${MAX_FILES:-4000}"                # максимум брой файлове
ALLOW_SECRETS="${ALLOW_SECRETS:-0}"           # 0=сканирай и предупреждавай

mkdir -p "${OUTDIR}"
rm -rf "${STAGING}"
mkdir -p "${STAGING}"

# ── Изключвания (директории и файлове)
EXCL_DIRS=(
  "*/node_modules/*" "*/.git/*" "*/.next/*" "*/.cache/*" "*/dist/*" "*/build/*" "*/out/*"
  "*/.venv/*" "*/venv/*" "*/__pycache__/*" "*/coverage/*" "*/.pytest_cache/*" "*/.yarn/*"
  "*/.pnpm-store/*" "*/.idea/*" "*/.vscode/*" "*/.gradle/*" "*/target/*" "*/.vercel/*" "*/.netlify/*"
)
EXCL_FILES=( ".env" ".env.*" "*.pem" "*.key" "*.crt" "*.p12" "id_rsa*" "*secrets*" "*credentials*" "*.sqlite" )

# ── Разрешени разширения (бял списък)
ALLOW_EXTS=("js" "ts" "tsx" "jsx" "py" "go" "java" "kt" "dart" "rs" "cpp" "c" "h" "cs" "rb" "php"
            "html" "css" "scss" "less" "md" "json" "yaml" "yml" "toml" "ini" "conf" "sql" "sh" "ps1"
            "dockerfile" "nix" )

# ── Помощни функции
is_allowed_ext() {
  local f="$1" ext
  ext="$(echo "${f##*.}" | tr '[:upper:]' '[:lower:]')"
  # специален случай за Dockerfile
  if [[ "$(basename "$f")" == "Dockerfile" ]]; then return 0; fi
  for e in "${ALLOW_EXTS[@]}"; do [[ "$ext" == "$e" ]] && return 0; done
  return 1
}
is_excluded_path() {
  local p="$1"
  for pat in "${EXCL_DIRS[@]}"; do [[ "$p" == $pat ]] && return 0; done
  for pat in "${EXCL_FILES[@]}"; do [[ "$(basename "$p")" == $pat ]] && return 0; done
  return 1
}
add_paths_from_list() {
  local lst="$1"
  [[ -f "$lst" ]] || return 0
  while IFS= read -r raw || [[ -n "$raw" ]]; do
    # прескочи празни и коментари
    [[ -z "$raw" || "$raw" =~ ^\# ]] && continue
    # разшири glob-ове безопасно
    while IFS= read -r match; do
      [[ -z "$match" ]] && continue
      printf '%s\0' "$match"
    done < <(bash -c "shopt -s globstar nullglob dotglob; compgen -G '$raw' || true")
  done < "$lst"
}

FILELIST0=".share_filelist.lst0"
: > "$FILELIST0"

# ── База: include.baseline.lst
add_paths_from_list "$BASELIST" >> "$FILELIST0"

# ── Постоянни и еднократни допълнения
add_paths_from_list "$PERSIST_INC" >> "$FILELIST0"
add_paths_from_list "$REQUEST_INC" >> "$FILELIST0"

# Ако има REQUEST_INC, изпълняваме и го нулираме (еднократно поведение)
if [[ -s "$REQUEST_INC" ]]; then : > "$REQUEST_INC"; fi

# ── Ако базовият списък е празен, добави типични директории по подразбиране
if [[ ! -s "$FILELIST0" ]]; then
  printf '%s\0' src app server backend api pages components lib utils README.md docs >> "$FILELIST0"
fi

# ── Събиране на файлове в staging с ограничения
COUNT=0
BYTES=0

while IFS= read -r -d '' path; do
  [[ -e "$path" ]] || continue
  if [[ -d "$path" ]]; then
    # обход на директория
    while IFS= read -r -d '' f; do
      # изключвания по път
      for pat in "${EXCL_DIRS[@]}"; do [[ "$f" == $pat ]] && continue 2; done
      for pat in "${EXCL_FILES[@]}"; do [[ "$(basename "$f")" == $pat ]] && continue 2; done
      # лимити
      sz_kb=$(du -k "$f" | cut -f1)
      if (( sz_kb > MAX_MB_PER_FILE*1024 )); then continue; fi
      if ! is_allowed_ext "$f"; then continue; fi
      # копирай
      dest="${STAGING}/$(dirname "$f")"
      mkdir -p "$dest"
      cp -p "$f" "$dest/"
      ((COUNT++))
      ((BYTES+=sz_kb*1024))
      if (( COUNT >= MAX_FILES )); then break; fi
    done < <(find "$path" -type f -print0)
  elif [[ -f "$path" ]]; then
    # единичен файл
    if is_excluded_path "$path"; then continue; fi
    sz_kb=$(du -k "$path" | cut -f1)
    if (( sz_kb > MAX_MB_PER_FILE*1024 )); then continue; fi
    if ! is_allowed_ext "$path"; then continue; fi
    dest="${STAGING}/$(dirname "$path")"
    mkdir -p "$dest"
    cp -p "$path" "$dest/"
    ((COUNT++))
    ((BYTES+=sz_kb*1024))
  fi
  if (( COUNT >= MAX_FILES )); then break; fi
done < "$FILELIST0"

# ── Базова безопасност: сканирай за тайни
if [[ "$ALLOW_SECRETS" != "1" ]]; then
  if grep -RIEn --exclude-dir=.git --exclude-dir=node_modules \
      -e 'API_KEY|SECRET|TOKEN|sk-[A-Za-z0-9_-]{20,}' "$STAGING" >/dev/null 2>&1; then
    echo "[WARN] Открити са низове, приличащи на секрети в подбрани файлове."
    echo "      Прегледай ${STAGING} преди споделяне или задай ALLOW_SECRETS=1 за да скриеш предупреждението."
  fi
fi

# ── ZIP: атомично презаписване със същото име
TMPZIP="${OUTDIR}/._tmp_veganmapai-share.zip"
rm -f "$TMPZIP"
( cd "$STAGING" && zip -qr "$PWD/../$TMPZIP" . )
mv -f "$TMPZIP" "$OUTZIP"

# ── Манифест
MANIFEST="${OUTDIR}/veganmapai-manifest.json"
{
  echo '{'
  echo "  \"generated_at\":\"$(date -Iseconds)\","
  echo "  \"files\":$COUNT,"
  echo "  \"bytes\":$BYTES,"
  echo "  \"max_mb_per_file\":$MAX_MB_PER_FILE,"
  echo "  \"max_files\":$MAX_FILES"
  echo '}'
} > "$MANIFEST"

echo "[OK] Пакетът е готов: $OUTZIP"
echo "     Манифест: $MANIFEST"
