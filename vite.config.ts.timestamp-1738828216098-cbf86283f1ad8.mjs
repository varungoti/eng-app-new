var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/api/process-image.ts
var process_image_exports = {};
__export(process_image_exports, {
  processImage: () => processImage
});
import cors from "file:///C:/Users/varun/eng-app-new/node_modules/cors/lib/index.js";
import { supabase } from "@/lib/supabase";
var corsOptions, corsMiddleware, processImage;
var init_process_image = __esm({
  "src/api/process-image.ts"() {
    "use strict";
    corsOptions = {
      origin: process.env.VITE_APP_URL || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 3600
    };
    corsMiddleware = cors(corsOptions);
    processImage = async (req, res) => {
      await new Promise((resolve) => corsMiddleware(req, res, resolve));
      try {
        const { url, options } = req.body;
        if (!url) {
          return res.status(400).json({ error: "URL is required" });
        }
        let imageBlob;
        if (url.startsWith("http")) {
          const response = await fetch(url);
          imageBlob = await response.blob();
        } else {
          const cleanPath = url.replace(/^\/+/, "").replace(/^images\//, "");
          const { data: signedURL, error: signError } = await supabase.storage.from("images").createSignedUrl(cleanPath, 60);
          if (signError || !signedURL) {
            return res.status(404).json({ error: "Image not found" });
          }
          const response = await fetch(signedURL.signedUrl);
          imageBlob = await response.blob();
        }
        const fileName = `processed_${Date.now()}.webp`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("processed-images").upload(fileName, imageBlob, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: true
        });
        if (uploadError) {
          throw uploadError;
        }
        const { data: processedUrl } = await supabase.storage.from("processed-images").createSignedUrl(fileName, 3600);
        return res.json({
          processedUrl: processedUrl?.signedUrl,
          success: true
        });
      } catch (error) {
        console.error("Image processing error:", error);
        return res.status(500).json({
          error: "Failed to process image",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    };
  }
});

// vite.config.ts
import { defineConfig } from "file:///C:/Users/varun/eng-app-new/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/varun/eng-app-new/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\varun\\eng-app-new";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "vite-express-custom",
      configureServer(server) {
        server.middlewares.use("/api/process-image", (req, res) => {
          (init_process_image(), __toCommonJS(process_image_exports)).default(req, res);
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src"),
      "@components": path.resolve(__vite_injected_original_dirname, "src/components"),
      "@lib": path.resolve(__vite_injected_original_dirname, "src/lib"),
      "@hooks": path.resolve(__vite_injected_original_dirname, "src/hooks"),
      "@pages": path.resolve(__vite_injected_original_dirname, "src/pages"),
      "@types": path.resolve(__vite_injected_original_dirname, "src/types")
    }
  },
  server: {
    hmr: {
      overlay: true
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      "Cross-Origin-Resource-Policy": "cross-origin"
    },
    proxy: {
      "/maps/api": {
        target: "https://maps.googleapis.com",
        changeOrigin: true,
        secure: true,
        headers: {
          "Cross-Origin-Resource-Policy": "cross-origin"
        },
        rewrite: (path2) => path2.replace(/^\/maps/, "")
      },
      "/maps/place": {
        target: "https://maps.googleapis.com",
        changeOrigin: true,
        secure: true,
        headers: {
          "Cross-Origin-Resource-Policy": "cross-origin"
        },
        rewrite: (path2) => path2.replace(/^\/maps/, "")
      },
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": ["@tanstack/react-query", "lucide-react"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3
  },
  optimizeDeps: {
    include: [
      "lucide-react",
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "@supabase/ssr",
      "@supabase/supabase-js",
      "@supabase/gotrue-js"
    ]
  },
  envDir: "./",
  envPrefix: "VITE_",
  define: {
    //'process.env': process.env,
    "process.env": {},
    __GOOGLE_MAPS_API_KEY__: JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.browser": true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2FwaS9wcm9jZXNzLWltYWdlLnRzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdmFydW5cXFxcZW5nLWFwcC1uZXdcXFxcc3JjXFxcXGFwaVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdmFydW5cXFxcZW5nLWFwcC1uZXdcXFxcc3JjXFxcXGFwaVxcXFxwcm9jZXNzLWltYWdlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy92YXJ1bi9lbmctYXBwLW5ldy9zcmMvYXBpL3Byb2Nlc3MtaW1hZ2UudHNcIjtpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcclxuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tICdAL2xpYi9zdXBhYmFzZSc7XHJcblxyXG4vLyBDT1JTIGNvbmZpZ3VyYXRpb25cclxuY29uc3QgY29yc09wdGlvbnMgPSB7XHJcbiAgb3JpZ2luOiBwcm9jZXNzLmVudi5WSVRFX0FQUF9VUkwgfHwgJyonLFxyXG4gIG1ldGhvZHM6IFsnR0VUJywgJ1BPU1QnLCAnUFVUJywgJ0RFTEVURScsICdPUFRJT05TJ10sXHJcbiAgYWxsb3dlZEhlYWRlcnM6IFsnQ29udGVudC1UeXBlJywgJ0F1dGhvcml6YXRpb24nXSxcclxuICBjcmVkZW50aWFsczogdHJ1ZSxcclxuICBtYXhBZ2U6IDM2MDBcclxufTtcclxuXHJcbi8vIEFwcGx5IENPUlMgbWlkZGxld2FyZVxyXG5jb25zdCBjb3JzTWlkZGxld2FyZSA9IGNvcnMoY29yc09wdGlvbnMpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHByb2Nlc3NJbWFnZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAvLyBBcHBseSBDT1JTXHJcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IGNvcnNNaWRkbGV3YXJlKHJlcSwgcmVzLCByZXNvbHZlKSk7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IHVybCwgb3B0aW9ucyB9ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgaWYgKCF1cmwpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6ICdVUkwgaXMgcmVxdWlyZWQnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERvd25sb2FkIGltYWdlIGZyb20gU3VwYWJhc2Ugb3IgZXh0ZXJuYWwgVVJMXHJcbiAgICBsZXQgaW1hZ2VCbG9iOiBCbG9iO1xyXG4gICAgaWYgKHVybC5zdGFydHNXaXRoKCdodHRwJykpIHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICBpbWFnZUJsb2IgPSBhd2FpdCByZXNwb25zZS5ibG9iKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBjbGVhblBhdGggPSB1cmwucmVwbGFjZSgvXlxcLysvLCAnJykucmVwbGFjZSgvXmltYWdlc1xcLy8sICcnKTtcclxuICAgICAgY29uc3QgeyBkYXRhOiBzaWduZWRVUkwsIGVycm9yOiBzaWduRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgLnN0b3JhZ2VcclxuICAgICAgICAuZnJvbSgnaW1hZ2VzJylcclxuICAgICAgICAuY3JlYXRlU2lnbmVkVXJsKGNsZWFuUGF0aCwgNjApO1xyXG5cclxuICAgICAgaWYgKHNpZ25FcnJvciB8fCAhc2lnbmVkVVJMKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6ICdJbWFnZSBub3QgZm91bmQnIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHNpZ25lZFVSTC5zaWduZWRVcmwpO1xyXG4gICAgICBpbWFnZUJsb2IgPSBhd2FpdCByZXNwb25zZS5ibG9iKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJvY2VzcyBpbWFnZSBhbmQgdXBsb2FkIHRvIFN1cGFiYXNlXHJcbiAgICBjb25zdCBmaWxlTmFtZSA9IGBwcm9jZXNzZWRfJHtEYXRlLm5vdygpfS53ZWJwYDtcclxuICAgIGNvbnN0IHsgZGF0YTogdXBsb2FkRGF0YSwgZXJyb3I6IHVwbG9hZEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuc3RvcmFnZVxyXG4gICAgICAuZnJvbSgncHJvY2Vzc2VkLWltYWdlcycpXHJcbiAgICAgIC51cGxvYWQoZmlsZU5hbWUsIGltYWdlQmxvYiwge1xyXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnaW1hZ2Uvd2VicCcsXHJcbiAgICAgICAgY2FjaGVDb250cm9sOiAnMzYwMCcsXHJcbiAgICAgICAgdXBzZXJ0OiB0cnVlXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIGlmICh1cGxvYWRFcnJvcikge1xyXG4gICAgICB0aHJvdyB1cGxvYWRFcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgc2lnbmVkIFVSTCBmb3IgcHJvY2Vzc2VkIGltYWdlXHJcbiAgICBjb25zdCB7IGRhdGE6IHByb2Nlc3NlZFVybCB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLnN0b3JhZ2VcclxuICAgICAgLmZyb20oJ3Byb2Nlc3NlZC1pbWFnZXMnKVxyXG4gICAgICAuY3JlYXRlU2lnbmVkVXJsKGZpbGVOYW1lLCAzNjAwKTtcclxuXHJcbiAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICBwcm9jZXNzZWRVcmw6IHByb2Nlc3NlZFVybD8uc2lnbmVkVXJsLFxyXG4gICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICB9KTtcclxuXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0ltYWdlIHByb2Nlc3NpbmcgZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcclxuICAgICAgZXJyb3I6ICdGYWlsZWQgdG8gcHJvY2VzcyBpbWFnZScsXHJcbiAgICAgIGRldGFpbHM6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InXHJcbiAgICB9KTtcclxuICB9XHJcbn07ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdmFydW5cXFxcZW5nLWFwcC1uZXdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHZhcnVuXFxcXGVuZy1hcHAtbmV3XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy92YXJ1bi9lbmctYXBwLW5ldy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHZpdGVFeHByZXNzIGZyb20gJ3ZpdGUtZXhwcmVzcyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAndml0ZS1leHByZXNzLWN1c3RvbScsXHJcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcclxuICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvYXBpL3Byb2Nlc3MtaW1hZ2UnLCAocmVxLCByZXMpID0+IHtcclxuICAgICAgICAgIHJlcXVpcmUoJy4vc3JjL2FwaS9wcm9jZXNzLWltYWdlJykuZGVmYXVsdChyZXEsIHJlcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgICAnQGNvbXBvbmVudHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbXBvbmVudHMnKSxcclxuICAgICAgJ0BsaWInOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2xpYicpLFxyXG4gICAgICAnQGhvb2tzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9ob29rcycpLFxyXG4gICAgICAnQHBhZ2VzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wYWdlcycpLFxyXG4gICAgICAnQHR5cGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy90eXBlcycpXHJcbiAgICB9XHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhtcjoge1xyXG4gICAgICBvdmVybGF5OiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcclxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgUEFUQ0gsIE9QVElPTlMnLFxyXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdYLVJlcXVlc3RlZC1XaXRoLCBjb250ZW50LXR5cGUsIEF1dGhvcml6YXRpb24nLFxyXG4gICAgICAnQ3Jvc3MtT3JpZ2luLVJlc291cmNlLVBvbGljeSc6ICdjcm9zcy1vcmlnaW4nXHJcbiAgICB9LFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9tYXBzL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20nLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IHRydWUsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgJ0Nyb3NzLU9yaWdpbi1SZXNvdXJjZS1Qb2xpY3knOiAnY3Jvc3Mtb3JpZ2luJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL21hcHMvLCAnJylcclxuICAgICAgfSxcclxuICAgICAgJy9tYXBzL3BsYWNlJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogdHJ1ZSxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAnQ3Jvc3MtT3JpZ2luLVJlc291cmNlLVBvbGljeSc6ICdjcm9zcy1vcmlnaW4nXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvbWFwcy8sICcnKVxyXG4gICAgICB9LFxyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUxNzMnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIHdzOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuICAgICAgICAgICd1aS12ZW5kb3InOiBbJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScsICdsdWNpZGUtcmVhY3QnXSxcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDBcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogW1xyXG4gICAgICAnbHVjaWRlLXJlYWN0JyxcclxuICAgICAgJ3JlYWN0JyxcclxuICAgICAgJ3JlYWN0LWRvbScsXHJcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcclxuICAgICAgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScsXHJcbiAgICAgICdAc3VwYWJhc2Uvc3NyJyxcclxuICAgICAgJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcycsXHJcbiAgICAgICdAc3VwYWJhc2UvZ290cnVlLWpzJ1xyXG4gICAgXVxyXG4gIH0sXHJcbiAgZW52RGlyOiAnLi8nLFxyXG4gIGVudlByZWZpeDogJ1ZJVEVfJyxcclxuICBkZWZpbmU6IHtcclxuICAgIC8vJ3Byb2Nlc3MuZW52JzogcHJvY2Vzcy5lbnYsXHJcbiAgICAncHJvY2Vzcy5lbnYnOiB7fSxcclxuICAgIF9fR09PR0xFX01BUFNfQVBJX0tFWV9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5WSVRFX0dPT0dMRV9NQVBTX0FQSV9LRVkpLFxyXG4gICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuTk9ERV9FTlYpLFxyXG4gICAgJ3Byb2Nlc3MuYnJvd3Nlcic6IHRydWVcclxuICB9XHJcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLE9BQU8sVUFBVTtBQUNqQixTQUFTLGdCQUFnQjtBQUZ6QixJQUtNLGFBU0EsZ0JBRU87QUFo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
