#!/usr/bin/env node
/**
 * Restores Linux-only optional packages that Mac's `npm install` strips from
 * package-lock.json. Runs as a pre-commit hook so the committed lock file is
 * always compatible with Linux CI (which uses `npm ci`).
 *
 * Strategy: compare the staged lock file against upstream/main (the Linux-
 * generated source of truth). Any package present upstream but absent in the
 * staged file is a platform casualty — restore it, then re-stage the file.
 * Falls back to HEAD if the upstream remote isn't configured.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const LOCK = 'package-lock.json';

// Only act when the lock file is actually staged.
const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
if (!staged.split('\n').includes(LOCK)) process.exit(0);

// Try upstream/main first (Linux-generated, most reliable), fall back to HEAD.
let reference;
for (const ref of ['upstream/main', 'HEAD']) {
  try {
    reference = JSON.parse(
      execSync(`git show ${ref}:${LOCK}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    );
    break;
  } catch {
    // try next ref
  }
}

if (!reference) process.exit(0);

const stagedLock = JSON.parse(readFileSync(LOCK, 'utf8'));
const refPkgs = reference.packages ?? {};
const stagedPkgs = stagedLock.packages ?? {};

const missing = Object.keys(refPkgs).filter((k) => !(k in stagedPkgs));
if (missing.length === 0) process.exit(0);

console.log(
  `[fix-lockfile] Restoring ${missing.length} platform-specific package(s) dropped by Mac npm:`
);
missing.forEach((k) => console.log(`  + ${k}`));

for (const key of missing) {
  stagedPkgs[key] = refPkgs[key];
}

// Also restore any missing entries from the legacy `dependencies` section.
const refDeps = reference.dependencies ?? {};
const stagedDeps = stagedLock.dependencies ?? {};
for (const [key, val] of Object.entries(refDeps)) {
  if (!(key in stagedDeps)) stagedDeps[key] = val;
}

writeFileSync(LOCK, JSON.stringify(stagedLock, null, 2) + '\n');
execSync(`git add ${LOCK}`);
console.log('[fix-lockfile] Lock file patched and re-staged.');
