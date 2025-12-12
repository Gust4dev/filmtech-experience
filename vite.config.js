import { defineConfig } from 'vite';
import inject from 'vite-plugin-html-inject';

export default defineConfig({
  plugins: [
    inject({
      debug: { logPath: true }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
