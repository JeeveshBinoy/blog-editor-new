// src/components/RichTextEditor.jsx - FIXED VERSION
import React, { useEffect, useState, useRef } from "react";
import { EditorContent, useEditor, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { FaPlus } from "react-icons/fa";

import AddBlockMenu from "./AddBlockMenu";
import HtmlBlockComponent from "./Embed/HTMLRenderBox";
import BookmarkEmbed from "./Embed/BookmarkEmbed";
import YoutubeEmbed from "./Embed/YoutubeEmbed";
import UnsplashPicker from "./Embed/UnsplashPicker";
import ImageBlockComponent from "./Embed/ImageBlock";
import DividerComponent from "./Embed/Divider";
import TwitterEmbed from "./Embed/TwitterEmbed";
import { Node } from "@tiptap/core";
import BubbleMenu from "./BubbleMenu";

/* --- Node Definitions --- */
const HtmlBlock = Node.create({
  name: "htmlBlock",
  group: "block",
  atom: true,
  addAttributes() { 
    return { 
      html: { default: "" },
      editing: { default: true }
    }; 
  },
  parseHTML() { return [{ tag: "div[data-type='html-block']" }]; },
  renderHTML({ HTMLAttributes }) { 
    return ["div", { ...HTMLAttributes, "data-type": "html-block" }]; 
  },
  addNodeView() { return ReactNodeViewRenderer(HtmlBlockComponent); },
  addCommands() { 
    return { 
      insertHtmlBlock: (attrs) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: { ...attrs, editing: true } });
      }
    }; 
  }
});

const BookmarkNode = Node.create({
  name: "bookmark",
  group: "block",
  atom: true,
  addAttributes() { 
    return { 
      url: { default: "" }, 
      title: { default: "" }, 
      description: { default: "" }, 
      image: { default: "" },
      editing: { default: true }
    }; 
  },
  parseHTML() { return [{ tag: "div[data-type='bookmark']" }]; },
  renderHTML({ HTMLAttributes }) { 
    return ["div", { ...HTMLAttributes, "data-type": "bookmark" }]; 
  },
  addNodeView() { return ReactNodeViewRenderer(BookmarkEmbed); },
  addCommands() { 
    return { 
      insertBookmark: (attrs) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: { ...attrs, editing: true } });
      }
    }; 
  }
});

const YoutubeNode = Node.create({
  name: "youtube",
  group: "block",
  atom: true,
  addAttributes() { 
    return { 
      src: { default: "" },
      url: { default: "" },
      editing: { default: true }
    }; 
  },
  parseHTML() { return [{ tag: "div[data-type='youtube']" }]; },
  renderHTML({ HTMLAttributes }) { 
    return ["div", { ...HTMLAttributes, "data-type": "youtube" }]; 
  },
  addNodeView() { return ReactNodeViewRenderer(YoutubeEmbed); },
  addCommands() { 
    return { 
      insertYoutube: (attrs) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: { ...attrs, editing: true } });
      }
    }; 
  }
});

const UnsplashNode = Node.create({
  name: "unsplash",
  group: "block",
  atom: true,
  addAttributes() { 
    return { 
      src: { default: "" }, 
      author: { default: "" },
      editing: { default: true }
    }; 
  },
  parseHTML() { return [{ tag: "div[data-type='unsplash']" }]; },
  renderHTML({ HTMLAttributes }) { 
    return ["div", { ...HTMLAttributes, "data-type": "unsplash" }]; 
  },
  addNodeView() { return ReactNodeViewRenderer(UnsplashPicker); },
  addCommands() { 
    return { 
      insertUnsplash: (attrs) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: { ...attrs, editing: true } });
      }
    }; 
  }
});

const ImageBlockNode = Node.create({
  name: "imageBlock",
  group: "block",
  atom: true,
  addAttributes() { 
    return { 
      src: { default: "" }, 
      caption: { default: "" },
      editing: { default: true }
    }; 
  },
  parseHTML() { return [{ tag: "div[data-type='image-block']" }]; },
  renderHTML({ HTMLAttributes }) { 
    return ["div", { ...HTMLAttributes, "data-type": "image-block" }]; 
  },
  addNodeView() { return ReactNodeViewRenderer(ImageBlockComponent); },
  addCommands() { 
    return { 
      insertImageBlock: (attrs) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: { ...attrs, editing: true } });
      }
    }; 
  }
});

const DividerNode = Node.create({
  name: "dividerBlock",
  group: "block",
  atom: true,
  parseHTML() { return [{ tag: "hr[data-type='divider']" }]; },
  renderHTML() { 
    return ["hr", { 
      "data-type": "divider", 
      style: "border-top: 2px solid #e5e7eb; margin: 32px 0; width: 100%;" 
    }]; 
  },
  addNodeView() { return ReactNodeViewRenderer(DividerComponent); },
  addCommands() { 
    return { 
      insertDivider: () => ({ commands }) => {
        return commands.insertContent({ type: this.name });
      }
    }; 
  }
});

const TwitterNode = Node.create({
  name: "twitter",
  group: "block",
  atom: true,
  addAttributes() { 
    return { 
      url: { default: "" },
      editing: { default: true }
    }; 
  },
  parseHTML() { return [{ tag: "div[data-type='twitter']" }]; },
  renderHTML({ HTMLAttributes }) { 
    return ["div", { ...HTMLAttributes, "data-type": "twitter" }]; 
  },
  addNodeView() { return ReactNodeViewRenderer(TwitterEmbed); },
  addCommands() { 
    return { 
      insertTwitter: (attrs) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: { ...attrs, editing: true } });
      }
    }; 
  }
});

