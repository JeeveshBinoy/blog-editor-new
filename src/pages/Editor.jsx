// src/pages/Editor.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineLeft } from "react-icons/ai";
import RichTextEditor from "../components/RichTextEditor";
import { usePostStore } from "../store/postStore";
import "../styles/editor.css";
import "../styles/rich-text-editor.css";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const posts = usePostStore((s) => s.posts);
  const addPost = usePostStore((s) => s.addPost);
  const updatePost = usePostStore((s) => s.updatePost);

  const [title, setTitle] = useState("");
  const [cover, setCover] = useState(null);
  const [draftStatus, setDraftStatus] = useState(id ? "Loading..." : "New");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(!!id);

  console.log('Editor mounted with id:', id);
  console.log('Available posts:', posts);

  // Load post data for editing
  useEffect(() => {
    if (id) {
      console.log('Loading post with id:', id);
      const post = posts.find((p) => p.id === id);
      
      if (post) {
        console.log('Post found:', post);
        setTitle(post.title || "");
        setContent(post.content || "");
        setCover(post.featuredImage || null);
        setDraftStatus("Saved");
      } else {
        console.warn('Post not found with id:', id);
        setDraftStatus("New Post");
      }
      setIsLoading(false);
    } else {
      // New post - reset everything
      console.log('Creating new post');
      setTitle("");
      setContent("");
      setCover(null);
      setDraftStatus("New");
      setIsLoading(false);
    }
  }, [id, posts]);

  // Save function
  const handleSave = useCallback(
    (contentToSave = content, featuredImage = cover) => {
      console.log('Saving post...', { id, title, contentToSave });
      
      const now = new Date().toISOString();
      
      if (id) {
        // Update existing post
        updatePost(id, {
          title,
          content: contentToSave,
          featuredImage,
          updatedAt: now,
        });
        console.log('Post updated:', id);
        setDraftStatus("Saved");
      } else {
        // Create new post
        const newPost = {
          id: Date.now().toString(),
          title: title || "Untitled Post",
          content: contentToSave,
          featuredImage,
          createdAt: now,
          updatedAt: now,
        };
        console.log('Creating new post:', newPost);
        addPost(newPost);
        setDraftStatus("Saved");
      }
    },
    [id, title, content, cover, addPost, updatePost]
  );

  // Auto-save when content changes
  useEffect(() => {
    if ((content && content !== '<p></p>') || title) {
      setDraftStatus("Saving...");
      const timeoutId = setTimeout(() => {
        handleSave(content, cover);
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [content, title, cover, handleSave]);

  // Cover upload
  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCover(url);
      setDraftStatus("Saving...");
      handleSave(content, url);
    }
  };

  // Handle publish
  const handlePublish = () => {
    handleSave();
    alert('Post published!');
  };

  // FIXED: Simple back navigation
  const handleBack = () => {
    navigate("/home");
  };

  // Show loading state while fetching post data
  if (isLoading) {
    return (
      <div className="editor-container container">
        <div className="editor-header">
          <div className="editor-left">
            <button className="back-btn" onClick={handleBack}>
              <AiOutlineLeft /> Posts
            </button>
            <span className="draft-status">Loading...</span>
          </div>
        </div>
        <div className="loading-state">
          <h2>Loading post...</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container container">
      {/* Header */}
      <div className="editor-header">
        <div className="editor-left">
          <button className="back-btn" onClick={handleBack}>
            <AiOutlineLeft /> Posts
          </button>
          <span className="draft-status">Draft - {draftStatus}</span>
        </div>
        <div className="editor-right">
          <button className="preview-btn">Preview</button>
          <button className="publish-btn" onClick={handlePublish}>
            Publish
          </button>
        </div>
      </div>

      {/* Cover */}
      <div
        className="cover-upload-placeholder"
        onClick={() => document.getElementById("coverInput").click()}
      >
        {cover ? (
          <img
            src={cover}
            alt="Cover"
            style={{ width: "100%", borderRadius: 8 }}
          />
        ) : (
          <>
            <p>Click to upload post cover or drag and drop</p>
            <p>SVG, PNG, JPG or GIF (recommended: 1800×840)</p>
          </>
        )}
        <input
          type="file"
          id="coverInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleCoverUpload}
        />
      </div>

      {/* Title */}
      <input
        className="title-input"
        placeholder="# Post title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setDraftStatus("Saving...");
        }}
      />

      {/* Rich Text Editor */}
      <RichTextEditor
        key={id || "new"}
        initialContent={content}
        onChange={(html) => {
          console.log('Content changed:', html);
          setContent(html);
          setDraftStatus("Saving...");
        }}
        onSaved={() => setDraftStatus("Saved")}
      />
    </div>
  );
}