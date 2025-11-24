import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./screens/Register"; // exporta Home por defecto? Ajuste abajo
import RegisterScreenInner from "./screens/Register";
import Admin from "./screens/Admin";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/test" element={<Home />} />
        <Route path="/register" element={<RegisterScreenInner />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
