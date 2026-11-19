"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Sle8pBlinkingLogoProps {
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
}

export const Sle8pBlinkingLogo: React.FC<Sle8pBlinkingLogoProps> = ({
  width = 110,
  height = 43,
  className = "",
  onClick,
}) => {
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsClosed(true);
      setTimeout(() => setIsClosed(false), 220);
    }, 3600);

    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIsClosed(true);
    setTimeout(() => setIsClosed(false), 220);
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block cursor-pointer select-none transition-transform active:scale-95 ${className}`}
      style={{ width, height }}
    >
      {/* Open Eyes Logo */}
      <Image
        src="/brand/sle8p_logo_blinking_open.png"
        alt="Sle8p Logo"
        width={width}
        height={height}
        priority
        className={`absolute inset-0 object-contain transition-opacity duration-100 ${
          isClosed ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Closed Eyes Logo (Blinking frame) */}
      <Image
        src="/brand/sle8p_logo_blinking_closed.png"
        alt="Sle8p Logo Blinking"
        width={width}
        height={height}
        priority
        className={`absolute inset-0 object-contain transition-opacity duration-100 ${
          isClosed ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};
