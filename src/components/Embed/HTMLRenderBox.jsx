// src/components/Embed/HTMLRenderBox.jsx
import React, { useState, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function HtmlBlockComponent({ node, updateAttributes }) {
  const [html, setHtml] = useState(node.attrs.html || "");
  const [isEditing, setIsEditing] = useState(!node.attrs.html);

  useEffect(() => {
    updateAttributes({ html });
  }, [html, updateAttributes]);

  const handleSubmit = (e) => {
    if (e.key === "Enter" && html.trim()) {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <NodeViewWrapper>
        <div className="html-block">
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            onKeyDown={handleSubmit}
            placeholder="Paste HTML code... (Enter to submit)"
            className="html-textarea"
            rows={6}
          />
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <div className="html-rendered">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <button 
          onClick={() => setIsEditing(true)}
          className="edit-html-btn"
        >
          Edit HTML
        </button>
      </div>
    </NodeViewWrapper>
  );
}