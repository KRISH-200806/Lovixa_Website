#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const gitDir = path.join(projectRoot, '.git');
const hooksDir = path.join(gitDir, 'hooks');

export function ensureGitHooks() {
  if (!fs.existsSync(gitDir)) return;
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hookContent = `#!/bin/sh
# Ironclad Rule & Boundary Enforcement Guard
export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin:$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | tail -n 1)/bin:$HOME/.local/share/pnpm:$HOME/.fnm/current/bin"
if [ -f "scripts/audit-codebase.mjs" ]; then
  node scripts/audit-codebase.mjs || {
    echo ""
    echo "❌ [BLOCKED BY IRONCLAD GUARD] Action aborted due to rule violations/warnings above."
    echo "💡 Fix the violations or run 'pnpm run audit:rules' to inspect."
    exit 1
  }
fi
`;

  const preCommitPath = path.join(hooksDir, 'pre-commit');
  const prePushPath = path.join(hooksDir, 'pre-push');

  fs.writeFileSync(preCommitPath, hookContent, { mode: 0o755 });
  fs.writeFileSync(prePushPath, hookContent, { mode: 0o755 });
  try {
    fs.chmodSync(preCommitPath, 0o755);
    fs.chmodSync(prePushPath, 0o755);
  } catch {}
}

if (process.argv[1] && process.argv[1].endsWith('install-hooks.mjs')) {
  ensureGitHooks();
  console.log('🔒 [Ironclad Guard] Git pre-commit & pre-push hooks active.');
}
