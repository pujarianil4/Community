"use client";
import React, { useState } from "react";
import "./index.scss";
import { Switch } from "antd";
import TiptapEditor from "@/components/common/tiptapEditor";
import CButton from "@/components/common/Button";
export default function CommuniytGuide() {
  const [isGuideEnable, setIsGuideEnable] = useState(false);
  const [guideLinesContents, setGuideLinesContent] = useState("");

  const onChange = (checked: boolean) => {
    setIsGuideEnable(checked);
  };

  const handleSave = () => {
    console.log("DATA", isGuideEnable, guideLinesContents);
  };
  return (
    <main className='community_guideLine_container'>
      <h1>Community Guide</h1>
      <div className='guideLine_item enable'>
        <div>
          <p>Enable community guide</p>
          <span>Appears in the sidebar on desktop.</span>
        </div>
        <Switch className='custom-switch' onChange={onChange} />
      </div>
      <div className='guideLine_item'>
        <p>Add community guidelines</p>
        <div className='editor_container'>
          <TiptapEditor
            setContent={setGuideLinesContent}
            content={guideLinesContents}
            autoFocus={false}
            maxCharCount={500}
            className='box_height'
            placeHolder='add guidelines'
            hideBtn={[
              "h1",
              "h2",
              "h3",
              "code",
              "codeBlock",
              "blockQuote",
              "bold",
              "italic",
              "strike",
            ]}
          />
        </div>
      </div>

      <div className='guideLine_btn'>
        <CButton onClick={handleSave}>Save</CButton>
      </div>
    </main>
  );
}
