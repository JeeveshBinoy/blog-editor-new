// src/components/Embed/ImageBlock.jsx
import React, { useState, useEffect, useRef } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function ImageBlockComponent({ node, updateAttributes }) {
  const [src, setSrc] = useState(node.attrs.src || "");
  const [caption, setCaption] = useState(node.attrs.caption || "");
  const fileRef = useRef();

  useEffect(() => {
    updateAttributes({ src, caption });
  }, [src, caption, updateAttributes]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSrc(objectUrl);
    }
  };

  const handleUrlSubmit = (e) => {
    if (e.key === "Enter" && src.trim()) {
      updateAttributes({ src });
    }
  };

  if (!src) {
    return (
      <NodeViewWrapper>
        <div className="image-upload-container">
          <div 
            className="image-upload-area"
            onClick={() => fileRef.current?.click()}
          >
            <div className="upload-content">
              <div className="upload-text">
                <p className="upload-title">Click to upload post cover or drag and drop</p>
                <p className="upload-subtitle">SVG, PNG, JPG or GIF (recommended: 1600×840)</p>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileRef} 
              onChange={handleFileUpload} 
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <div className="image-block">
        <img src={src} alt="Uploaded content" className="uploaded-image" />
      </div>
    </NodeViewWrapper>
  );
}