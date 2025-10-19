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
  const [draftStatus, setDraftStatus] = useState("New");
  const [content, setContent] = useState("");

  // Defensive: wait for posts to load if editing
  const post = id ? posts.find((p) => p.id === id) : null;
  if (id && !post) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading post...</h2>
        <p>Please wait or go back to the Home page.</p>
      </div>
    );
  }

  // Save
  const handleSave = useCallback(
    (contentToSave = content, featuredImage = cover) => {
      const now = new Date().toISOString();
      if (id) {
        updatePost(id, {
          title,
          content: contentToSave,
          featuredImage,
          updatedAt: now,
        });
      } else {
        const newPost = {
          id: Date.now().toString(),
          title,
          content: contentToSave,
          featuredImage,
          createdAt: now,
          updatedAt: now,
        };
        addPost(newPost);
        navigate(`/editor/${newPost.id}`);
      }
      setDraftStatus("Saved");
    },
    [id, title, content, cover, addPost, updatePost, navigate]
  );

  // Load post data
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setDraftStatus("Saved");
      setCover(post.featuredImage || null);
    }
  }, [post]);

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

  return (
    <div className="editor-container container">
      {/* Header */}
      <div className="editor-header">
        <div className="editor-left">
          <button className="back-btn" onClick={() => navigate("/home")}>
            <AiOutlineLeft /> Posts
          </button>
          <span className="draft-status">Draft - {draftStatus}</span>
        </div>
        <div className="editor-right">
          <button className="preview-btn">Preview</button>
          <button className="publish-btn" onClick={() => handleSave(content)}>
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
        initialContent={content}
        onChange={(html) => {
          setContent(html);
          setDraftStatus("Saving...");
        }}
        onSaved={() => setDraftStatus("Saved")}
      />
    </div>
  );
}
