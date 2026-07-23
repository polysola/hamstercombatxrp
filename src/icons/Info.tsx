import React from "react";
import { IconProps } from "../utils/types";

const Info: React.FC<IconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="#00ff7b" strokeWidth="2" />
      <path d="M12 16v-4" stroke="#31ff00" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.25" fill="#ffe600" />
    </svg>
  );
};

export default Info;