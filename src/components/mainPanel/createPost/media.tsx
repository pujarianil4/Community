import React from "react";

export default function Media() {
  return (
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
  );
}
