#!/usr/bin/env node
/**
 * Dynamic AI Project Architecture & Context Snapshot Generator
 * 
 * Inspects collections, globals, UI sections, blocks, design tokens,
 * and custom rules to generate a single zero-latency AI-CONTEXT.md.
 */

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');

function getFiles(dir, filterExt = ['.ts', '.tsx', '.js', '.jsx']) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFiles(fullPath, filterExt));
    } else if (filterExt.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

function relPath(p) {
  return path.relative(rootDir, p).replace(/\\/g, '/');
}

// 1. Discover Collections
const collectionsDir = path.join(srcDir, 'collections');
const collectionFiles = getFiles(collectionsDir);
const collections = collectionFiles.map(f => {
  const name = path.basename(f, path.extname(f));
  return `- **\`${name}\`** (\`${relPath(f)}\`)`;
});

// 2. Discover Globals
const globalsDir = path.join(srcDir, 'globals');
const globalFiles = getFiles(globalsDir);
const globals = globalFiles.map(f => {
  const name = path.basename(f, path.extname(f));
  return `- **\`${name}\`** (\`${relPath(f)}\`)`;
});

// 3. Discover CMS Blocks
const blocksDir = path.join(srcDir, 'blocks');
const blockFiles = getFiles(blocksDir);
const blocks = blockFiles.length > 0
  ? blockFiles.map(f => `- **\`${path.basename(f, path.extname(f))}\`** (\`${relPath(f)}\`)`)
  : ['_No CMS blocks discovered._'];

// 4. Discover UI Sections
const sectionsDir = path.join(srcDir, 'components', 'sections');
const sectionFiles = getFiles(sectionsDir);
const sections = sectionFiles.length > 0
  ? sectionFiles.map(f => `- **\`${path.basename(f, path.extname(f))}\`** (\`${relPath(f)}\`)`)
  : ['_No standalone frontend sections discovered._'];

// 5. Discover Custom Rules
const customRulesPath = path.join(rootDir, 'custom-rules.json');
let customRulesList = ['_No custom rules defined._'];
if (fs.existsSync(customRulesPath)) {
  try {
    const json = JSON.parse(fs.readFileSync(customRulesPath, 'utf8'));
    if (json.rules && json.rules.length > 0) {
      customRulesList = json.rules.map(
        r => `- **${r.name}** (\`${r.severity || 'warning'}\`): ${r.description || r.message}`
      );
    }
  } catch {}
}

// 6. Extract Environment Variable Schema from .env.example
const envExamplePath = path.join(rootDir, '.env.example');
let envKeys = [];
if (fs.existsSync(envExamplePath)) {
  const lines = fs.readFileSync(envExamplePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const key = trimmed.split('=')[0].trim();
      if (key) envKeys.push(`\`${key}\``);
    }
  }
}

// 7. Extract Package Info
const pkgPath = path.join(rootDir, 'package.json');
let pkg = { name: 'cms-marketing-site', dependencies: {} };
if (fs.existsSync(pkgPath)) {
  try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); } catch {}
}

const nextVer = pkg.dependencies?.next || '15.x';
const payloadVer = pkg.dependencies?.payload || '3.x';
const reactVer = pkg.dependencies?.react || '19.x';

const content = `# 🧠 AI Project Architecture & Context Snapshot
> Generated on: \`${new Date().toISOString().split('T')[0]}\` via \`pnpm run ai:context\`.
> Feed this file or reference it in AI Agent prompts for instant, zero-latency repository context.

---

## 📌 Project Overview
- **Name**: \`${pkg.name}\`
- **Next.js**: \`${nextVer}\` (App Router, Server Components by default)
- **Payload CMS**: \`${payloadVer}\` (Local API, Typed Schema, Section-Source-Map)
- **React**: \`${reactVer}\`
- **Tailwind / Styling**: CSS custom variables (\`hsl(var(--...))\`), 0 unmanaged hex colors allowed.

---

## 🏛️ Active Collections & Globals

### Collections (\`src/collections/\`)
${collections.join('\n') || '_None_'}

### Globals (\`src/globals/\`)
${globals.join('\n') || '_None_'}

---

## 🧱 UI Blocks & Frontend Sections

### CMS Blocks (\`src/blocks/\`)
${blocks.join('\n')}

### Frontend Sections (\`src/components/sections/\`)
${sections.join('\n')}

---

## 🛡️ Ironclad Architectural Boundaries (Must Follow)
1. **Server Components First**: Page roots (\`page.tsx\`) and layouts must be async React Server Components. Use leaf \`'use client'\` components only for interactive widgets (accordions, modals, forms).
2. **Async Page Props**: Always \`await params\` and \`await searchParams\` in Next.js 15.
3. **Payload ID Stripping**: Always preserve \`stripSystemFieldsBeforeOperation\` on collections and \`stripIdBeforeOperationHook\` on globals.
4. **PostgreSQL 63-Char Limit**: Slugs, block names, and array field names must never exceed 63 characters.
5. **Color Tokens Only**: Never use inline hex colors (e.g. \`#fff\`, \`bg-[#123]\`). Use design token classes like \`bg-background\`, \`text-primary\`, \`border-border\`.
6. **No Secret Leakage**: Never import server-only environment variables (\`PAYLOAD_SECRET\`, \`DATABASE_URL\`, \`SETUP_SECRET\`) inside client files.

---

## 📜 Active Custom Rules (\`custom-rules.json\`)
${customRulesList.join('\n')}

---

## 🔑 Environment Keys Schema (Declared in \`.env.example\`)
${envKeys.join(', ') || '_None declared_'}

---

## ⚡ Developer & AI Quality Commands
- **\`pnpm run ai:context\`** — Regenerate this architecture snapshot file.
- **\`pnpm run audit:rules\`** — Run the 9-pillar deterministic compliance audit.
- **\`pnpm run doctor\`** — Validate environment variables, secrets, and database connectivity.
- **\`pnpm run generate:types\`** — Regenerate Payload TypeScript interfaces.
`;

const outPath = path.join(rootDir, 'AI-CONTEXT.md');
fs.writeFileSync(outPath, content, 'utf8');
console.log('✓ Generated fresh AI Context Snapshot: AI-CONTEXT.md');
