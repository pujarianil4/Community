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
  const mediaURLs = [
    getRandomPost(),
    // getRandomPost(),
    // getRandomPost(),
    // getRandomPost(),
  ];
  console.log("media", mediaURLs);
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
        {mediaURLs?.map((asset: string) => (
          <>
            {identifyMediaType(asset) == "image" && (
              // <img className='media' src={asset} alt='post' />
              <Image
                loading='lazy'
                className='media'
                src={asset}
                alt='post'
                fill
                sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
              />
            )}
            {identifyMediaType(asset) == "video" && <CVideo src={asset} />}
          </>
        ))}
        {/*  */}
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
            src={assets[0] || mediaURLs[0]}
            alt='postbg'
            fill
            sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
          /> */}

          {identifyMediaType(assets[0] || mediaURLs[0]) == "image" && (
            <Image
              className='expanded_media'
              src={assets[0] || mediaURLs[0]}
              alt='post'
              fill
              sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          )}
          {identifyMediaType(mediaURLs[0]) == "video" && (
            <CVideo src={mediaURLs[0]} />
          )}
        </div>
      )}
    </>
  );
}
