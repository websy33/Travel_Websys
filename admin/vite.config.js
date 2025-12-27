import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5176,
        host: true, // Allow access from network (for phone testing)
        cors: true
    },
    build: {
        outDir: 'dist'
    }
})
