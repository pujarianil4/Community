"use client";
import React, { useEffect, useRef } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css"; // Adjust path based on your installation method
import "froala-editor/css/froala_style.min.css"; // Additional styles for Froala Editor
import "froala-editor/css/plugins/code_view.min.css"; //
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/plugins/quote.min.js"; // Ensure you have the correct path for quote plugin
import "froala-editor/js/plugins/code_view.min.js"; // Ensure you have the correct path for code_view plugin
import "./index.scss";
import TurndownService from "turndown";

interface IProps {
  setContent: (content: string) => void;
  showToolbar?: boolean;
  placeHolder?: string;
  value?: string;
}

const RichTextEditor: React.FC<IProps> = ({
  showToolbar = true,
  setContent,
  value,
  placeHolder = "Write your post here...",
}) => {
  // const editorRef = useRef<FroalaEditorComponent>(null);
  const editorRef = useRef<any>(null);
  const turndownService = new TurndownService();

  const handleModelChange = (model: string) => {
    // console.log(turndownService.turndown(model));
    setContent(turndownService.turndown(model));
  };

  // useEffect(() => {
  //   if (editorRef.current) {
  //     // Set the HTML content of the editor when the value prop changes
  //     const editorInstance = editorRef.current.editor;
  //     if (editorInstance) {
  //       editorInstance.html.set(value || "");
  //     }
  //   }
  // }, [value]);

  return (
    <div className={`${!showToolbar ? "hide_toolbar" : ""} rich_text_editor`}>
      <FroalaEditorComponent
        config={{
          placeholderText: placeHolder,
          charCounterCount: false,
          toolbarButtons: {
            moreText: {
              buttons: [
                "bold",
                "italic",
                // "underline",
                "strikeThrough",
                // "subscript",
                "superscript",
                // "|",
                // "fontFamily",
                // "fontSize",
                // "textColor",
                // "backgroundColor",
                // "|",
                // "inlineClass",
                // "inlineStyle",
                // "clearFormatting",
              ],
            },
            moreParagraph: {
              buttons: [
                // "alignLeft",
                // "alignCenter",
                // "alignRight",
                // "alignJustify",
                // "|",
                // "formatOLSimple",
                "formatOL",
                "formatUL",
                // "paragraphFormat",
                "quote",
                // "insertHR",
              ],
            },
            moreRich: {
              buttons: [
                "insertLink",
                // "insertImage",
                // "insertVideo",
                // "insertFile",
                "insertTable",
                // "|",
                "emoticons",
                // "specialCharacters",
                // "embedly",
                // "|",
                "insertQuote",
                "insertCode",
                "insertCodeBlock",
                // "insertHR",
              ],
            },
            moreMisc: {
              buttons: [
                // "undo",
                // "redo",
                "fullscreen",
                // "print",
                // "getPDF",
                "spellChecker",
                "selectAll",
                // "html",
                // "|",
                // "help",
                // "about",
              ],
            },
          },
          events: {
            "froalaEditor.contentChanged": function (e: any, editor: any) {
              handleModelChange(editor.html.get());
            },
          },
          pluginsEnabled: [
            // "align",
            // "charCounter",
            "codeView",
            // "colors",
            "emoticons",
            // "entities",
            // "file",
            // "fontFamily",
            // "fontSize",
            "fullscreen",
            // "image",
            // "imageManager",
            "inlineClass",
            "inlineStyle",
            "lineBreaker",
            "link",
            "lists",
            // "paragraphFormat",
            "quote",
            // "save",
            "table",
            "url",
            // "video",
            // "wordPaste",
            "insertQuote",
            "insertCode",
            "insertCodeBlock",
          ],
        }}
        onModelChange={handleModelChange}
        ref={editorRef}
        // style={{ height: editorHeight }}
      />
    </div>
  );
};

export default RichTextEditor;
