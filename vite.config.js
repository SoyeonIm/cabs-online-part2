// Student: hpr7339
// File: vite.config.js
// Description: Vite build configuration for CabsOnline Part 2 React app.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/cabs-online-part2/",
});
