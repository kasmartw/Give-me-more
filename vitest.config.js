import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: ["./vitest.setup.js"],
        globals: true,
        css: false,
        pool: "vmThreads",
    },
    css: {
        postcss: {
            plugins: [],
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "."),
        },
    },
});
