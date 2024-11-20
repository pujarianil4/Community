import React, { useRef } from "react";
import { IMAGE_FILE_TYPES, VIDEO_FILE_TYPES } from "@/utils/constants";

interface FileInputProps {
  onChange: (files: FileList) => void;
  children: React.ReactNode;
}

export const FileInput: React.FC<FileInputProps> = React.memo(
  ({ onChange, children }) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const onPickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("event.target.files", event.target.files);

      if (event.target.files && event.target.files.length > 0) {
        onChange(event.target.files);
      }
      //reset value to select same image again
      event.target.value = "";
    };

    return (
      <div onClick={() => fileRef.current && fileRef.current.click()}>
        {children}
        <input
          multiple
          ref={fileRef}
          onChange={onPickFile}
          accept={`${IMAGE_FILE_TYPES}, ${VIDEO_FILE_TYPES}`}
          type='file'
          style={{ display: "none" }}
        />
      </div>
    );
  }
);

// Set displayName for FileInput component
FileInput.displayName = "FileInput";
