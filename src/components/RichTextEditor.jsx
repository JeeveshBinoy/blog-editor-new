// src/components/RichTextEditor.jsx
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
  const containerRef = useRef(null);
  const plusButtonRef = useRef(null);
  const saveTimeout = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

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
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      setIsSaving(true);
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        onSaved?.(html);
        setIsSaving(false);
      }, 1000);
    }
  });

  useEffect(() => {
    if (!editor) return;
    
    const update = () => {
      const sel = editor.state.selection;
      const dom = editor.view.domAtPos(sel.from).node;
      
      if (dom && dom.parentNode) {
        const paragraph = dom.tagName === "P" ? dom : dom.closest("p");
        if (paragraph && paragraph.innerText.trim() === "" && hasHoveredEditor) {
          const editorDom = containerRef.current;
          const lineRect = paragraph.getBoundingClientRect();
          const editorRect = editorDom.getBoundingClientRect();
          setActiveLineTop(lineRect.top - editorRect.top + editorDom.scrollTop);
          setShowPlus(true);
          return;
        }
      }
      setShowPlus(false);
    };

    const view = editor.view;
    const observer = () => update();
    
    ["keyup", "click", "input", "scroll"].forEach(e => 
      view.dom.addEventListener(e, observer)
    );
    
    update();
    
    return () => {
      ["keyup", "click", "input", "scroll"].forEach(e => 
        view.dom.removeEventListener(e, observer)
      );
    };
  }, [editor, hasHoveredEditor]);

  const handleBlockSelect = (type) => {
    setShowBlockMenu(false);
    if (!editor) return;

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

  return (
    <div
      ref={containerRef}
      className="rich-text-editor"
      onMouseEnter={() => setHasHoveredEditor(true)}
      style={{ position: "relative", minHeight: "400px" }}
    >
        {editor && <BubbleMenu editor={editor} />}
      {showPlus && !showBlockMenu && (
        <button
          ref={plusButtonRef}
          className="plus-btn"
          style={{ 
            position: "absolute", 
            top: (activeLineTop || 0) - 2, 
            left: -45, 
            zIndex: 30 
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

      <EditorContent editor={editor} />
    </div>
  );
}