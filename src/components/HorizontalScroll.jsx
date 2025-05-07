import React from "react";

const HorizontalScroll = ({ children }) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-3 pb-2">{children}</div>
    </div>
  );
};

export default HorizontalScroll;
