'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaYoutube,
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaTiktok,
  FaFacebook,
} from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="z-50 w-full h-[64px] px-6 flex items-center justify-between text-zero9-text font-founders text-sm tracking-wide uppercase fixed top-0 left-0 bg-white">
        {/* Left: Text Logo */}
        <div className="flex items-center">
          <Link href="/">
            <span className="text-2xl font-semibold tracking-[0.2em] uppercase leading-none">
              zero9
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs leading-none">
          <Link href="/releases">Releases</Link>
          <Link href="/shop">Shop</Link>

          <Image
            src="/ZeroNine-logoonly.svg"
            alt="ZERO9 Icon"
            height={17}
            width={17}
            className="mx-3 filter grayscale"
          />

          <Link href="https://learn.zero9.uk">Learn</Link>
          <Link href="/about">About</Link>
        </nav>

        {/* Right: Social Icons (desktop only) */}
        <div className="hidden md:flex items-center gap-5 text-base">
          <a href="https://www.youtube.com/@zero9-uk" target="_blank" aria-label="YouTube" className="relative -top-[1px]">
            <FaYoutube />
          </a>
          <a href="https://instagram.com/zero9.uk" target="_blank" aria-label="Instagram" className="relative -top-[1px]">
            <FaInstagram />
          </a>
          <a href="https://soundcloud.com/zero9-uk" target="_blank" aria-label="SoundCloud" className="relative -top-[1px]">
            <FaSoundcloud />
          </a>
          <a href="https://open.spotify.com/playlist/3SXexZuNWQp0ZvcvocgoET" target="_blank" aria-label="Spotify" className="relative -top-[1px]">
            <FaSpotify />
          </a>
          <a href="https://tiktok.com" target="_blank" aria-label="TikTok" className="relative -top-[1px]">
            <FaTiktok />
          </a>
          <a href="https://facebook.com" target="_blank" aria-label="Facebook" className="relative -top-[1px]">
            <FaFacebook />
          </a>
        </div>

        {/* Burger menu (mobile only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white text-black flex flex-col items-center justify-center gap-8 font-founders uppercase text-lg">
          <Link href="/releases" onClick={() => setMenuOpen(false)}>Releases</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="https://learn.zero9.uk" onClick={() => setMenuOpen(false)}>Learn</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      )}
    </>
  );
}
