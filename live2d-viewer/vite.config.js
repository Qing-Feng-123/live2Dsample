import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      ignored: ['**/CubismWebSamples/**', '**/CubismWebFramework/**'],
    },
  },
  build: {
    target: 'esnext',
  },
  // 排除 Cubism SDK 源码目录，避免依赖扫描错误
  optimizeDeps: {
    exclude: ['CubismWebSamples', 'CubismWebFramework'],
  },
});