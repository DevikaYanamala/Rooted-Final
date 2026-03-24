import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const isCloudBacked = /CloudStorage|OneDrive|Dropbox|iCloud|Google Drive|Box Sync/i.test(
  configDir,
);

const argv = process.argv;
const isBuild = argv.includes('build');
const isPreview = argv.includes('preview');
const isHelp = argv.includes('--help') || argv.includes('-h');
const isVersion = argv.includes('--version') || argv.includes('-v');

if (
  isCloudBacked &&
  !process.env.ROOTED_ALLOW_CLOUD_VITE &&
  !isBuild &&
  !isPreview &&
  !isHelp &&
  !isVersion
) {
  console.error('');
  console.error('[rooted] Vite was started from a cloud-synced folder:');
  console.error('   ', configDir);
  console.error('   Node often gets ETIMEDOUT reading files here. Run the dev server that copies to local disk:');
  console.error('   npm run dev');
  console.error('');
  console.error('   Only if you must run Vite on this folder: ROOTED_ALLOW_CLOUD_VITE=1 npm run dev:vite');
  console.error('');
  process.exit(1);
}

// Polling every ~1.5s was causing constant HMR / full reload flashes on cloud-synced folders.
// Enable only when native watching fails: ROOTED_VITE_POLL=1 npm run dev
const usePoll = process.env.ROOTED_VITE_POLL === '1';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: false,
    ...(usePoll ? { watch: { usePolling: true, interval: 2000 } } : {}),
  },
});
