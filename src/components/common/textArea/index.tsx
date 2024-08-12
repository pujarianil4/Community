import React, { useState, useRef, useEffect } from "react";
import "./index.scss";

interface TextAreaProps {
  content: string;
  setContent: (content: string) => void;
  placeholder: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  content,
  setContent,
  placeholder,
}) => {
  const [height, setHeight] = useState<number>(40); // Initial height of 40px
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Set initial height based on content length
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setContent(textarea.value);
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setHeight(textarea.scrollHeight);
  };

  return (
    <textarea
      ref={ref}
      className='textArea'
      value={content}
      onChange={handleChange}
      style={{ height: `${height}px` }}
      placeholder={placeholder}
    />
  );
};

export default TextArea;
