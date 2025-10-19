// src/components/BubbleMenu.jsx
import React, { useEffect, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaLink,
  FaCode,
  FaMinus
} from "react-icons/fa";

export default function BubbleMenu({ editor }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { state } = editor;
      const { from, to } = state.selection;
      
      // Show bubble menu only when text is selected (not empty selection)
      if (from !== to) {
        const { view } = editor;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);
        
        // Position the menu above the selected text
        setPosition({
          x: (start.left + end.left) / 2,
          y: start.top - 50
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleClick = () => {
      setIsVisible(false);
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    document.addEventListener('click', handleClick);
    
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      document.removeEventListener('click', handleClick);
    };
  }, [editor]);

  if (!isVisible || !editor) return null;

  return (
    <div 
      className="bubble-menu"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%)',
        zIndex: 1000
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`bubble-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
        title="Bold"
      >
        <FaBold size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`bubble-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
        title="Italic"
      >
        <FaItalic size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`bubble-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
        title="Underline"
      >
        <FaUnderline size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`bubble-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
        title="Strikethrough"
      >
        <FaStrikethrough size={14} />
      </button>

      {/* Headings */}
      <div className="bubble-dropdown">
        <button className="bubble-btn" title="Headings">
          <FaHeading size={14} />
        </button>
        <div className="bubble-dropdown-content">
          <button
            onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
            className={`bubble-dropdown-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
            className={`bubble-dropdown-btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`bubble-dropdown-btn ${editor.isActive('paragraph') ? 'is-active' : ''}`}
          >
            Paragraph
          </button>
        </div>
      </div>

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`bubble-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
        title="Bullet List"
      >
        <FaListUl size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`bubble-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
        title="Numbered List"
      >
        <FaListOl size={14} />
      </button>

      {/* Blockquote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`bubble-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
        title="Blockquote"
      >
        <FaQuoteLeft size={14} />
      </button>

      {/* Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`bubble-btn ${editor.isActive('code') ? 'is-active' : ''}`}
        title="Inline Code"
      >
        <FaCode size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`bubble-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
        title="Code Block"
      >
        <FaCode size={16} />
      </button>

      {/* Link */}
      <button
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('Enter URL', previousUrl);

          if (url === null) return;
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }

          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={`bubble-btn ${editor.isActive('link') ? 'is-active' : ''}`}
        title="Link"
      >
        <FaLink size={14} />
      </button>

      {/* Horizontal Rule */}
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="bubble-btn"
        title="Horizontal Rule"
      >
        <FaMinus size={16} />
      </button>
    </div>
  );
}