import React from "react";

interface ETHIconProps {
  size?: number;
  className?: string;
}

const ETHIcon: React.FC<ETHIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 417"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M127.961 0L125.166 9.5V280.24L127.961 283.027L255.923 207.39L127.961 0Z"
        fill="#00e5ff"
        opacity="0.9"
      />
      <path
        d="M127.962 0L0 207.39L127.962 283.027V151.411V0Z"
        fill="#00ff7b"
      />
      <path
        d="M127.961 306.965L126.242 309.065V410.669L127.961 415.717L256 231.144L127.961 306.965Z"
        fill="#00e5ff"
        opacity="0.9"
      />
      <path
        d="M127.962 415.717V306.965L0 231.144L127.962 415.717Z"
        fill="#00ff7b"
      />
      <path
        d="M127.961 283.027L255.923 207.39L127.961 151.411V283.027Z"
        fill="#31ff00"
        opacity="0.8"
      />
      <path
        d="M0 207.39L127.962 283.027V151.411L0 207.39Z"
        fill="#00ff7b"
        opacity="0.7"
      />
    </svg>
  );
};

export default ETHIcon;
