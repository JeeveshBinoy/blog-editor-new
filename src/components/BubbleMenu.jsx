// src/components/BubbleMenu.jsx - FIXED VERSION
import React, { useEffect, useState, useRef } from "react";
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
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const bubbleMenuRef = useRef(null);
  const urlInputRef = useRef(null);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      try {
        const { state } = editor;
        const { from, to } = state.selection;
        
        // Check if selection is within regular text (not in embeds or special nodes)
        const isTextSelection = isRegularTextSelection(editor, from, to);
        
        // Show bubble menu only when text is selected and it's regular text content
        if (from !== to && isTextSelection) {
          const { view } = editor;
          const start = view.coordsAtPos(from);
          const end = view.coordsAtPos(to);
          
          // Position the menu above the selected text
          setPosition({
            x: (start.left + end.left) / 2,
            y: start.top - 50
          });
          setIsVisible(true);
          setShowUrlInput(false); // Hide URL input when selection changes
        } else {
          setIsVisible(false);
          setShowUrlInput(false);
        }
      } catch (error) {
        console.error('BubbleMenu selection update error:', error);
        setIsVisible(false);
        setShowUrlInput(false);
      }
    };

    // Helper function to check if selection is in regular text (not embeds)
    const isRegularTextSelection = (editor, from, to) => {
      try {
        const { state } = editor;
        const { doc } = state;
        
        // Check each position in the selection range
        for (let pos = from; pos <= to; pos++) {
          const $pos = doc.resolve(pos);
          const node = $pos.parent;
          
          // List of embed/special node types that should NOT show bubble menu
          const embedNodeTypes = [
            'htmlBlock',
            'bookmark', 
            'youtube',
            'unsplash',
            'imageBlock',
            'dividerBlock',
            'twitter',
            'codeBlock'
          ];
          
          // If any part of the selection is in an embed node, don't show bubble menu
          if (embedNodeTypes.includes(node.type.name)) {
            return false;
          }
          
          // Also check if we're inside a node with custom attributes (editing mode)
          const attrs = node.attrs;
          if (attrs && attrs.editing === true) {
            return false;
          }
        }
        
        // Additional check: make sure we're not selecting across different node types
        const $from = doc.resolve(from);
        const $to = doc.resolve(to);
        
        if ($from.parent.type !== $to.parent.type) {
          return false;
        }
        
        // Only allow bubble menu for basic text nodes
        const allowedNodeTypes = ['paragraph', 'listItem', 'text'];
        return allowedNodeTypes.includes($from.parent.type.name);
        
      } catch (error) {
        console.error('Error checking text selection:', error);
        return false;
      }
    };

    const handleClick = (event) => {
      // Only hide if click is outside bubble menu
      if (bubbleMenuRef.current && !bubbleMenuRef.current.contains(event.target)) {
        setIsVisible(false);
        setShowUrlInput(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
        setShowUrlInput(false);
      }
    };

    // Safe event listener setup
    try {
      editor.on('selectionUpdate', handleSelectionUpdate);
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleKeyDown);
    } catch (error) {
      console.error('BubbleMenu event listener setup error:', error);
    }
    
    return () => {
      try {
        editor.off('selectionUpdate', handleSelectionUpdate);
        document.removeEventListener('mousedown', handleClick);
        document.removeEventListener('keydown', handleKeyDown);
      } catch (error) {
        console.error('BubbleMenu cleanup error:', error);
      }
    };
  }, [editor]);

  // Focus URL input when it appears
  useEffect(() => {
    if (showUrlInput && urlInputRef.current) {
      urlInputRef.current.focus();
      const previousUrl = editor.getAttributes('link').href;
      setUrlValue(previousUrl || '');
    }
  }, [showUrlInput, editor]);

  // Safe button handler
  const createSafeButtonHandler = (handler) => {
    return () => {
      try {
        handler();
      } catch (error) {
        console.error('BubbleMenu button handler error:', error);
      }
    };
  };

  // Handle link click
  const handleLinkClick = () => {
    if (editor.isActive('link')) {
      // Remove link if already active
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      // Show URL input
      setShowUrlInput(true);
    }
  };

  // Handle URL submission
  const handleUrlSubmit = () => {
    try {
      if (urlValue.trim()) {
        editor.chain().focus().extendMarkRange('link').setLink({ href: urlValue.trim() }).run();
      } else {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      }
      setShowUrlInput(false);
      setUrlValue("");
    } catch (error) {
      console.error('URL submission error:', error);
      setShowUrlInput(false);
      setUrlValue("");
    }
  };

  // Handle URL input key events
  const handleUrlKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    } else if (e.key === 'Escape') {
      setShowUrlInput(false);
      setUrlValue("");
    }
  };

  // Don't render if no editor or not visible
  if (!editor || !isVisible) return null;

  return (
    <div 
      ref={bubbleMenuRef}
      className="bubble-menu"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Text Formatting */}
      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().toggleBold().run())}
        title="Bold"
        style={{
          background: editor.isActive('bold') ? '#3b82f6' : 'transparent',
          color: editor.isActive('bold') ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <FaBold size={14} />
      </button>

      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().toggleItalic().run())}
        title="Italic"
        style={{
          background: editor.isActive('italic') ? '#3b82f6' : 'transparent',
          color: editor.isActive('italic') ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <FaItalic size={14} />
      </button>

      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().toggleUnderline().run())}
        title="Underline"
        style={{
          background: editor.isActive('underline') ? '#3b82f6' : 'transparent',
          color: editor.isActive('underline') ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <FaUnderline size={14} />
      </button>

      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().toggleStrike().run())}
        title="Strikethrough"
        style={{
          background: editor.isActive('strike') ? '#3b82f6' : 'transparent',
          color: editor.isActive('strike') ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <FaStrikethrough size={14} />
      </button>

      {/* Separate H2 and H3 buttons */}
      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().setHeading({ level: 2 }).run())}
        title="Heading 2"
        style={{
          background: editor.isActive('heading', { level: 2 }) ? '#3b82f6' : 'transparent',
          color: editor.isActive('heading', { level: 2 }) ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          fontWeight: 'bold',
          fontSize: '12px'
        }}
      >
        H2
      </button>

      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().setHeading({ level: 3 }).run())}
        title="Heading 3"
        style={{
          background: editor.isActive('heading', { level: 3 }) ? '#3b82f6' : 'transparent',
          color: editor.isActive('heading', { level: 3 }) ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          fontWeight: 'bold',
          fontSize: '12px'
        }}
      >
        H3
      </button>

      {/* Lists */}
      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().toggleBulletList().run())}
        title="Bullet List"
        style={{
          background: editor.isActive('bulletList') ? '#3b82f6' : 'transparent',
          color: editor.isActive('bulletList') ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <FaListUl size={14} />
      </button>

      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().toggleOrderedList().run())}
        title="Numbered List"
        style={{
          background: editor.isActive('orderedList') ? '#3b82f6' : 'transparent',
          color: editor.isActive('orderedList') ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <FaListOl size={14} />
      </button>

      {/* Blockquote */}
      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().toggleBlockquote().run())}
        title="Blockquote"
        style={{
          background: editor.isActive('blockquote') ? '#3b82f6' : 'transparent',
          color: editor.isActive('blockquote') ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <FaQuoteLeft size={14} />
      </button>

      {/* Code */}
      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().toggleCode().run())}
        title="Inline Code"
        style={{
          background: editor.isActive('code') ? '#3b82f6' : 'transparent',
          color: editor.isActive('code') ? 'white' : '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <FaCode size={14} />
      </button>

      {/* Link with URL Input */}
      {showUrlInput ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'white',
          padding: '4px',
          borderRadius: '4px',
          border: '1px solid #3b82f6',
          minWidth: '200px'
        }}>
          <input
            ref={urlInputRef}
            type="text"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={handleUrlKeyDown}
            placeholder="Enter URL and press Enter"
            style={{
              border: 'none',
              outline: 'none',
              padding: '4px 6px',
              fontSize: '12px',
              width: '100%',
              background: 'transparent'
            }}
          />
          <button
            onClick={handleUrlSubmit}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            OK
          </button>
        </div>
      ) : (
        <button
          onClick={createSafeButtonHandler(handleLinkClick)}
          title="Link"
          style={{
            background: editor.isActive('link') ? '#3b82f6' : 'transparent',
            color: editor.isActive('link') ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <FaLink size={14} />
        </button>
      )}

      {/* Horizontal Rule */}
      <button
        onClick={createSafeButtonHandler(() => editor.chain().focus().setHorizontalRule().run())}
        title="Horizontal Rule"
        style={{
          background: 'transparent',
          color: '#374151',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <FaMinus size={16} />
      </button>
    </div>
  );
}