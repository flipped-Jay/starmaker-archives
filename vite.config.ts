import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 🎯 1. 修改核心配置：必须改成你的仓库名，前后都要有斜杠
      base: '/starmaker-archives/', 
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) => {
              // 修复一个潜在的 JS 报错点：如果 assetInfo.name 为空，可能会崩溃
              const name = assetInfo.name || '';
              let extType = name.split('.').at(1) || 'other';
              
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                extType = 'images';
              }
              return `assets/${extType}/[name]-[hash][extname]`;
            },
          },
        },
      },
    };
});