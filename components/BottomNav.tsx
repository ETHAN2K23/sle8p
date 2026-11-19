"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { hapticLight } from "@/lib/haptics";

// 1. Home - Casa 100% Rellena (Apple HIG Style)
const SolidHomeIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.5L2.5 10.5C2.18 10.77 2 11.17 2 11.6V20C2 21.1 2.9 22 4 22H9C9.55 22 10 21.55 10 21V15C10 14.45 10.45 14 11 14H13C13.55 14 14 14.45 14 15V21C14 21.55 14.45 22 15 22H20C21.1 22 22 21.1 22 20V11.6C22 11.17 21.82 10.77 21.5 10.5L12 2.5Z" />
  </svg>
);

// 2. Tracker - Barras de Historial Rellenas
const SolidTrackerIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="3" y="11" width="4.5" height="10" rx="2.25" />
    <rect x="9.75" y="4" width="4.5" height="17" rx="2.25" />
    <rect x="16.5" y="8" width="4.5" height="13" rx="2.25" />
  </svg>
);

// 3. IA Sle8p - Logo Oficial de Verdad (Ojos abiertos)
const Sle8pLogoIaTabIcon: React.FC<{ isActive?: boolean }> = ({
  isActive = false,
}) => (
  <div className="relative w-8 h-5 flex items-center justify-center">
    <Image
      src="/brand/sle8p_real_open.png"
      alt="Sle8p IA"
      width={32}
      height={20}
      className={`object-contain transition-all duration-200 ${
        isActive
          ? "brightness-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          : "opacity-45 brightness-90 hover:opacity-80"
      }`}
    />
  </div>
);

// 4. Wearables - Reloj Relleno
const SolidWatchIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 2h8v2.5H8z" />
    <rect x="5" y="4" width="14" height="16" rx="4" />
    <rect x="7.5" y="6.5" width="9" height="11" rx="2" fill="#000000" />
    <path d="M8 19.5h8V22H8z" />
    <rect x="19.5" y="7.5" width="1.5" height="3.5" rx="0.75" />
  </svg>
);

// 5. Perfil - Usuario Relleno
const SolidUserIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="7" r="4.5" />
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8v1H4v-1z" />
  </svg>
);

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Ocultar BottomNav en Onboarding
  if (pathname === "/onboarding") return null;

  const navItems = [
    { href: "/", component: SolidHomeIcon, isLogo: false },
    { href: "/tracker", component: SolidTrackerIcon, isLogo: false },
    { href: "/coach", component: null, isLogo: true },
    { href: "/wearables", component: SolidWatchIcon, isLogo: false },
    { href: "/profile", component: SolidUserIcon, isLogo: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-safe pt-2 pointer-events-none">
      <div className="max-w-xs mx-auto h-14 rounded-full bg-[#121214E6] border border-white/15 flex items-center justify-around px-3 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-2xl pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => hapticLight()}
              className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 active:scale-95 ${
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {item.isLogo ? (
                <Sle8pLogoIaTabIcon isActive={isActive} />
              ) : (
                item.component && (
                  <item.component
                    className={`transition-all duration-200 ${
                      isActive
                        ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                        : "scale-100"
                    } w-5 h-5`}
                  />
                )
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
