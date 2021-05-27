import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mpa from 'vite-plugin-mpa'
import htmlTemplate from 'vite-plugin-html-template'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mpa({
      scanDir: 'src/pages-dir',
      scanFile: 'index.ts',
    }),
    // undefined || {} || options below
    htmlTemplate({
      pagesDir: 'src/pages-dir',
      pages: {
        index: {
          title: 'Index Page',
          entry: 'index.ts',
        },
        subpage: {
          title: 'SubPage Page',
          entry: 'index.ts',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
