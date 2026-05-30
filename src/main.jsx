/**
 * Student: hpr7339
 * File: main.jsx
 * Description: Entry point for CabsOnline Part 2 React application.
 *              Mounts the root App component into the DOM.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
