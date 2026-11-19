"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hapticLight } from "@/lib/haptics";

// Solid Filled SVG Glyphs (Apple HIG Tab Bar Style)
const Sle8pLogoTabIcon: React.FC<{ className?: string; isActive?: boolean }> = ({
  className = "w-7 h-5",
}) => (
  <svg viewBox="0 0 40 24" fill="currentColor" className={className}>
    {/* Conjoined double circle silhouette */}
    <circle cx="12" cy="12" r="11" />
    <circle cx="28" cy="12" r="11" />
    {/* Inner eye sockets */}
    <circle cx="12" cy="12" r="5.5" fill="#000000" />
    <circle cx="28" cy="12" r="5.5" fill="#000000" />
    {/* Pupils looking to the right */}
    <circle cx="14" cy="12" r="2.8" fill="currentColor" />
    <circle cx="30" cy="12" r="2.8" fill="currentColor" />
    {/* Catchlight */}
    <circle cx="15" cy="11" r="0.9" fill="#000000" />
    <circle cx="31" cy="11" r="0.9" fill="#000000" />
  </svg>
);

const SolidTrackerIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="3" y="11" width="4.5" height="10" rx="2.25" />
    <rect x="9.75" y="4" width="4.5" height="17" rx="2.25" />
    <rect x="16.5" y="8" width="4.5" height="13" rx="2.25" />
  </svg>
);

const SolidSparkleIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
    <circle cx="19" cy="5" r="1.8" />
  </svg>
);

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

  // Hide BottomNav on Onboarding page
  if (pathname === "/onboarding") return null;

  const navItems = [
    { href: "/", component: Sle8pLogoTabIcon, isLogo: true },
    { href: "/tracker", component: SolidTrackerIcon },
    { href: "/coach", component: SolidSparkleIcon },
    { href: "/wearables", component: SolidWatchIcon },
    { href: "/profile", component: SolidUserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-safe pt-2 pointer-events-none">
      <div className="max-w-xs mx-auto h-14 rounded-full bg-[#121214E6] border border-white/20 flex items-center justify-around px-3 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-2xl pointer-events-auto">
        {navItems.map((item) => {
          const IconComponent = item.component;
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
              {isActive && (
                <span className="absolute -top-1 w-3.5 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
              <IconComponent
                className={`transition-transform ${
                  isActive ? "scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" : "scale-100"
                } ${item.isLogo ? "w-8 h-5" : "w-5 h-5"}`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
