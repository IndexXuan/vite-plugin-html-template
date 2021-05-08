import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mpa from 'vite-plugin-mpa'
import htmlTemplate from '@hfe/vite-plugin-html-template'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mpa(),
    // undefined || {} || options below
    htmlTemplate({
      pages: {
        index: {
          title: 'Index Page',
        },
        subpage: {
          title: 'SubPage Page',
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
