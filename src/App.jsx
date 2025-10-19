import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Editor from "./pages/Editor";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/editor/:id" element={<Editor />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
