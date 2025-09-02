#!/usr/bin/env node
/**
 * Claude repo audit runner (CommonJS).
 * Работи в ESM проекти, защото е .cjs.
 * Без външни зависимости. Node 20+ (има глобален fetch).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ==== Config ====
const MAX_CONTEXT_CHARS = 200_000;   // общ бюджет към модела
const MAX_FILE_BYTES   = 60_000;     // максимум четени байтове от 1 файл
const MAX_SRC_FILES    = 120;        // максимум включени изходни файлове
const MODEL = process.env.CLAUDE_MODEL || 'claude-3-7-sonnet';
const OUT_DIR = path.join(process.cwd(), 'audit');
const OUT_MD  = path.join(OUT_DIR, 'claude-audit.md');
const OUT_JSON= path.join(OUT_DIR, 'claude-audit.json');

// ==== Guards ====
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY липсва. Добави GitHub secret.');
  process.exit(2);
}

// ==== Ignore rules ====
const ignoreDirs = new Set([
  'node_modules','.git','dist','build','.next','.vercel','.turbo','.cache','coverage',
  '.output','.firebase','.venv','venv','.idea','.vscode','tmp','vendor','.pnpm-store',
  '.pythonlibs' // важно за GitHub runners с Python toolcache
]);

const ignoreGlobs = [
  '.DS_Store','Thumbs.db','*.min.*','*.map','*.lock',
  '*.png','*.jpg','*.jpeg','*.gif','*.webp','*.svg','*.ico',
  '*.pdf','*.mp4','*.mp3','*.zip','*.tar','*.gz','*.7z','*.wasm'
];

function matchesGlob(name) {
  return ignoreGlobs.some(g => {
    if (g.startsWith('*.')) return name.toLowerCase().endsWith(g.slice(1).toLowerCase());
    return name === g;
  });
}

// ==== FS helpers ====
function walk(dir, depth = 0, maxDepth = 6, files = []) {
  if (depth > maxDepth) return files;
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const e of entries) {
    const fp = path.join(dir, e.name);
    const rel = path.relative(process.cwd(), fp);

    // пропусни игнорирани директории
    if (e.isDirectory()) {
      if (ignoreDirs.has(e.name)) continue;
      if (e.name.startsWith('.git')) continue;
      walk(fp, depth + 1, maxDepth, files);
      continue;
    }

    // пропусни по шаблон
    if (matchesGlob(e.name)) continue;

    // безопасна статистика + прескочи счупени линкове
    let st;
    try { st = fs.lstatSync(fp); } catch { continue; }
    if (st.isSymbolicLink()) continue;

    files.push({ rel, size: st.size || 0 });
  }
  return files;
}

function safeRead(file, limit = MAX_FILE_BYTES) {
  try {
    const buf = fs.readFileSync(file);
    if (buf.length <= limit) return buf.toString('utf8');
    const head = buf.subarray(0, Math.floor(limit * 0.7)).toString('utf8');
    const tail = buf.subarray(buf.length - Math.floor(limit * 0.3)).toString('utf8');
    return `${head}\n\n/* …truncated ${buf.length - limit} bytes… */\n\n${tail}`;
  } catch {
    return '';
  }
}

function extOf(p) {
  const b = path.basename(p);
  const i = b.lastIndexOf('.');
  return i > -1 ? b.slice(i + 1).toLowerCase() : '';
}

function tryReadJSON(fp) {
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return null; }
}

// ==== Repo metadata ====
function sh(cmd) {
  try { return execSync(cmd, { stdio: ['ignore','pipe','ignore'] }).toString().trim(); }
  catch { return ''; }
}

const repo   = process.env.GITHUB_REPOSITORY || path.basename(process.cwd());
const sha    = process.env.GITHUB_SHA || sh('git rev-parse --short HEAD');
const branch = process.env.GITHUB_REF_NAME || sh('git rev-parse --abbrev-ref HEAD') || 'local';
const eventName = process.env.GITHUB_EVENT_NAME || 'local';

// събиране на файлове
const allFiles = walk(process.cwd(), 0, 6);
const codeExts = new Set(['ts','tsx','js','jsx','mjs','cjs','py','go','rs','java','json','yml','yaml','toml','md','tsconfig','cjs','mjs']);
const codeFiles = allFiles.filter(f => codeExts.has(extOf(f.rel)));

const byExt = {};
for (const f of codeFiles) byExt[extOf(f.rel)] = (byExt[extOf(f.rel)] || 0) + 1;

const keyFilesList = [
  'package.json','pnpm-lock.yaml','yarn.lock','bun.lockb',
  'requirements.txt','pyproject.toml','go.mod','Cargo.toml',
  'Dockerfile','docker-compose.yml','docker-compose.yaml',
  'vite.config.ts','vite.config.js','next.config.js','next.config.mjs',
  'tsconfig.json','tsconfig.base.json','.eslintrc.js','.eslintrc.cjs','.eslintrc.json',
  'firebase.json','.firebaserc','netlify.toml','vercel.json'
].map(f => path.join(process.cwd(), f)).filter(fp => fs.existsSync(fp));

const pkg = tryReadJSON(path.join(process.cwd(), 'package.json')) || {};
const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
const depsList = Object.keys(deps).sort().slice(0, 200);

// базов контекст
const header = [
  `Repo: ${repo}`,
  `Branch: ${branch}`,
  `SHA: ${sha}`,
  `Event: ${eventName}`,
  `Files (scanned): ${codeFiles.length}/${allFiles.length}`,
  `Model: ${MODEL}`
].join('\n');

const extStats = Object.entries(byExt).sort((a,b)=>b[1]-a[1]).map(([e,c])=>`${e}: ${c}`).join(', ');
const treePreview = codeFiles.slice(0, 500).map(f => `- ${f.rel} (${f.size} B)`).join('\n');

let context = `# Repository Context

