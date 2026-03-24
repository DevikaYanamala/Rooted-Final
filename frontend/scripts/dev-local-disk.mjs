/**
 * Run Vite from a copy under the system temp dir so file reads are local disk,
 * avoiding ETIMEDOUT from OneDrive / cloud-backed paths.
 *
 * `npm run dev` uses this by default. Plain Vite on the cloud folder: `npm run dev:vite`.
 * Optional: ROOTED_VITE_DIR=/path/to/dir npm run dev
 *
 * Do not enable periodic full sync by default — it re-copies src every N seconds and makes Vite
 * reload the whole app (flash). Use fs.watch above; restart this script if OneDrive misses edits.
 * Optional manual poll: ROOTED_POLL_SYNC_SEC=120 (seconds).
 */
import { cpSync, existsSync, mkdirSync, watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, spawnSync } from 'child_process';
import { setTimeout as delay } from 'timers/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dest =
  process.env.ROOTED_VITE_DIR ||
  path.join(process.env.TMPDIR || '/tmp', 'rooted-frontend-dev');

const copyFiles = [
  ['src', 'src'],
  ['public', 'public'],
  ['index.html', 'index.html'],
  ['vite.config.js', 'vite.config.js'],
  ['package.json', 'package.json'],
  ['package-lock.json', 'package-lock.json'],
];

function syncAll() {
  mkdirSync(dest, { recursive: true });
  for (const [fromRel, toRel] of copyFiles) {
    const from = path.join(root, fromRel);
    const to = path.join(dest, toRel);
    try {
      cpSync(from, to, { recursive: true });
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }
}

async function syncAllWithRetry() {
  const max = 4;
  for (let i = 0; i < max; i++) {
    try {
      syncAll();
      return;
    } catch (e) {
      const retry = (e?.code === 'ETIMEDOUT' || e?.code === 'EBUSY') && i < max - 1;
      if (retry) {
        console.warn(`[rooted] Sync failed (${e.code}), retry ${i + 1}/${max}…`);
        await delay(800);
        continue;
      }
      throw e;
    }
  }
}

await syncAllWithRetry();

console.log(`[rooted] Synced project → ${dest}`);
console.log('[rooted] Dev server reads this copy (not OneDrive). Open the Local URL from the log below.\n');

if (!existsSync(path.join(dest, 'node_modules'))) {
  console.log('[rooted] Installing dependencies in temp copy (one-time)...');
  const r = spawnSync('npm', ['install'], {
    cwd: dest,
    stdio: 'inherit',
    shell: true,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

let debounce;
function watchAndSync(dirRel, destRel) {
  const dir = path.join(root, dirRel);
  try {
    watch(dir, { recursive: true }, () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        try {
          cpSync(dir, path.join(dest, destRel), { recursive: true });
        } catch {
          /* ignore transient cloud sync read errors */
        }
      }, 250);
    });
  } catch {
    console.warn(`[rooted] Could not watch ${dirRel}/; restart dev after edits.`);
  }
}
watchAndSync('src', 'src');
watchAndSync('public', 'public');

/** Optional slow poll — only if ROOTED_POLL_SYNC_SEC is set (e.g. 120). Never default on: it causes Vite reload loops. */
const pollSec = process.env.ROOTED_POLL_SYNC_SEC
  ? Number(process.env.ROOTED_POLL_SYNC_SEC)
  : 0;
if (pollSec > 0 && !Number.isNaN(pollSec)) {
  setInterval(() => {
    try {
      syncAll();
    } catch (e) {
      console.warn('[rooted] Poll sync failed:', e?.message || e);
    }
  }, pollSec * 1000);
  console.log(`[rooted] Full sync every ${pollSec}s (ROOTED_POLL_SYNC_SEC). Stop with Ctrl+C if HMR flashes.`);
}

/** Run Vite directly — do not `npm run dev` here (that would recurse into this script). */
const viteCli = path.join(dest, 'node_modules', 'vite', 'bin', 'vite.js');
if (!existsSync(viteCli)) {
  console.error('[rooted] Missing', viteCli, '— run npm install in frontend/');
  process.exit(1);
}

const child = spawn(process.execPath, [viteCli, '--host'], {
  cwd: dest,
  stdio: 'inherit',
  env: { ...process.env },
});

child.on('exit', (code) => process.exit(code ?? 0));
