import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
        strictPort: true,
    },
    preview: {
        port: 4173,
    },
    build: {
        target: "es2020",
        cssMinify: true,
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    if (!id.includes("node_modules")) return;
                    if (/[\\/]react(-dom|-router-dom)?[\\/]/.test(id)) {
                        return "react";
                    }
                    if (/lucide-react|react-hot-toast/.test(id)) {
                        return "ui";
                    }
                },
            },
        },
    },
});
