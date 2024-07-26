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
