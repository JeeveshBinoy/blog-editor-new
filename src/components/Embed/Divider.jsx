// src/components/Embed/Divider.jsx
import React from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function DividerComponent() {
  return (
    <NodeViewWrapper>
      <div className="divider-block">
        <hr className="divider-line" />
      </div>
    </NodeViewWrapper>
  );
}