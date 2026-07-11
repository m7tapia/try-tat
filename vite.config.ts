import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite reads this file when starting the local dev server.
export default defineConfig({
  // This plugin lets Vite understand React's JSX syntax in .tsx files.
  plugins: [react()]
});
