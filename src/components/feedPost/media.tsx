import React from "react";
import { identifyMediaType } from "@/utils/helpers";
import CVideo from "../common/Video";
import Image from "next/image";

interface IProps {
  asset: string;
  totalAssets?: number;
  className?: string;
}

export default function Media({ asset, totalAssets, className }: IProps) {
  // const [expanded, setExpanded] = useState(false);
  // const handleExpand = (
  //   val: boolean,
  //   event: React.MouseEvent<HTMLImageElement>
  // ) => {
  //   event.stopPropagation();
  //   setExpanded(val);
  // };

  return (
    <>
      <div
        className={`post_media ${className}`}
        // onClick={(event: React.MouseEvent<HTMLImageElement>) =>
        //   handleExpand(true, event)
        // }
      >
        <Image
          loading='lazy'
          className='imgbg'
          src={asset}
          alt='postbg'
          fill
          objectFit='cover'
          // objectPosition='center'
          // priority
        />
        {identifyMediaType(asset) === "image" && (
          <Image
            loading='lazy'
            className={`media ${className}`}
            // style={{ maxWidth: `calc(90% / ${totalAssets})` }}
            src={asset}
            alt='post'
            layout='fill'
            objectFit='contain'
          />
        )}
        {identifyMediaType(asset) === "video" && <CVideo src={asset} />}
      </div>
      {/* {expanded && (
        <div className='expanded_view'>
          <span
            className='close_icon'
            onClick={(event: React.MouseEvent<HTMLImageElement>) =>
              handleExpand(false, event)
            }
          >
            &#x2715;
          </span>
          {identifyMediaType(asset) === "image" && (
            <Image
              className='expanded_media'
              src={asset}
              alt='post'
              layout='fill'
              objectFit='contain'
            />
          )}
          {identifyMediaType(asset) === "video" && <CVideo src={asset} />}
        </div>
      )} */}
    </>
  );
}
