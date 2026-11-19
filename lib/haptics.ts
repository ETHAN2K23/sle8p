// Micro-haptics utility for Apple HIG tactile touch feedback

export function hapticLight() {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(8);
    } catch {}
  }
}

export function hapticMedium() {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(18);
    } catch {}
  }
}

export function hapticSuccess() {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([12, 30, 15]);
    } catch {}
  }
}

export function hapticSelection() {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(10);
    } catch {}
  }
}
