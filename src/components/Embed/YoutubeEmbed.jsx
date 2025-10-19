// src/components/Embed/YoutubeEmbed.jsx
import React, { useState, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function YoutubeEmbed({ node, updateAttributes }) {
  const [url, setUrl] = useState(node.attrs.url || "");
  const [editing, setEditing] = useState(node.attrs.editing);

  useEffect(() => {
    updateAttributes({ editing });
  }, [editing, updateAttributes]);

  const getVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter" && url.trim()) {
      const videoId = getVideoId(url);
      if (videoId) {
        updateAttributes({ 
          src: `https://www.youtube.com/embed/${videoId}`,
          url: url,
          editing: false 
        });
        setEditing(false);
      } else {
        alert("Please enter a valid YouTube URL");
      }
    }
  };

  if (editing) {
    return (
      <NodeViewWrapper>
        <div className="youtube-embed-editor">
          <div className="embed-input-overlay">
            <div className="embed-input-container">
              <input
                placeholder="Paste a YouTube URL..."
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

  const videoId = getVideoId(node.attrs.url);

  return (
    <NodeViewWrapper>
      <div className="youtube-embed-preview">
        <div className="youtube-video-container">
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
            className="youtube-iframe"
          />
        </div>
        <div className="embed-actions">
          <button 
            onClick={() => setEditing(true)}
            className="edit-embed-btn"
          >
            Change Video
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}