"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Page() {
  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const paths = logoRef.current?.querySelectorAll('path');
    if (!paths) return;

    const timelines = Array.from(paths).map((path, i) => {
      return gsap.to(path, {
        x: () => gsap.utils.random(-40, 40),
        y: 0, // lock vertical movement
        scale: () => gsap.utils.random(0.98, 1.05),
        rotate: () => gsap.utils.random(-2, 2),
        transformOrigin: 'center center',
        transformBox: 'fill-box',
        duration: gsap.utils.random(2.5, 4.5),
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 1.5),
        repeat: -1,
        yoyo: true,
        repeatRefresh: true // ensures random x/rotate on every cycle
      });
    });

    return () => timelines.forEach(tl => tl.kill());
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white group overflow-hidden transition-colors duration-500 hover:bg-black">
      <svg
        ref={logoRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="100 370 63 102"
        className="w-[75%] h-[75%] transition-all duration-700 ease-in-out"
      >
        <path
          className="fill-[#111111] group-hover:fill-pink-500"
          d="M147.98,401.18h14.84c-0.11-17.22-13.61-30.88-31.09-30.88c-17.48,0-31,13.67-31.11,30.88h14.84
            c0.11-8.85,6.8-15.68,16.26-15.68S147.87,392.33,147.98,401.18z"
        />
        <path
          className="fill-[#333333] group-hover:fill-pink-400"
          d="M115.47,412.42h-14.84c0.11,17.22,13.61,30.88,31.09,30.88c17.48,0,31-13.67,31.11-30.88h-14.84
            c-0.11,8.85-6.8,15.68-16.26,15.68S115.58,421.27,115.47,412.42z"
        />
        <path
          className="fill-[#111111] group-hover:fill-pink-500"
          d="M115.47,440.69l-14.84-0.05c0.05,17.22,13.51,30.93,30.98,30.99c17.48,0.06,31.04-13.56,31.21-30.78
            l-14.84-0.05c-0.14,8.85-6.85,15.66-16.32,15.63S115.55,449.54,115.47,440.69z"
        />
      </svg>
    </div>
  );
}