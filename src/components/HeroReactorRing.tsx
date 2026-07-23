import React from "react";

interface HeroReactorRingProps {
  eggHealth: number;
  children: React.ReactNode;
}

const HeroReactorRing: React.FC<HeroReactorRingProps> = ({
  eggHealth,
  children,
}) => {
  return (
    <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] flex items-center justify-center font-orbitron my-3 pt-6">
      {/* 100% GPU Hardware-Accelerated Sci-Fi Reactor HUD Rings (Zero-Lag Ultra Smooth) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 transform-gpu"
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="pedestalGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ff7b" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#00e5ff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="neonGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff7b" />
            <stop offset="60%" stopColor="#31ff00" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
        </defs>

        {/* 1. RADIAL CYBER GRID BACKGROUND (LƯỚI XOÁY 3D GPU ROTATING) */}
        <g
          opacity="0.35"
          className="animate-spin-slow transform-gpu will-change-transformOrigin"
          style={{ transformOrigin: "180px 195px", animationDuration: "80s" }}
        >
          <circle cx="180" cy="195" r="142" stroke="#00ff7b" strokeWidth="1" strokeDasharray="3 7" />
          <circle cx="180" cy="195" r="115" stroke="#00e5ff" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="180" cy="195" r="85" stroke="#00ff7b" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="20" y1="195" x2="340" y2="195" stroke="#00ff7b" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="180" y1="35" x2="180" y2="355" stroke="#00ff7b" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="70" y1="85" x2="290" y2="305" stroke="#00e5ff" strokeWidth="0.8" strokeDasharray="3 5" />
          <line x1="290" y1="85" x2="70" y2="305" stroke="#00e5ff" strokeWidth="0.8" strokeDasharray="3 5" />
        </g>

        {/* 2. OUTER SEGMENTED GREEN HUD ARC RING (GPU ROTATING CLOCKWISE) */}
        <g
          className="animate-spin-slow transform-gpu will-change-transformOrigin"
          style={{ transformOrigin: "180px 195px", animationDuration: "22s" }}
        >
          <circle
            cx="180"
            cy="195"
            r="142"
            stroke="url(#neonGreenGrad)"
            strokeWidth="7"
            strokeDasharray="24 10"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>

        {/* 3. INNER CYAN DOTTED ORBIT RING (GPU ROTATING COUNTER-CLOCKWISE) */}
        <g
          className="animate-spin-slow transform-gpu will-change-transformOrigin"
          style={{
            transformOrigin: "180px 195px",
            animationDuration: "30s",
            animationDirection: "reverse",
          }}
        >
          <circle
            cx="180"
            cy="195"
            r="154"
            stroke="#00e5ff"
            strokeWidth="2.5"
            strokeDasharray="3 9"
            opacity="0.75"
          />
        </g>

        {/* 4. GLOWING 3D PEDESTAL LAUNCHPAD BASE BELOW EGG */}
        <ellipse cx="180" cy="308" rx="115" ry="26" fill="url(#pedestalGlow)" />
        <ellipse
          cx="180"
          cy="308"
          rx="110"
          ry="24"
          stroke="#00ff7b"
          strokeWidth="2.5"
          fill="none"
          opacity="0.85"
        />
        <ellipse
          cx="180"
          cy="308"
          rx="90"
          ry="17"
          stroke="#00e5ff"
          strokeWidth="1.8"
          fill="none"
          opacity="0.6"
        />
        <ellipse
          cx="180"
          cy="308"
          rx="65"
          ry="11"
          stroke="#ffe600"
          strokeWidth="1.2"
          fill="none"
          opacity="0.4"
        />
      </svg>

      {/* EMBEDDED TOP BADGE POSITIONED WITH AMPLE SPACE ABOVE THE RING */}
      <div className="absolute top-0 z-30 bg-[#060a12] px-4 py-1 rounded-full border border-[#00ff7b]/50 shadow-[0_0_20px_rgba(0,255,123,0.5)] text-center">
        <p className="text-[9px] text-[#00ff7b] font-black tracking-[0.2em] uppercase neon-green-glow leading-none">
          QUANTUM CORE INTEGRITY
        </p>
        <p className="text-base font-black text-white mt-0.5 leading-none tracking-tight">
          {eggHealth.toFixed(1)}%
        </p>
      </div>

      {/* Central Hero Egg Content */}
      <div className="relative z-10 flex items-center justify-center mt-3">
        {children}
      </div>
    </div>
  );
};

export default HeroReactorRing;
