"use client";
import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineGifBox } from "react-icons/md";

export default function CreatePost() {
  const textAreaRef = useRef(null);
  const [pics, setPics] = useState([]);
  const [text, setText] = useState("");

  const [content, setContent] = useState("");

  const handleInput = (e: any) => {
    setContent(e.target.innerHTML);
  };

  const FileInput = ({ onChange, children }: any) => {
    const fileRef = useRef(null);
    const onPickFile = (event: any) => {
      onChange([...event.target.files]);
    };
    return (
      <div
        style={{
          width: "20px",
          height: "20px",
        }}
        onClick={() => fileRef?.current?.click && fileRef?.current?.click()}
      >
        {children}
        <input
          multiple
          ref={fileRef}
          onChange={onPickFile}
          type='file'
          style={{ visibility: "hidden" }}
        />
      </div>
    );
  };

  const Img = ({ file, onRemove, index }: any) => {
    const [fileUrl, setFileUrl] = useState<any>(null);
    useEffect(() => {
      if (file) {
        setFileUrl(URL.createObjectURL(file));
      }
    }, [file]);

    return fileUrl ? (
      <div className='file'>
        <img alt='pic' src={fileUrl} />
        {onRemove && (
          <div className='remove' onClick={() => onRemove(index)}>
            x
          </div>
        )}
      </div>
    ) : null;
  };

  return (
    <div className='create_post_container'>
      <span className='label'>Create Post</span>
      <div className='create_post_form'>
        <div className='inputArea'>
          <div
            className='placeholder-container'
            contentEditable
            onInput={handleInput}
            dangerouslySetInnerHTML={{ __html: content }}
            data-placeholder='Type your text here...'
          ></div>
          <div className='file_container'>
            {pics.map((picFile, index) => (
              <Img
                key={index}
                index={index}
                file={picFile}
                onRemove={(rmIndx: any) =>
                  setPics(pics.filter((pic, index) => index !== rmIndx))
                }
              />
            ))}
          </div>
        </div>
        <div className='media'>
          <div className='inputs'>
            <FileInput onChange={(pics: any) => setPics(pics)}>
              <LuImagePlus color='var(--primary)' size={20} />
            </FileInput>

            <MdOutlineGifBox color='var(--primary)' size={20} />
            <LuImagePlus color='var(--primary)' size={20} />
          </div>

          <div className='postbtn'>
            <button>Post</button>
          </div>
        </div>
        {/* <textarea
            ref={textAreaRef}
            value={text}
            placeholder='What is happening...'
            // style={{ flex: 1, border: "none", minHeight: "150px" }}
            onChange={(e) => setText(e.target.value)}
            name=''
            id='textarea'
          ></textarea> */}
      </div>
    </div>
  );
}
