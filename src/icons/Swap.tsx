import React from "react";
import { IconProps } from "../utils/types";

const Swap: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="swap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ff7b" />
        <stop offset="100%" stopColor="#abff00" />
      </linearGradient>
    </defs>
    <path
      d="M7 16V4M7 4L3 8M7 4L11 8"
      stroke="url(#swap-grad)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 8V20M17 20L13 16M17 20L21 16"
      stroke="#ffe600"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Swap;
