// import React, { useEffect, useState } from "react";

// export default function TestArea({ content, setContent }: any) {
//   const handleInput = (e: any) => {
//     setContent(`${e.target.innerText}anil`);
//   };

//   // useEffect(() => {
//   //   const input = document.querySelector(".placeholder-container");

//   //   if (input) input.innerHTML = content;
//   //   console.log(content);
//   // }, [content]);

//   useEffect(() => {
//     const input = document.querySelector(".placeholder-container");

//     if (input) {
//       const range = document.createRange();
//       const sel = window.getSelection();

//       // Save the current cursor position
//       const cursorPosition = getCaretPosition(input);

//       input.innerHTML = content;

//       // Restore the cursor position
//       if (cursorPosition !== null) {
//         setCaretPosition(input, cursorPosition);
//       }
//     }
//   }, [content]);

//   // Function to get the caret position
//   const getCaretPosition = (element: any) => {
//     const sel = window.getSelection();
//     if (sel && sel.rangeCount > 0) {
//       const range = sel.getRangeAt(0);
//       const preCaretRange = range.cloneRange();
//       preCaretRange.selectNodeContents(element);
//       preCaretRange.setEnd(range.endContainer, range.endOffset);
//       return preCaretRange.toString().length;
//     }
//     return null;
//   };

//   // Function to set the caret position
//   const setCaretPosition = (element: any, position: number) => {
//     for (const node of element.childNodes) {
//       if (node.nodeType === 3) {
//         // Node.TEXT_NODE
//         if (node.length >= position) {
//           const range = document.createRange();
//           const sel = window.getSelection();
//           range.setStart(node, position);
//           range.collapse(true);
//           if (sel) {
//             sel.removeAllRanges();
//             sel.addRange(range);
//           }
//           return;
//         } else {
//           position -= node.length;
//         }
//       } else {
//         position = setCaretPosition(node, position);
//         if (position === 0) return;
//       }
//     }
//     return position;
//   };

//   return (
//     <>
//       <div
//         className='placeholder-container'
//         contentEditable
//         onInput={handleInput}
//         //dangerouslySetInnerHTML={{ __html: String(content) }}
//         data-placeholder='Type your text here...'
//       ></div>
//     </>
//   );
// }

import React, { useEffect, useRef } from "react";

interface TestAreaProps {
  content: string;
  setContent: (content: string) => void;
}

export default function TestArea({ content, setContent }: TestAreaProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerText);
  };

  useEffect(() => {
    const input = ref.current;

    if (input) {
      // Update the content
      input.innerHTML = content;

      // Move cursor to the end
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(input);
      range.collapse(false); // Collapse the range to the end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [content]);

  return (
    <div
      className='placeholder-container'
      contentEditable
      ref={ref}
      onInput={handleInput}
      data-placeholder='Type your text here...'
    ></div>
  );
}
