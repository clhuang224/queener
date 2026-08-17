import { fileURLToPath, URL } from 'node:url'
import { copyFile } from 'node:fs/promises'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const githubPagesSpaFallback = (): Plugin => ({
  name: 'github-pages-spa-fallback',
  apply: 'build',
  async closeBundle() {
    await copyFile(
      fileURLToPath(new URL('./dist/index.html', import.meta.url)),
      fileURLToPath(new URL('./dist/404.html', import.meta.url)),
    )
  },
})

export default defineConfig(() => ({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
    githubPagesSpaFallback(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
}))
