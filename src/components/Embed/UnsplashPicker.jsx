// src/components/Embed/UnsplashPicker.jsx
import React, { useEffect, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import axios from "axios";

export default function UnsplashPicker({ node, updateAttributes }) {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(node.attrs.src || "");
  const [editing, setEditing] = useState(node.attrs.editing);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        // Using Picsum as Unsplash alternative for demo
        const res = await axios.get("https://picsum.photos/v2/list?page=1&limit=30");
        setImages(res.data || []);
      } catch (err) { 
        console.error("Failed to fetch images:", err);
        // Fallback mock data
        setImages(Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          download_url: `https://picsum.photos/id/${i + 1}/600/400`,
          author: `Photographer ${i + 1}`
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    updateAttributes({ editing });
  }, [editing, updateAttributes]);

  useEffect(() => {
    if (selected) {
      updateAttributes({ 
        src: selected,
        author: images.find(img => img.download_url === selected)?.author || "Unknown",
        editing: false
      });
      setEditing(false);
    }
  }, [selected, images, updateAttributes]);

  if (!editing && selected) {
    return (
      <NodeViewWrapper>
        <div className="unsplash-preview">
          <div className="selected-image-container">
            <img src={selected} alt="Selected" className="selected-image" />
            <div className="image-credit">
              Photo by {node.attrs.author || "Unknown"}
            </div>
          </div>
          <div className="embed-actions">
            <button 
              onClick={() => setEditing(true)}
              className="edit-embed-btn"
            >
              Change Image
            </button>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  const filteredImages = images.filter(img => 
    img.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <NodeViewWrapper>
      <div className="unsplash-picker-modal">
        <div className="unsplash-header">
          <div className="unsplash-search-container">
            <input 
              placeholder="Search free high-resolution photos" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="unsplash-search-input"
            />
            <button className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
          <button 
            className="close-picker-btn"
            onClick={() => updateAttributes({ editing: false })}
          >
            ×
          </button>
        </div>
        
        <div className="unsplash-grid-container">
          {loading ? (
            <div className="loading-grid">Loading images...</div>
          ) : (
            <div className="unsplash-grid">
              {filteredImages.map((img, index) => (
                <div 
                  key={img.id || index}
                  className="unsplash-image-item"
                  onClick={() => setSelected(img.download_url)}
                >
                  <img 
                    src={img.download_url.replace(/\/\d+\/\d+$/, '/300/200')} 
                    alt={`By ${img.author}`}
                    className="unsplash-thumbnail"
                  />
                  <div className="image-overlay">
                    <span className="author-name">{img.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="unsplash-footer">
          <button className="load-more-btn">
            Load more photos
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}