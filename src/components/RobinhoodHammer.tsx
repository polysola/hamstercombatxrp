import React from "react";
import { robinhood } from "../images";

interface RobinhoodHammerProps {
  style?: React.CSSProperties;
  className?: string;
  size?: number;
}

const RobinhoodHammer: React.FC<RobinhoodHammerProps> = ({
  style,
  className = "",
  size = 56,
}) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
      className={`absolute pointer-events-none z-50 animate-hammer-strike flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(0,255,123,0.8)] ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform-gpu"
      >
        <defs>
          <linearGradient id="hammerHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2638" />
            <stop offset="50%" stopColor="#0a1424" />
            <stop offset="100%" stopColor="#050a12" />
          </linearGradient>
          <linearGradient id="neonGreenBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff7b" />
            <stop offset="50%" stopColor="#ffe600" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
          <filter id="hammerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Futuristic Cyber Handle */}
        <path
          d="M20 44L38 26"
          stroke="url(#neonGreenBorder)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M17 47L22 42"
          stroke="#ffe600"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* 2. Cyberpunk Metallic Hammer Head Block */}
        <rect
          x="28"
          y="10"
          width="26"
          height="22"
          rx="5"
          fill="url(#hammerHeadGrad)"
          stroke="url(#neonGreenBorder)"
          strokeWidth="2.5"
          filter="url(#hammerGlow)"
        />

        {/* 3. Strike Energy Caps (Left & Right Head Pistons) */}
        <rect x="24" y="14" width="5" height="14" rx="2" fill="#00ff7b" />
        <rect x="53" y="14" width="5" height="14" rx="2" fill="#ffe600" />

        {/* 4. Energy Lightning Lines on Head */}
        <line x1="30" y1="12" x2="52" y2="12" stroke="#00ff7b" strokeWidth="1" opacity="0.8" />
        <line x1="30" y1="30" x2="52" y2="30" stroke="#00e5ff" strokeWidth="1" opacity="0.8" />
      </svg>

      {/* 5. Embedded Robinhood Brand Badge in the Middle of Hammer Head */}
      <div className="absolute top-[13px] left-[31px] w-[20px] h-[16px] rounded-sm bg-[#00ff7b]/20 border border-[#00ff7b] flex items-center justify-center shadow-[0_0_8px_#00ff7b] overflow-hidden">
        <img
          src={robinhood}
          alt="Robinhood Logo"
          className="w-[14px] h-[14px] object-contain drop-shadow-[0_0_4px_#00ff7b]"
        />
      </div>
    </div>
  );
};

export default RobinhoodHammer;