/* --- Editor --- */
export default function RichTextEditor({ initialContent = "", onChange, onSaved }) {
  const [showPlus, setShowPlus] = useState(false);
  const [activeLineTop, setActiveLineTop] = useState(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [hasHoveredEditor, setHasHoveredEditor] = useState(false);
  const [editorError, setEditorError] = useState(null);
  const containerRef = useRef(null);
  const plusButtonRef = useRef(null);
  const saveTimeout = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // FIX: Provide safe default content for new posts
  const safeInitialContent = initialContent || '<p></p>';

  console.log('RichTextEditor mounted with content:', safeInitialContent ? 'has content' : 'empty');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      ImageExtension,
      HtmlBlock,
      BookmarkNode,
      YoutubeNode,
      UnsplashNode,
      ImageBlockNode,
      DividerNode,
      TwitterNode,
    ],
    content: safeInitialContent,
    onUpdate: ({ editor }) => {
      try {
        const html = editor.getHTML();
        onChange?.(html);
        setIsSaving(true);
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
          onSaved?.(html);
          setIsSaving(false);
        }, 1000);
      } catch (error) {
        console.error('Editor update error:', error);
        setEditorError(error.message);
      }
    },
    onCreate: () => {
      console.log('Editor created successfully');
      setEditorError(null);
    },
    onDestroy: () => {
      console.log('Editor destroyed');
    }
  });

  useEffect(() => {
    if (!editor) return;
    
    const update = () => {
      try {
        const sel = editor.state.selection;
        const dom = editor.view.domAtPos(sel.from).node;
        
        if (dom && dom.parentNode) {
          const paragraph = dom.tagName === "P" ? dom : dom.closest("p");
          if (paragraph && paragraph.innerText.trim() === "" && hasHoveredEditor) {
            const editorDom = containerRef.current;
            if (editorDom) {
              const lineRect = paragraph.getBoundingClientRect();
              const editorRect = editorDom.getBoundingClientRect();
              setActiveLineTop(lineRect.top - editorRect.top + editorDom.scrollTop);
              setShowPlus(true);
              return;
            }
          }
        }
        setShowPlus(false);
      } catch (error) {
        console.error('Plus button positioning error:', error);
        setShowPlus(false);
      }
    };

    const view = editor.view;
    const observer = () => update();
    
    // FIX: Use safer event listeners
    const events = ["keyup", "click", "input", "scroll"];
    events.forEach(e => {
      try {
        view.dom.addEventListener(e, observer);
      } catch (error) {
        console.error(`Error adding ${e} listener:`, error);
      }
    });
    
    update();
    
    return () => {
      events.forEach(e => {
        try {
          view.dom.removeEventListener(e, observer);
        } catch (error) {
          console.error(`Error removing ${e} listener:`, error);
        }
      });
    };
  }, [editor, hasHoveredEditor]);

  const handleBlockSelect = (type) => {
    setShowBlockMenu(false);
    if (!editor) return;

    try {
      const chain = editor.chain().focus();
      
      switch(type) {
        case "image":
          chain.insertImageBlock({ src: "", caption: "" }).run();
          break;
        case "html":
          chain.insertHtmlBlock({ html: "" }).run();
          break;
        case "divider":
          chain.insertDivider().run();
          break;
        case "bookmark":
          chain.insertBookmark({ url: "" }).run();
          break;
        case "youtube":
          chain.insertYoutube({ url: "" }).run();
          break;
        case "unsplash":
          chain.insertUnsplash({ src: "", author: "" }).run();
          break;
        case "twitter":
          chain.insertTwitter({ url: "" }).run();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error inserting block:', error);
      setEditorError(`Failed to insert ${type} block: ${error.message}`);
    }
  };

  // Close block menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showBlockMenu && 
          !event.target.closest('.add-block-menu') &&
          !event.target.closest('.plus-btn')) {
        setShowBlockMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBlockMenu]);

  // FIX: Show error state if editor fails
  if (editorError) {
    return (
      <div style={{ 
        border: "1px solid #e5e7eb", 
        padding: "20px", 
        borderRadius: "8px",
        background: "#fef2f2",
        color: "#dc2626"
      }}>
        <h3>Editor Error</h3>
        <p>{editorError}</p>
        <button 
          onClick={() => setEditorError(null)}
          style={{
            padding: "8px 16px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "4px",
            marginTop: "10px"
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="rich-text-editor"
      onMouseEnter={() => setHasHoveredEditor(true)}
      style={{ position: "relative", minHeight: "400px" }}
    >
{editor && editor.isEditable && <BubbleMenu editor={editor} />}
      
      {showPlus && !showBlockMenu && (
        <button
          ref={plusButtonRef}
          className="plus-btn"
          style={{ 
            position: "absolute", 
            top: (activeLineTop || 0) - 2, 
            left: -45, 
            zIndex: 30,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            padding: "8px",
            cursor: "pointer",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setShowBlockMenu(true)}
        >
          <FaPlus size={14} />
        </button>
      )}

      {showBlockMenu && (
        <div
          className="add-block-menu"
          style={{
            position: "absolute",
            top: (activeLineTop || 0) + 30,
            left: -45,
            zIndex: 40,
          }}
        >
          <AddBlockMenu onSelect={handleBlockSelect} />
        </div>
      )}

      {editor ? (
        <EditorContent editor={editor} />
      ) : (
        <div style={{ 
          padding: "40px", 
          textAlign: "center",
          color: "#6b7280"
        }}>
          Loading editor...
        </div>
      )}
    </div>
  );
}