// vite.config.js
import { defineConfig } from "file:///E:/travel_websys/Travel_Websys/node_modules/vite/dist/node/index.js";
import react from "file:///E:/travel_websys/Travel_Websys/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwind from "file:///E:/travel_websys/Travel_Websys/node_modules/@tailwindcss/vite/dist/index.mjs";
import path from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///E:/travel_websys/Travel_Websys/vite.config.js";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  base: "./",
  plugins: [
    react({
      jsxRuntime: "automatic",
      babel: {
        plugins: [
          ["@babel/plugin-transform-react-jsx", {
            runtime: "automatic",
            importSource: "react"
          }]
        ]
      }
    }),
    tailwind()
    // Official Tailwind Vite plugin
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-router-dom": path.resolve(__dirname, "node_modules/react-router-dom"),
      "react-icons": path.resolve(__dirname, "node_modules/react-icons"),
      "leaflet": path.resolve(__dirname, "node_modules/leaflet/dist/leaflet-src.esm.js")
    }
  },
  server: {
    port: 5174,
    strictPort: false,
    proxy: {
      "/api": {
        target: "https://omairiq.azurewebsites.net/login",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, ""),
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "Authorization",
              "Bearer NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OlBvTjE2NGNkLy9heE53WC9hM00rS1ZrcnJSa2Q0S05adHl3Q0NHZmU4Uzg9"
            );
            proxyReq.setHeader("Accept", "application/json");
            proxyReq.setHeader("Content-Type", "application/json");
          });
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react-router-dom",
      "react-icons",
      "leaflet",
      "react-leaflet",
      "@headlessui/react",
      "@heroicons/react"
    ],
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      },
      jsx: "automatic"
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    copyPublicDir: true,
    rollupOptions: {
      output: {
        interop: "auto",
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["@headlessui/react", "@heroicons/react"],
          "chart-vendor": ["chart.js", "react-chartjs-2"],
          "map-vendor": ["leaflet", "react-leaflet"],
          "utility-vendor": ["axios", "lodash", "date-fns"]
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    },
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx0cmF2ZWxfd2Vic3lzXFxcXFRyYXZlbF9XZWJzeXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHRyYXZlbF93ZWJzeXNcXFxcVHJhdmVsX1dlYnN5c1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovdHJhdmVsX3dlYnN5cy9UcmF2ZWxfV2Vic3lzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB0YWlsd2luZCBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcclxuXHJcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBiYXNlOiAnLi8nLFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KHtcclxuICAgICAganN4UnVudGltZTogJ2F1dG9tYXRpYycsXHJcbiAgICAgIGJhYmVsOiB7XHJcbiAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAgWydAYmFiZWwvcGx1Z2luLXRyYW5zZm9ybS1yZWFjdC1qc3gnLCB7XHJcbiAgICAgICAgICAgIHJ1bnRpbWU6ICdhdXRvbWF0aWMnLFxyXG4gICAgICAgICAgICBpbXBvcnRTb3VyY2U6ICdyZWFjdCdcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICAgIHRhaWx3aW5kKCkgLy8gT2ZmaWNpYWwgVGFpbHdpbmQgVml0ZSBwbHVnaW5cclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICAgICdyZWFjdCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvcmVhY3QnKSxcclxuICAgICAgJ3JlYWN0LWRvbSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvcmVhY3QtZG9tJyksXHJcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXItZG9tJyksXHJcbiAgICAgICdyZWFjdC1pY29ucyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvcmVhY3QtaWNvbnMnKSxcclxuICAgICAgJ2xlYWZsZXQnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzL2xlYWZsZXQvZGlzdC9sZWFmbGV0LXNyYy5lc20uanMnKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA1MTc0LFxyXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL29tYWlyaXEuYXp1cmV3ZWJzaXRlcy5uZXQvbG9naW4nLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgY29uZmlndXJlOiAocHJveHkpID0+IHtcclxuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSkgPT4ge1xyXG4gICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoXHJcbiAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nLCBcclxuICAgICAgICAgICAgICAnQmVhcmVyIE5UTXpORFV3TURwQlNWSkpVU0JVUlZOVUlFRlFTVG94T0RreE9UTXdNRE0xT1RrMk9sQnZUakUyTkdOa0x5OWhlRTUzV0M5aE0wMHJTMVpyY25KU2EyUTBTMDVhZEhsM1EwTkhabVU0VXpnOSdcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogW1xyXG4gICAgICAncmVhY3QnLFxyXG4gICAgICAncmVhY3QtZG9tJyxcclxuICAgICAgJ3JlYWN0L2pzeC1ydW50aW1lJyxcclxuICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxyXG4gICAgICAncmVhY3QtaWNvbnMnLFxyXG4gICAgICAnbGVhZmxldCcsXHJcbiAgICAgICdyZWFjdC1sZWFmbGV0JyxcclxuICAgICAgJ0BoZWFkbGVzc3VpL3JlYWN0JyxcclxuICAgICAgJ0BoZXJvaWNvbnMvcmVhY3QnXHJcbiAgICBdLFxyXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgbG9hZGVyOiB7XHJcbiAgICAgICAgJy5qcyc6ICdqc3gnXHJcbiAgICAgIH0sXHJcbiAgICAgIGpzeDogJ2F1dG9tYXRpYydcclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXHJcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgY29weVB1YmxpY0RpcjogdHJ1ZSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgaW50ZXJvcDogJ2F1dG8nLFxyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgJ3JlYWN0LXZlbmRvcic6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcclxuICAgICAgICAgICd1aS12ZW5kb3InOiBbJ0BoZWFkbGVzc3VpL3JlYWN0JywgJ0BoZXJvaWNvbnMvcmVhY3QnXSxcclxuICAgICAgICAgICdjaGFydC12ZW5kb3InOiBbJ2NoYXJ0LmpzJywgJ3JlYWN0LWNoYXJ0anMtMiddLFxyXG4gICAgICAgICAgJ21hcC12ZW5kb3InOiBbJ2xlYWZsZXQnLCAncmVhY3QtbGVhZmxldCddLFxyXG4gICAgICAgICAgJ3V0aWxpdHktdmVuZG9yJzogWydheGlvcycsICdsb2Rhc2gnLCAnZGF0ZS1mbnMnXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XSdcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbW1vbmpzT3B0aW9uczoge1xyXG4gICAgICBpbmNsdWRlOiBbL25vZGVfbW9kdWxlcy9dXHJcbiAgICB9XHJcbiAgfVxyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQWtSLFNBQVMsb0JBQW9CO0FBQy9TLE9BQU8sV0FBVztBQUNsQixPQUFPLGNBQWM7QUFDckIs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
