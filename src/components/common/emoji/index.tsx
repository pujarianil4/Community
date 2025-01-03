// "use client";
// import React, { useState } from "react";
// import "./index.scss";
// // import Picker from "emoji-picker-react";
// import dynamic from "next/dynamic";
// const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
// import { EmojiClickData } from "emoji-picker-react";
// import { MdEmojiEmotions } from "react-icons/md";

// interface IProps {
//   setEmoji: (emoji: any) => void;
// }
// export default function EmojiPicker({ setEmoji }: IProps) {
//   const [showPicker, setShowPicker] = useState<boolean>(false);
//   const onEmojiClick = (emojiObject: EmojiClickData) => {
//     setEmoji((prevInput: any) => prevInput + emojiObject.emoji);
//     setShowPicker(false);
//   };
//   return (
//     <div>
//       <MdEmojiEmotions
//         color='#636466'
//         size={20}
//         onClick={() => setShowPicker((val) => !val)}
//       />
//       {showPicker && (
//         <Picker
//           // pickerStyle={{ width: "100%" }}
//           reactionsDefaultOpen
//           searchDisabled
//           previewConfig={{ showPreview: false }}
//           onEmojiClick={onEmojiClick}
//           width='100%'
//           height={600}
//         />
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import { MdEmojiEmotions } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface IProps {
  // setEmoji: (emoji: any) => void;
  insertEmoji: (emoji: string) => void;
}

export default function EmojiPicker({ insertEmoji }: IProps) {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiPickup = (emoji: any) => {
    insertEmoji(emoji.native);
    setShowPicker(false);
  };

  const togglePicker = () => {
    setShowPicker((prev) => !prev);
  };

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='emoji-picker-container'>
      <MdEmojiEmotions size={20} onClick={togglePicker} />
      {showPicker && (
        <div className='picker-modal' ref={pickerRef}>
          {/* <div className='close-icon' onClick={() => setShowPicker(false)}>
            <AiOutlineClose size={18} />
          </div> */}
          <Picker
            data={data}
            onEmojiSelect={handleEmojiPickup}
            previewPosition='none'
          />
        </div>
      )}
    </div>
  );
}
