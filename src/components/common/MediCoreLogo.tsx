import React from 'react';

interface MediCoreLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textVariant?: 'dark' | 'light';
  subtitle?: string;
}

export const MediCoreLogo: React.FC<MediCoreLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textVariant = 'dark',
  subtitle
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-9 h-9 sm:w-10 sm:h-10',
    xl: 'w-12 h-12'
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* High-Tech 3D Glass & Neon ECG MediCore Emblem */}
      <div className={`relative ${currentSize} rounded-xl overflow-hidden shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-200 border border-slate-700/20 bg-[#1A2332]`}>
        <img
          src="/assets/medicore-logo.png"
          alt="MediCore Logo"
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            // Elegant SVG Fallback if image path fails
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Subtle shine highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-xl" />
      </div>

      {showText && (
        <div className="shrink-0 text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif font-black tracking-tight leading-none ${
                size === 'lg' || size === 'xl' ? 'text-xl' : 'text-base'
              } ${textVariant === 'light' ? 'text-white' : 'text-[#29243A]'}`}
            >
              MEDICORE
            </span>
            <span
              className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border leading-none ${
                textVariant === 'light'
                  ? 'bg-white/15 text-blue-200 border-white/20'
                  : 'bg-blue-50 text-blue-700 border-blue-200/60'
              }`}
            >
              HOSPITAL
            </span>
          </div>
          {subtitle ? (
            <p className={`text-[10px] uppercase tracking-wider font-medium mt-0.5 ${textVariant === 'light' ? 'text-slate-300' : 'text-[#626B77]'}`}>
              {subtitle}
            </p>
          ) : (
            <p className={`text-[9.5px] uppercase tracking-wider font-semibold mt-0.5 ${textVariant === 'light' ? 'text-slate-300' : 'text-[#626B77]'}`}>
              Multispeciality Network
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MediCoreLogo;
