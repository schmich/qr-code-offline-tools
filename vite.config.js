import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { viteInjectCSP } from './vite-plugin-inject-csp.js'
import { viteInlineIcon } from './vite-plugin-inline-icon.js'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), viteSingleFile(), viteInjectCSP(), viteInlineIcon()],
    build: {
        rollupOptions: {
            input: './qr.html',
            treeshake: 'smallest'
        }
    },
    server: {
        open: '/qr.html'
    }
})