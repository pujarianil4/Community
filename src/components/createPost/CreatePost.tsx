"use client";
import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineGifBox } from "react-icons/md";
import TestArea from "./testArea";
import { handlePostToCommunity } from "@/services/api/api";
import { LocalStore } from "@/utils/helpers";

export default function CreatePost() {
  const [pics, setPics] = useState<Array<string>>([]);
  const [text, setText] = useState("");
  const [content, setContent] = useState("");

  const FileInput = ({ onChange, children }: any) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const onPickFile = (event: any) => {
      console.log(event);

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

  const Img = React.memo(({ file, onRemove, index }: any) => {
    const [fileUrl, setFileUrl] = useState<any>(null);

    useEffect(() => {
      if (file) {
        console.log("file", file, URL.createObjectURL(file));

        setFileUrl(URL.createObjectURL(file));
      }
      // Clean up the URL object when component unmounts or file changes
      return () => {
        if (fileUrl) {
          URL.revokeObjectURL(fileUrl);
        }
      };
    }, [file]); // Only re-run effect if `file` changes

    return fileUrl ? (
      <div className='file' key={index}>
        <img alt='pic' src={fileUrl} />
        {onRemove && (
          <div className='remove' onClick={() => onRemove(index)}>
            x
          </div>
        )}
      </div>
    ) : null;
  });

  const handlePost = async () => {
    const { uid } = LocalStore.get("userSession");
    const data = {
      uid,
      cid: 1,
      text: content,
      up: 0,
      down: 0,
      comments: 0,
    };
    await handlePostToCommunity(data);
  };

  return (
    <div className='create_post_container'>
      <span className='label'>Create Post</span>
      <div className='create_post_form'>
        <div className='inputArea'>
          <TestArea content={content} setContent={setContent} />
          <div className='file_container'>
            {pics.map((picFile: any, index: number) => (
              <Img
                key={index}
                index={index}
                file={picFile}
                onRemove={(rmIndx: any) =>
                  setPics(
                    pics.filter((_: any, index: number) => index !== rmIndx)
                  )
                }
              />
            ))}
          </div>
        </div>
        <div className='media'>
          <div className='inputs'>
            <FileInput
              onChange={(newPics: any) =>
                setPics((prevPics: any) => [...prevPics, ...newPics])
              }
            >
              <LuImagePlus color='var(--primary)' size={20} />
            </FileInput>

            <MdOutlineGifBox color='var(--primary)' size={20} />
            <LuImagePlus color='var(--primary)' size={20} />
          </div>

          <div className='postbtn'>
            <button onClick={handlePost}>Post</button>
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
