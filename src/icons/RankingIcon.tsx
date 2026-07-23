import React from "react";
import { IconProps } from "../utils/types";

const RankingIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="rank-grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#00ff7b" />
        <stop offset="100%" stopColor="#31ff00" />
      </linearGradient>
    </defs>
    <path
      d="M18 20V10"
      stroke="url(#rank-grad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M12 20V4"
      stroke="#ffe600"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M6 20V14"
      stroke="url(#rank-grad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="4" r="1.5" fill="#ffe600" />
    <circle cx="18" cy="10" r="1.2" fill="#00ff7b" />
    <circle cx="6" cy="14" r="1.2" fill="#00ff7b" />
  </svg>
);

export default RankingIcon;
