"use client";
import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import "./index.scss";
import {
  FaBold,
  FaCode,
  FaItalic,
  FaQuoteRight,
  FaStrikethrough,
} from "react-icons/fa6";
import { RiCodeBlock } from "react-icons/ri";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import {
  AiOutlineLink,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { LinkModal } from "./linkModal";
import { GoUnlink } from "react-icons/go";
import EmojiPicker from "../emoji";

// const maxCharCount = 300;

const createExtensions = (placeHolder: string) => [
  StarterKit,
  Placeholder.configure({
    placeholder: "type here...",
  }),
  Link.configure({
    openOnClick: true,
    autolink: false,
    linkOnPaste: true,
    validate: (href) => /^https?:\/\//.test(href),
    HTMLAttributes: {
      "data-type": "link",
      class: "link",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
];

interface TiptapEditorProps {
  content?: string;
  setContent: (content: string) => void;
  showToolbar?: boolean;
  placeHolder?: string;
  autoFocus?: boolean;
  maxCharCount?: number;
  className?: string;
  hideBtn?: string[];
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content = "",
  setContent,
  showToolbar = true,
  placeHolder = "Type here...",
  autoFocus = false,
  maxCharCount = 2000,
  className = "customHeight",
  hideBtn = [],
}) => {
  const [remainingChars, setRemainingChars] = useState<number>(
    maxCharCount - (content?.length || 0)
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const editorContentRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: createExtensions(placeHolder),
    content: content,
    onUpdate: ({ editor }) => {
      const currentText = editor.getText();
      const charCount = currentText.length;
      const charsLeft = maxCharCount - charCount;

      if (charsLeft >= 0) {
        setContent(editor.getHTML());
        setRemainingChars(charsLeft);
      } else {
        const trimmedContent = currentText.slice(0, maxCharCount);
        editor.commands.setContent(trimmedContent);
        setContent(editor.getHTML());
        setRemainingChars(0);
      }
    },
    editorProps: {
      attributes: {
        class: className,
      },
    },
  });

  const openModal = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      const selected = editor.state.doc.textBetween(from, to);
      setSelectedText(selected);
    }
    setIsModalVisible(true);
  };

  // const handleCreateLink = (text: string, href: string) => {
  //   if (editor) {
  //     editor
  //       .chain()
  //       .focus()
  //       .extendMarkRange("link")
  //       .setLink({ href })
  //       .insertContent(text)
  //       .run();
  //   }
  //   setIsModalVisible(false);
  // };
  const handleCreateLink = (href: string) => {
    if (editor) {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setIsModalVisible(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " " && isModalVisible) {
      event.preventDefault();
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setSelectedText("");
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      const initialCharCount = editor.getText().length;
      setRemainingChars(maxCharCount - initialCharCount);
    }
  }, [content, editor]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " && isModalVisible) {
        event.preventDefault();
        setIsModalVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalVisible]);

  useEffect(() => {
    if (!isModalVisible) {
      editor?.commands.focus();
    }
  }, [isModalVisible, editor]);

  useEffect(() => {
    const handleEditorClick = () => {
      editor?.commands.focus();
    };

    const editorContentEl = editorContentRef.current;
    if (editorContentEl) {
      editorContentEl.addEventListener("click", handleEditorClick);
    }

    return () => {
      if (editorContentEl) {
        editorContentEl.removeEventListener("click", handleEditorClick);
      }
    };
  }, [editor]);

  useEffect(() => {
    if (autoFocus && editor) {
      editor.commands.focus();
    }
  }, [autoFocus, editor]);

  if (!editor) {
    return null;
  }

  return (
    <main className='tiptap_editor_container'>
      <div className={`toolbar_items ${!showToolbar ? "hide_toolbar" : ""}`}>
        {!hideBtn.includes("bold") && (
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${editor.isActive("bold") ? "is-active" : ""} icon `}
          >
            <FaBold size={14} />
          </button>
        )}
        {!hideBtn.includes("italic") && (
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${editor.isActive("italic") ? "is-active" : ""} icon`}
          >
            <FaItalic size={14} />
          </button>
        )}
        {!hideBtn.includes("strike") && (
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${editor.isActive("strike") ? "is-active" : ""} icon`}
          >
            <FaStrikethrough size={14} />
          </button>
        )}
        {!hideBtn.includes("h1") && (
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            } icon`}
          >
            <LuHeading1 size={18} />
          </button>
        )}
        {!hideBtn.includes("h2") && (
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            } icon`}
          >
            <LuHeading2 size={18} />
          </button>
        )}
        {!hideBtn.includes("h3") && (
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            } icon`}
          >
            <LuHeading3 size={18} />
          </button>
        )}
        {!hideBtn.includes("bulletList") && (
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${
              editor.isActive("bulletList") ? "is-active" : ""
            } icon`}
          >
            <AiOutlineUnorderedList size={18} />
          </button>
        )}
        {!hideBtn.includes("orderedList") && (
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${
              editor.isActive("orderedList") ? "is-active" : ""
            } icon`}
          >
            <AiOutlineOrderedList size={18} />
          </button>
        )}
        {!hideBtn.includes("code") && (
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`${editor.isActive("code") ? "is-active" : ""} icon`}
          >
            <FaCode />
          </button>
        )}
        {!hideBtn.includes("codeBlock") && (
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`${
              editor.isActive("codeBlock") ? "is-active" : ""
            } icon`}
          >
            <RiCodeBlock size={18} />
          </button>
        )}
        {!hideBtn.includes("blockQuote") && (
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${
              editor.isActive("blockQuote") ? "is-active" : ""
            } icon`}
          >
            <FaQuoteRight size={18} />
          </button>
        )}
        {!hideBtn.includes("link") && (
          <button
            onClick={openModal}
            className={`${editor.isActive("link") ? "is-active" : ""} icon`}
          >
            <AiOutlineLink size={18} />
          </button>
        )}
        {!hideBtn.includes("link") && (
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            className={`${
              editor.isActive("link") ? "is-active" : "disabled"
            } icon `}
          >
            <GoUnlink size={16} />
          </button>
        )}
        <button className='icon emoji'>
          <EmojiPicker setEmoji={setContent} />
        </button>
      </div>
      <div
        className='editor_content'
        onKeyDown={handleKeyDown}
        ref={editorContentRef}
      >
        <EditorContent editor={editor} />
        {/* <EditorContent editor={editor} onKeyDown={handleKeyDown} /> */}
      </div>
      <div
        className={`char_count ${
          remainingChars <= 0 ? "outOfLimit" : "withinLimit"
        }`}
      >
        {remainingChars} / {maxCharCount}
      </div>
      <LinkModal
        visible={isModalVisible}
        selectedText={selectedText}
        onCreate={handleCreateLink}
        onCancel={handleCancel}
      />
    </main>
  );
};

export default TiptapEditor;
