// src/components/Embed/TwitterEmbed.jsx
import React, { useState, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function TwitterEmbed({ node, updateAttributes }) {
  const [url, setUrl] = useState(node.attrs.url || "");
  const [editing, setEditing] = useState(node.attrs.editing);

  useEffect(() => {
    updateAttributes({ editing });
    
    // Load Twitter widgets when not editing
    if (!editing && url && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [editing, url, updateAttributes]);

  const handleSubmit = (e) => {
    if (e.key === "Enter" && url.trim()) {
      updateAttributes({ 
        url: url,
        editing: false 
      });
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <NodeViewWrapper>
        <div className="twitter-embed-editor">
          <div className="embed-input-overlay">
            <div className="embed-input-container">
              <input
                placeholder="Paste Twitter URL and press Enter"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleSubmit}
                className="embed-url-input"
              />
            </div>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <div className="twitter-embed-preview">
        <blockquote className="twitter-tweet">
          <a href={url}></a>
        </blockquote>
        <div className="embed-actions">
          <button 
            onClick={() => setEditing(true)}
            className="edit-embed-btn"
          >
            Change Tweet
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}