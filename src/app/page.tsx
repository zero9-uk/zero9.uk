"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Initial check
    checkOrientation();

    // Update on resize
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const videoSrc = isPortrait
    ? "/logo-loop-p.mp4"
    : "/logo-loop-l.mp4";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden">
      <video
        key={videoSrc} // force reload on source change
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-contain"
        src={videoSrc}
      />
    </div>
  );
}
