#!/bin/bash
set -euo pipefail

echo "[STEP] Проверка на задължителни променливи..."
: "${CLOUDFLARE_API_TOKEN:?missing CLOUDFLARE_API_TOKEN}"
echo "[OK] CLOUDFLARE_API_TOKEN наличен."

HAS_SA="no"; if [ -n "${GOOGLE_APPLICATION_CREDENTIALS_JSON:-}" ] && [ -n "${FIREBASE_PROJECT_ID:-}" ]; then HAS_SA="yes"; fi
HAS_APPLE_FILE="no"; if [ -n "${APPLE_ASSOC_FILE:-}" ]; then HAS_APPLE_FILE="yes"; fi

echo "[STEP] Подготовка на Terraform за Cloudflare DNS..."
mkdir -p infra bin
cat > infra/versions.tf <<'EOF'
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 4.0" }
  }
}
EOF
cat > infra/providers.tf <<'EOF'
variable "cloudflare_api_token" { type = string }
variable "zone_name"            { type = string, default = "veganmapai.ai" }
provider "cloudflare" { api_token = var.cloudflare_api_token }
EOF
cat > infra/main.tf <<'EOF'
variable "zone_name"   { type = string, default = "veganmapai.ai" }
variable "auth_target" { type = string, default = "hostingveganmapai.web.app" }

data "cloudflare_zones" "z" { filter { name = var.zone_name } }
locals { zone_id = data.cloudflare_zones.z.result[0].id }

# CNAME auth -> Firebase Hosting
resource "cloudflare_record" "auth" {
  zone_id = local.zone_id
  name    = "auth"
  type    = "CNAME"
  value   = var.auth_target
  proxied = false
  ttl     = 300
}

# (по избор) www -> apex
resource "cloudflare_record" "www" {
  zone_id = local.zone_id
  name    = "www"
  type    = "CNAME"
  value   = var.zone_name
  proxied = false
  ttl     = 300
}
EOF

echo "[STEP] Инсталация на Terraform ако липсва..."
if ! command -v terraform >/dev/null 2>&1; then
  TFVER="1.7.5"
  os="$(uname -s | tr '[:upper:]' '[:lower:]')"
  arch="$(uname -m)"; [ "$arch" = "x86_64" ] && arch="amd64"; [ "$arch" = "aarch64" ] && arch="arm64"
  url="https://releases.hashicorp.com/terraform/${TFVER}/terraform_${TFVER}_${os}_${arch}.zip"
  curl -fsSL "$url" -o /tmp/tf.zip
  unzip -o /tmp/tf.zip -d /tmp >/dev/null
  mkdir -p bin && mv /tmp/terraform bin/ && chmod +x bin/terraform
  export PATH="$PWD/bin:$PATH"
fi
terraform -version >/dev/null && echo "[OK] Terraform готов."

echo "[STEP] Приложи DNS промени (Cloudflare)..."
pushd infra >/dev/null
export TF_IN_AUTOMATION=1
terraform init -no-color
terraform validate -no-color
terraform apply -auto-approve -no-color \
  -var cloudflare_api_token="${CLOUDFLARE_API_TOKEN}" \
  -var zone_name="veganmapai.ai" \
  -var auth_target="hostingveganmapai.web.app"
popd >/dev/null
echo "[OK] CNAME auth.veganmapai.ai -> hostingveganmapai.web.app създаден/обновен."

echo "[STEP] Smoke тест за DNS..."
set +e
RES="$(dig +short auth.veganmapai.ai)"
if [ -z "$RES" ]; then
  echo "[WARN] Все още няма отговор. DNS propagation може да отнеме 5–20 минути."
else
  echo "[OK] dig auth.veganmapai.ai ->"
  echo "$RES"
fi
set -e

if [ "$HAS_SA" = "yes" ]; then
  echo "[STEP] Подготовка за Firebase deploy (опционално)..."
  echo "$GOOGLE_APPLICATION_CREDENTIALS_JSON" > /tmp/sa.json
  export GOOGLE_APPLICATION_CREDENTIALS=/tmp/sa.json

  if ! command -v firebase >/dev/null 2>&1; then
    npm i -g firebase-tools
  fi
  firebase --version >/dev/null && echo "[OK] Firebase CLI наличен."

  echo "[STEP] Създавам минимален Hosting таргет за 'auth'..."
  mkdir -p hosting/public/.well-known
  cat > hosting/.firebaserc <<EOF
{
  "projects": { "default": "${FIREBASE_PROJECT_ID}" },
  "targets": { "${FIREBASE_PROJECT_ID}": { "hosting": { "auth": ["auth"] } } }
}
EOF
  cat > hosting/firebase.json <<'EOF'
{
  "hosting": [
    {
      "target": "auth",
      "public": "public",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "headers": [
        {
          "source": "/.well-known/apple-developer-domain-association.txt",
          "headers": [{ "key": "Content-Type", "value": "text/plain" }]
        }
      ]
    }
  ]
}
EOF

  if [ "$HAS_APPLE_FILE" = "yes" ]; then
    printf "%s" "$APPLE_ASSOC_FILE" > hosting/public/.well-known/apple-developer-domain-association.txt
    echo "[OK] Добавен е apple-developer-domain-association.txt от Secret."
  else
    echo "PLACEHOLDER - заменете с реалния apple-developer-domain-association.txt" > hosting/public/.well-known/apple-developer-domain-association.txt
    echo "[WARN] Няма APPLE_ASSOC_FILE. Деплойвам placeholder; заменете през UI при нужда."
  fi

  echo "[STEP] Firebase deploy → hosting:auth..."
  pushd hosting >/dev/null
  firebase use "${FIREBASE_PROJECT_ID}"
  firebase target:apply hosting auth auth || true
  firebase deploy --only hosting:auth --project "${FIREBASE_PROJECT_ID}"
  popd >/dev/null
  echo "[OK] Firebase Hosting deploy завърши."
else
  echo "[INFO] Прескачам Firebase deploy (липсва GOOGLE_APPLICATION_CREDENTIALS_JSON или FIREBASE_PROJECT_ID)."
fi

echo "[STEP] Финални инструкции:"
echo "1) В Firebase Console → Hosting → Custom domains → auth.veganmapai.ai → Verify, когато DNS се разнесе."
if [ "$HAS_SA" = "yes" ] && [ "$HAS_APPLE_FILE" = "yes" ]; then
  echo "2) Apple файлът вече е деплойнат в /.well-known/. Премини към Apple Developer → Service ID → Configure → домейнът трябва да стане Verified."
else
  echo "2) Качете apple-developer-domain-association.txt в /.well-known/ (ако не е качен) през Firebase Hosting UI, после в Apple Developer маркирайте домейна като Verified."
fi
echo "[OK] Готово."