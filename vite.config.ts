import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
