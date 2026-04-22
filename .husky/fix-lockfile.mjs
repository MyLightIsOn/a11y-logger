#!/usr/bin/env node
/**
 * Restores Linux-only optional packages that Mac's `npm install` strips from
 * package-lock.json. Runs as a pre-commit hook so the committed lock file is
 * always compatible with Linux CI (which uses `npm ci`).
 *
 * Strategy: diff the staged lock file against the last git-committed version.
 * Any package entry present in git but absent in the staged file is a platform
 * casualty — add it back, then re-stage the file.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const LOCK = 'package-lock.json';

// Only act when the lock file is actually staged.
const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
if (!staged.split('\n').includes(LOCK)) process.exit(0);

let committed;
try {
  committed = JSON.parse(execSync(`git show HEAD:${LOCK}`, { encoding: 'utf8' }));
} catch {
  // No previous commit (initial commit) — nothing to restore.
  process.exit(0);
}

const staged_lock = JSON.parse(readFileSync(LOCK, 'utf8'));

const committedPkgs = committed.packages ?? {};
const stagedPkgs = staged_lock.packages ?? {};

const missing = Object.keys(committedPkgs).filter((k) => !(k in stagedPkgs));
if (missing.length === 0) process.exit(0);

console.log(
  `[fix-lockfile] Restoring ${missing.length} platform-specific package(s) dropped by Mac npm:`
);
missing.forEach((k) => console.log(`  + ${k}`));

for (const key of missing) {
  stagedPkgs[key] = committedPkgs[key];
}

// Also restore any missing entries from the legacy `dependencies` section.
const committedDeps = committed.dependencies ?? {};
const stagedDeps = staged_lock.dependencies ?? {};
for (const [key, val] of Object.entries(committedDeps)) {
  if (!(key in stagedDeps)) stagedDeps[key] = val;
}

writeFileSync(LOCK, JSON.stringify(staged_lock, null, 2) + '\n');
execSync(`git add ${LOCK}`);
console.log(`[fix-lockfile] Lock file patched and re-staged.`);
