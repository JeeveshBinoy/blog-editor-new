// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { usePostStore } from "../store/postStore";
import "../styles/home.css";

export default function Home() {
  const posts = usePostStore((s) => s.posts);
  const deletePost = usePostStore((s) => s.deletePost);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Exact time formatting from screenshot
  const formatTimeDisplay = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `Published ${date.getDate().toString().padStart(2, '0')} ${date.toLocaleDateString('en-US', { 
        month: 'short' 
      })} ${date.getFullYear()}`;
    }
  };

  // FIXED: Remove { replace: true } from navigation
  const handleEditPost = (postId) => {
    navigate(`/editor/${postId}`);
  };

  const handleNewPost = () => {
    navigate("/editor");
  };

  return (
    <div className="home-container">
      {/* Main Title */}
      <h1 className="home-main-title">Posts</h1>
      
      {/* Search Section */}
      <div className="search-section">
        <div className="search-header">
          <h2 className="search-title">Search Posts</h2>
          <div className="search-header-divider"></div>
        </div>
        
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* New Post Button */}
      <button 
        className="new-post-button"
        onClick={handleNewPost}
      >
        <AiOutlinePlus className="plus-icon" />
        New post
      </button>

      {/* Content Divider */}
      <div className="content-divider"></div>

      {/* Posts List */}
      <div className="posts-list-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No posts found</p>
            <p className="empty-state-subtext">Create your first post using New post.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-content">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
                  </p>
                  <div className="post-meta">
                    {formatTimeDisplay(post.updatedAt || post.createdAt)}
                  </div>
                </div>
                <div className="post-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditPost(post.id)}
                  >
                    <FiEdit2 className="edit-icon" />
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => deletePost(post.id)}
                  >
                    <FiTrash2 className="delete-icon" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}