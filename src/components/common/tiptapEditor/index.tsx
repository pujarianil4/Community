import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TurndownService from "turndown";

const extensions = [
  StarterKit,
  Link.configure({
    autolink: true,
    openOnClick: false,
    linkOnPaste: true,
  }),
];

interface TiptapEditorProps {
  content?: string;
  setContent: (content: string) => void;
  showToolbar?: boolean;
  placeHolder?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content = "",
  setContent,
  showToolbar = true,
  placeHolder = "type here...",
}) => {
  const turndownService = new TurndownService();

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      // Convert editor content to Markdown
      // const markdown = convertEditorContentToMarkdown(editor.getJSON());
      // setMarkdownContent(markdown);
      const markdown = turndownService.turndown(editor.getHTML());
      setContent(markdown);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className={`toolbar_items ${!showToolbar ? "hide_toolbar" : ""}`}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <s>S</s>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          Code-block
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          h1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          h2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          h3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          UL
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          OL
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockQuote") ? "is-active" : ""}
        >
          Quote
        </button>
      </div>
      <div>
        <EditorContent editor={editor} />
      </div>
      {/* <button onClick={() => console.log(markdownContent)}>
        Save Markdown
      </button> */}
    </>
  );
};

export default TiptapEditor;
