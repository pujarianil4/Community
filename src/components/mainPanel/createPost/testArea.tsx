import React, { useState } from "react";

export default function TestArea({ content, setContent }: any) {
  const handleInput = (e: any) => {
    setContent(e.target.innerText);
  };
  return (
    <>
      <div
        className='placeholder-container'
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
        data-placeholder='Type your text here...'
      ></div>
    </>
  );
}
