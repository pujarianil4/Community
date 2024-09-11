"use client";
import React, { useEffect, useState } from "react";
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

const extensions = [
  StarterKit,
  Link.configure({
    openOnClick: true,
    autolink: true,
    linkOnPaste: true,
    validate: (href) => /^https?:\/\//.test(href),
    HTMLAttributes: {
      "data-type": "link",
      class: "link",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  Placeholder.configure({
    placeholder: "type here...",
  }),
];

interface TiptapEditorProps {
  content?: string;
  setContent: (content: string) => void;
  // onClick: (content: string) => void;
  showToolbar?: boolean;
  placeHolder?: string;
  autoFocus?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content = "",
  setContent,
  showToolbar = true,
  placeHolder = "type here...",
  autoFocus = false,
}) => {
  const editor = useEditor({
    extensions,
    content: content,
  });

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>("");

  const openModal = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      const selected = editor.state.doc.textBetween(from, to);
      setSelectedText(selected);
    }
    setIsModalVisible(true);
  };

  const handleCreateLink = (text: string, href: string) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href })
        .insertContent(text)
        .run();
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setSelectedText("");
    setIsModalVisible(false);
  };

  useEffect(() => {
    editor?.off("update");
    editor?.on("update", ({ editor: updatedEditor }) => {
      setContent(updatedEditor.getHTML());
    });
  }, [editor, setContent]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

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
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${editor.isActive("bold") ? "is-active" : ""} icon `}
        >
          <FaBold size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${editor.isActive("italic") ? "is-active" : ""} icon`}
        >
          <FaItalic size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${editor.isActive("strike") ? "is-active" : ""} icon`}
        >
          <FaStrikethrough size={14} />
        </button>
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
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${editor.isActive("bulletList") ? "is-active" : ""} icon`}
        >
          <AiOutlineUnorderedList size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${
            editor.isActive("orderedList") ? "is-active" : ""
          } icon`}
        >
          <AiOutlineOrderedList size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${editor.isActive("code") ? "is-active" : ""} icon`}
        >
          <FaCode />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${editor.isActive("codeBlock") ? "is-active" : ""} icon`}
        >
          <RiCodeBlock size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${editor.isActive("blockQuote") ? "is-active" : ""} icon`}
        >
          <FaQuoteRight size={18} />
        </button>

        <button
          onClick={openModal}
          className={`${editor.isActive("link") ? "is-active" : ""} icon`}
        >
          <AiOutlineLink size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className={`${
            editor.isActive("link") ? "is-active" : "disabled"
          } icon `}
        >
          <GoUnlink size={16} />
        </button>
      </div>
      <div className='editor_content'>
        <EditorContent editor={editor} />
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