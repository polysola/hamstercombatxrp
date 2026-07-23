import React from "react";

interface NftIconProps {
  size?: number;
  className?: string;
}

const NftIcon: React.FC<NftIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M11 3v18" />
      <path d="M2 9h20" />
    </svg>
  );
};

export default NftIcon;
