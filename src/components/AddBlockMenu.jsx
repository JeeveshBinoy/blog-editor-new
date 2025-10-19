// src/components/AddBlockMenu.jsx
import React from "react";

const menuItems = [
  { key: "image", label: "Media", icon: "🖼️" },
  { key: "html", label: "HTML", icon: "📄" },
  { key: "divider", label: "Divider", icon: "➖" },
  { key: "bookmark", label: "Bookmark", icon: "🔖" },
  { key: "youtube", label: "YouTube", icon: "📺" },
  { key: "unsplash", label: "Unsplash", icon: "📷" },
  { key: "twitter", label: "Twitter", icon: "🐦" }
];

export default function AddBlockMenu({ onSelect }) {
  return (
    <div className="add-block-menu-container">
      <div className="block-menu-grid">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className="block-menu-item"
            onClick={() => onSelect(item.key)}
          >
            <span className="block-menu-icon">{item.icon}</span>
            <span className="block-menu-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}