import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mpa from 'vite-plugin-mpa'
import htmlTemplate from 'vite-plugin-html-template'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mpa(),
    // undefined || {} || options below
    htmlTemplate({}),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