${header}

## Extension Stats
${extStats}

## NPM Dependencies (first 200)
${depsList.join(', ')}

## Key Files
${keyFilesList.map(fp => path.relative(process.cwd(), fp)).join('\n')}

## File Tree (first 500)
${treePreview}
`;

let budget = Math.max(0, MAX_CONTEXT_CHARS - context.length);
function addSection(title, content) {
  if (budget <= 0) return;
  const piece = `\n\n## ${title}\n\n${content}\n`;
  const take = Math.min(budget, piece.length);
  context += piece.slice(0, take);
  budget -= take;
}

// добавяне на съдържание на ключови файлове
for (const kf of keyFilesList) {
  addSection(`Content: ${path.relative(process.cwd(), kf)}`, "```" + safeRead(kf) + "```");
}

// приоритизирай src/, app/, server/, backend/, api/
const prefer = ['src','app','server','backend','api','pages','lib'];
const preferredFiles = codeFiles.filter(f => prefer.some(p => f.rel.startsWith(p)));
const remainingFiles = codeFiles.filter(f => !prefer.some(p => f.rel.startsWith(p)));
const ordered = [...preferredFiles, ...remainingFiles].slice(0, MAX_SRC_FILES);

for (const f of ordered) {
  addSection(`Content: ${f.rel}`, "```" + safeRead(path.join(process.cwd(), f.rel)) + "```");
}

// ==== Prompts ====
const systemPrompt = `
You are a rigorous senior code auditor. Output clean Markdown only. Bulgarian language.
Sections required:
1) Архитектурна карта: модули, зависимости, граници.
2) Рискове по приоритет: security, стабилност, данни, достъп, тайни, supply chain.
3) Дълг и анти-патърни: dead code, дублиране, сложност, структура.
4) Тестове и покритие: какво липсва, как да се добави бързо.
5) Performance & DX: build, bundling, tree-shaking, конфигурации.
6) Accessibility & i18n: конкретни пропуски.
7) DevOps: CI/CD предложения, кеширане, артефакти, smoke/e2e.
8) Конкретни PR препоръки с файлови пътища и diff-пачове.
9) Чеклист: 10 задачи, подредени по ROI, с трудност (S/M/L) и очакван ефект.
Return concise but actionable.
`.trim();

const userPrompt = `
Ето контекстът на репозиторито. Анализирай и изготви одит-отчет.

\`\`\`
${context}
\`\`\`
`.trim();

// ==== Anthropic call ====
async function callClaude() {
  const payload = {
    model: MODEL,
    max_tokens: 4000,
    temperature: 0,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    throw new Error(`Anthropic API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  const text = (data?.content && data.content[0]?.text) ? data.content[0].text : '';
  return { raw: data, md: text || '# Грешка: празен отговор от модела.' };
}

// ==== Main ====
(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  try {
    const out = await callClaude();
    fs.writeFileSync(OUT_MD, out.md, 'utf8');
    fs.writeFileSync(OUT_JSON, JSON.stringify(out.raw, null, 2), 'utf8');
    console.log(`OK: отчетът е записан в ${OUT_MD}`);
  } catch (e) {
    const msg = `# Грешка при одита\n\n\`\`\`\n${String(e)}\n\`\`\`\n`;
    fs.writeFileSync(OUT_MD, msg, 'utf8');
    console.error(String(e));
    process.exit(1);
  }
})();
