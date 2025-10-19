// src/components/Embed/BookmarkEmbed.jsx
import React, { useEffect, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function BookmarkEmbed({ node, updateAttributes }) {
  const [url, setUrl] = useState(node.attrs.url || "");
  const [meta, setMeta] = useState({
    title: node.attrs.title || "",
    description: node.attrs.description || "",
    image: node.attrs.image || "",
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(node.attrs.editing);

  const fetchMeta = async (targetUrl) => {
    if (!targetUrl.trim()) return;
    
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMeta = {
        title: "Build your site with YouTube and cool web apps!",
        description: "Build your site with CodeDesign and cool web apps! Dive into the world of innovative web applications and discover how you can enhance your online presence.",
        image: "https://picsum.photos/400/240",
      };
      
      setMeta(mockMeta);
      updateAttributes({ 
        url: targetUrl, 
        ...mockMeta,
        editing: false
      });
      setEditing(false);
    } catch (error) {
      console.error("Failed to fetch bookmark metadata:", error);
      alert("Failed to fetch bookmark information. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateAttributes({ editing });
  }, [editing, updateAttributes]);

  if (editing) {
    return (
      <NodeViewWrapper>
        <div className="bookmark-embed-editor">
          <div className="embed-input-overlay">
            <div className="embed-input-container">
              <input
                type="text"
                placeholder="Paste any URL to create a bookmark..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === "Enter") fetchMeta(url); 
                }}
                className="embed-url-input"
                disabled={loading}
              />
            </div>
          </div>
          {loading && (
            <div className="loading-indicator">
              Loading bookmark information...
            </div>
          )}
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <div className="bookmark-preview">
        <div className="bookmark-card group">
          {meta.image && (
            <div className="bookmark-image">
              <img 
                src={meta.image} 
                alt="Bookmark preview" 
                className="bookmark-img"
              />
            </div>
          )}
          <div className="bookmark-content">
            <div className="bookmark-header">
              <div className="bookmark-info">
                <h3 className="bookmark-title">
                  {meta.title}
                </h3>
                <p className="bookmark-description">
                  {meta.description}
                </p>
                <div className="bookmark-url">
                  <svg className="external-link-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14 21 3"></path>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  </svg>
                  <span>{new URL(url).hostname}</span>
                </div>
              </div>
              <button 
                className="bookmark-remove-btn"
                onClick={() => {
                  setEditing(true);
                  setUrl("");
                  setMeta({ title: "", description: "", image: "" });
                  updateAttributes({ 
                    url: "", 
                    title: "", 
                    description: "", 
                    image: "",
                    editing: true 
                  });
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}