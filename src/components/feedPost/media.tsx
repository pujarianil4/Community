"use client";
import {
  getRandomImageLink,
  getRandomPost,
  identifyMediaType,
} from "@/utils/helpers";
import React, { useState } from "react";
import CVideo from "../common/Video";
import Image from "next/image";

interface IProps {
  assets: string[];
}

export default function Media({ assets }: IProps) {
  const [expanded, setExpanded] = useState(false);
  const handleExpand = (
    val: boolean,
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    event.stopPropagation();
    setExpanded(val);
  };
  const mediaURL = getRandomPost();

  console.log("media", mediaURL);
  return (
    <>
      <div
        className='post_media'
        onClick={(event: React.MouseEvent<HTMLImageElement>) =>
          handleExpand(true, event)
        }
      >
        <Image
          loading='lazy'
          className='imgbg'
          src={getRandomImageLink()}
          alt='postbg'
          fill
          sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        {identifyMediaType(assets[0] || mediaURL) == "image" && (
          // <img className='media' src={assets[0] || mediaURL} alt='post' />
          <Image
            loading='lazy'
            className='media'
            src={assets[0] || mediaURL}
            alt='post'
            fill
            sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        )}
        {identifyMediaType(mediaURL) == "video" && <CVideo src={mediaURL} />}
      </div>
      {expanded && (
        <div className='expanded_view'>
          <span
            className='close_icon'
            onClick={(event: React.MouseEvent<HTMLImageElement>) =>
              handleExpand(false, event)
            }
          >
            &#x2715;
          </span>
          {/* <Image
            className='expanded_media imgbg'
            loading='lazy'
            src={assets[0] || mediaURL}
            alt='postbg'
            fill
            sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
          /> */}

          {identifyMediaType(assets[0] || mediaURL) == "image" && (
            <Image
              className='expanded_media'
              src={assets[0] || mediaURL}
              alt='post'
              fill
              sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          )}
          {identifyMediaType(mediaURL) == "video" && <CVideo src={mediaURL} />}
        </div>
      )}
    </>
  );
}
