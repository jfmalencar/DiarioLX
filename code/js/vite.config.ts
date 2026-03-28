import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8180",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("error", (_, __, res) => {
            //console.log("error connection upstream")
            if ("writeHead" in res) {
              res.writeHead(200);
            }
            res.end()
          })
          proxy.on("proxyRes", (proxyRes, _, res) => {
            const upstreamSocket = proxyRes.socket
            //console.log("upstream connected")
            if (upstreamSocket) {
              upstreamSocket.once('close', () => {
                //console.log("upstream closed")
                if (!res.writableFinished) {
                  //console.log("destroying downstream")
                  res.destroy()
                }
              })
            }
          })
        },
      }
    }
  }
})