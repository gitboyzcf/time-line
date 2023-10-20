import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    outDir: 'time-line',
    lib: {
      entry: resolve(__dirname, './src/components/TimeLine/index.js'), //指定组件编译入口文件
      name: 'time-line',
      fileName: 'time-line'
    }
  },
  rollupOptions: {
    // 确保外部化处理那些你不想打包进库的依赖
    external: ['vue'],
    output: {
      // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      globals: {
        vue: 'Vue'
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
