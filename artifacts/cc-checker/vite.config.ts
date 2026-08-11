import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  // Use sensible defaults during build so Vercel / CI won't fail when PORT or BASE_PATH
  // aren't provided. Only validate when a value is explicitly set.
  const rawPort = process.env.PORT;
  const port = rawPort ? Number(rawPort) : 5173;

  if (rawPort && (Number.isNaN(port) || port <= 0)) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  const basePath = process.env.BASE_PATH ?? '/';

  const plugins: any[] = [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
  ];

  // Load Replit-only plugins dynamically when running in that environment.
  if (process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined) {
    const carto = await import('@replit/vite-plugin-cartographer').then((m) =>
      m.cartographer({
        root: path.resolve(__dirname, '..'),
      }),
    );
    plugins.push(carto);

    const devBanner = await import('@replit/vite-plugin-dev-banner').then((m) =>
      m.devBanner(),
    );
    plugins.push(devBanner);
  }

  return {
    base: basePath,
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, '..', '..', 'attached_assets'),
      },
      dedupe: ['react', 'react-dom'],
    },
    root: path.resolve(__dirname),
    build: {
      outDir: path.resolve(__dirname, 'dist/public'),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});
