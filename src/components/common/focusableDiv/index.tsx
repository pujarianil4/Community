import React, { useState } from "react";
import "./index.scss";

interface FocusableDivProps {
  children: React.ReactNode;
  className?: string;
}

const FocusableDiv: React.FC<FocusableDivProps> = ({
  children,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      className={`focusable-div ${isFocused ? "focused" : ""} ${className}`}
      tabIndex={0} // Makes the div focusable
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </div>
  );
};

export default FocusableDiv;
