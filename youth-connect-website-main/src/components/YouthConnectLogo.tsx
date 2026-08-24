import React from 'react';

interface YouthConnectLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'monogram' | 'badge' | 'full';
  color?: string;
}

/**
 * YouthConnect Official Collegiate YC Monogram Logo
 * High-precision vector reconstruction of the interlocking YC insignia.
 */
export const YouthConnectLogo: React.FC<YouthConnectLogoProps> = ({
  className = 'w-8 h-8',
  size,
  variant = 'monogram',
  color = 'currentColor'
}) => {
  const sizeStyle = size ? { width: size, height: size } : undefined;

  // Authentic Interlocking YC Monogram Vector
  const MonogramVector = (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ display: 'block' }}
      aria-label="YouthConnect YC Monogram Emblem"
    >
      {/* 
        Collegiate Interlocking YC Insignia
      */}
      <g fill={color} fillRule="evenodd">
        {/* Letter C: Crescent / Oval Ring with Flat Right Terminals */}
        <path
          d="
            M 85 41
            L 72 41
            C 69 35, 63 32, 53 32
            C 36 32, 26 43, 26 57
            C 26 71, 36 82, 53 82
            C 64 82, 70 78, 73 72
            L 86 72
            C 82 82, 71 91, 53 91
            C 29 91, 14 76, 14 57
            C 14 38, 29 23, 53 23
            C 70 23, 81 32, 85 41
            Z
          "
        />

        {/* Letter C Right Mid-Bar Extension */}
        <path
          d="
            M 68 53
            L 92 53
            L 92 60
            L 68 60
            Z
          "
        />

        {/* Letter Y: Seriffed Diagonal Arms + Stem with Lower Arrowhead / Fleur-de-lis Spurs */}
        <path
          d="
            M 20 16
            L 44 16
            L 40 22
            L 48 36
            L 56 22
            L 52 16
            L 76 16
            L 72 22
            L 58 46
            L 58 76
            L 66 80
            L 66 84
            L 58 84
            L 48 104
            L 38 84
            L 30 84
            L 30 80
            L 38 76
            L 38 46
            L 24 22
            Z
          "
        />
      </g>
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center rounded-2xl bg-white border border-stone-200 shadow-2xs p-1.5 shrink-0 ${className}`}
        style={sizeStyle}
      >
        <div className="w-full h-full text-stone-900 flex items-center justify-center">
          {MonogramVector}
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
        <div className="w-9 h-9 rounded-xl bg-white text-stone-900 border border-stone-200/90 flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          {MonogramVector}
        </div>
        <div className="flex flex-col text-left font-serif">
          <span className="font-bold text-base sm:text-lg tracking-tight text-stone-900 font-serif leading-tight">
            Youth<span className="text-[#8B7CB6]">Connect</span>
          </span>
          <span className="text-[9px] font-semibold tracking-widest text-stone-500 uppercase -mt-0.5 font-serif">
            CAMPUS PASS HUB
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`} style={sizeStyle}>
      {MonogramVector}
    </div>
  );
};

export default YouthConnectLogo;

