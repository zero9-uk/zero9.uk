"use client";

export default function HomePage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-contain"
        src="/logo-loop.mp4" // Make sure this matches your public folder filename
      />
    </div>
  );
}