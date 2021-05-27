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
          template: 'public/template.html',
          title: 'Index Page',
          entry: 'src/pages-dir/index/index.ts',
        },
        subpage: {
          template: 'public/template.html',
          title: 'SubPage Page',
          entry: 'src/pages-dir/subpage/index.ts',
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
