"use client";

import { useCallback, useEffect, useMemo, useRef, useState, MouseEvent } from "react";

type SCEvent = "ready" | "play" | "pause" | "finish" | "playProgress" | "seek";

type SCPlayProgress = {
  currentPosition: number;      // ms
  relativePosition: number;     // 0..1
};

type SCSound = {
  id: number;
  title: string;
  permalink_url?: string;
  duration?: number;            // ms
  waveform_url?: string;        // may be png or json
};

type SCLoadOptions = {
  auto_play?: boolean;
  visual?: boolean;
  show_artwork?: boolean;
  show_user?: boolean;
  show_teaser?: boolean;
  hide_related?: boolean;
  show_comments?: boolean;
  color?: string;
  start_track?: number;
};

interface SCWidget {
  bind: (event: SCEvent, listener: (data?: SCPlayProgress) => void) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  isPaused: (cb: (paused: boolean) => void) => void;
  getSounds: (cb: (sounds: SCSound[]) => void) => void;
  getCurrentSound: (cb: (sound: SCSound | null) => void) => void;
  getDuration: (cb: (ms: number) => void) => void;
  seekTo: (ms: number) => void;
  load: (url: string, options?: SCLoadOptions) => void;
}

declare global {
  interface Window {
    SC?: {
      Widget: (el: HTMLIFrameElement | string) => SCWidget;
    };
  }
}

/* ---------------- util ---------------- */

function formatMs(ms?: number): string {
  if (!ms || ms <= 0) return "";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function preloadImg(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/** Try to turn SC waveform URL into likely PNGs. */
function buildWaveformPngCandidates(url?: string): string[] {
  if (!url) return [];
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/^\//, "");
    if (u.hostname === "wis.sndcdn.com" && path.endsWith(".png")) {
      return [url];
    }
    if (u.hostname === "wave.sndcdn.com" && path.endsWith(".json")) {
      const base = path.replace(/\.json$/, "");
      const hasSize = /_(m|l|s)$/i.test(base);
      const withoutSize = hasSize ? base.replace(/_(m|l|s)$/i, "") : base;

      const candidates: string[] = [];
      if (hasSize) candidates.push(`https://wis.sndcdn.com/${base}.png`);
      candidates.push(
        `https://wis.sndcdn.com/${withoutSize}_m.png`,
        `https://wis.sndcdn.com/${withoutSize}.png`,
        `https://wis.sndcdn.com/${withoutSize}_l.png`,
        `https://wis.sndcdn.com/${withoutSize}_s.png`
      );
      return Array.from(new Set(candidates));
    }
  } catch {
    // ignore
  }
  return [];
}

async function resolveWaveformPng(url?: string): Promise<string | null> {
  const candidates = buildWaveformPngCandidates(url);
  for (const c of candidates) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await preloadImg(c);
    if (ok) return c;
  }
  return null;
}

/** Fetch & normalize waveform JSON to 0..1 amplitudes (true shape). */
async function resolveWaveformSamples(url?: string): Promise<number[] | null> {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname !== "wave.sndcdn.com" || !parsed.pathname.endsWith(".json")) {
    return null;
  }
  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) return null;
    const json = await res.json() as unknown;

    // Try common shapes
    const j = json as Record<string, unknown>;
    let arr: number[] | null = null;

    const asNumArr = (v: unknown): number[] | null =>
      Array.isArray(v) && v.every((x) => typeof x === "number") ? (v as number[]) : null;

    arr = asNumArr(j.samples)
      ?? asNumArr(j.peaks)
      ?? asNumArr(j.data);

    if (!arr && Array.isArray(j.channels) && j.channels.length > 0) {
      const ch0 = asNumArr((j.channels as unknown[])[0]);
      if (ch0) arr = ch0;
    }

    if (!arr || arr.length === 0) return null;

    // Normalize (handle negative/positive or various ranges)
    let min = Infinity;
    let max = -Infinity;
    for (const v of arr) { if (v < min) min = v; if (v > max) max = v; }

    // If values are already 0..1 or 0..255, scale to 0..1
    let out: number[] = [];
    if (min >= 0) {
      const denom = max > 0 ? max : 1;
      out = arr.map((v) => v / denom);
    } else {
      // symmetric around 0: take absolute and scale by max abs
      const denom = Math.max(Math.abs(min), Math.abs(max)) || 1;
      out = arr.map((v) => Math.abs(v) / denom);
    }

    return out;
  } catch {
    return null;
  }
}

// Simple seeded PRNG for last-resort fallback bars
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- component ---------------- */

export function MiniSoundCloud({ scUrl, iframeId }: { scUrl: string; iframeId: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SCWidget | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sounds, setSounds] = useState<SCSound[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const [durationMs, setDurationMs] = useState<number>(0);
  const [positionMs, setPositionMs] = useState<number>(0);

  // Waveform sources
  const [wavePng, setWavePng] = useState<string | null>(null);
  const [waveSamples, setWaveSamples] = useState<number[] | null>(null);

  const idToIndex = useMemo(() => {
    const map = new Map<number, number>();
    sounds.forEach((s, i) => map.set(s.id, i));
    return map;
  }, [sounds]);

  // Ensure SC widget API exists
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.SC?.Widget) return;
    if (document.getElementById("sc-widget-api")) return;
    const script = document.createElement("script");
    script.id = "sc-widget-api";
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Init widget + event wiring
  useEffect(() => {
    let tries = 0;
    const maxTries = 120;
    const timer = window.setInterval(() => {
      if (window.SC?.Widget && iframeRef.current) {
        const w = window.SC.Widget(iframeRef.current);
        widgetRef.current = w;

        const refreshFromCurrentSound = async () => {
          w.getCurrentSound(async (snd) => {
            if (!snd) return;
            setCurrentIndex((prev) => idToIndex.get(snd.id) ?? prev ?? 0);
            setDurationMs(snd.duration ?? 0);

            // Prefer JSON waveform (true shape). If not, try PNG; else nothing.
            const samples = await resolveWaveformSamples(snd.waveform_url);
            if (samples && samples.length) {
              setWaveSamples(samples);
              setWavePng(null);
            } else {
              const png = await resolveWaveformPng(snd.waveform_url);
              setWavePng(png);
              setWaveSamples(null);
            }
          });
          w.getDuration((ms) => setDurationMs(ms));
        };

        w.bind("ready", () => {
          setIsReady(true);
          w.getSounds((list) => setSounds(list));
          refreshFromCurrentSound();
          w.isPaused((p) => setIsPlaying(!p));
        });

        w.bind("play", () => {
          setIsPlaying(true);
          refreshFromCurrentSound();
        });

        w.bind("pause", () => setIsPlaying(false));
        w.bind("finish", () => {
          setIsPlaying(false);
          setPositionMs(0);
        });

        w.bind("playProgress", (e) => {
          if (e?.currentPosition !== undefined) setPositionMs(e.currentPosition);
        });

        w.bind("seek", (e) => {
          if (e?.currentPosition !== undefined) setPositionMs(e.currentPosition);
        });

        window.clearInterval(timer);
      } else if (++tries >= maxTries) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [idToIndex]);

  const playIndex = useCallback(
    (idx: number) => {
      const w = widgetRef.current;
      if (!w) return;
      w.load(scUrl, {
        auto_play: true,
        start_track: idx,
        visual: false,
        show_artwork: false,
        show_user: false,
        show_teaser: false,
        hide_related: true,
        show_comments: false,
        color: "000000",
      });
      setCurrentIndex(idx);
      setIsPlaying(true);
      setPositionMs(0);
    },
    [scUrl]
  );

  const toggleRow = useCallback(
    (idx: number) => {
      const w = widgetRef.current;
      if (!isReady || !w) return;
      if (currentIndex === idx) {
        w.isPaused((paused) => (paused ? w.play() : w.pause()));
      } else {
        playIndex(idx);
      }
    },
    [currentIndex, isReady, playIndex]
  );

  const onScrub = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      const w = widgetRef.current;
      if (!w || durationMs <= 0) return;
      const rect = (evt.currentTarget as HTMLDivElement).getBoundingClientRect();
      const x = Math.min(Math.max(evt.clientX - rect.left, 0), rect.width);
      const pct = rect.width > 0 ? x / rect.width : 0;
      const target = Math.floor(durationMs * pct);
      w.seekTo(target);
      setPositionMs(target);
    },
    [durationMs]
  );

  const progressPct = durationMs > 0 ? (positionMs / durationMs) * 100 : 0;

  // Build visual bars from real samples if we have them
  const realBars = useMemo(() => {
    if (!waveSamples || waveSamples.length === 0) return null;
    // Downsample to ~160 columns for readability
    const targetBars = 160;
    const step = Math.max(1, Math.floor(waveSamples.length / targetBars));
    const out: number[] = [];
    for (let i = 0; i < waveSamples.length; i += step) {
      const slice = waveSamples.slice(i, i + step);
      const avg = slice.reduce((a, b) => a + Math.abs(b), 0) / slice.length;
      out.push(avg); // 0..1
    }
    return out;
  }, [waveSamples]);

  // Last-resort seeded bars
  const fallbackBars = useMemo(() => {
    const seed = (sounds[currentIndex ?? 0]?.id ?? 1337) & 0xffff;
    const rand = mulberry32(seed);
    const count = 64;
    return Array.from({ length: count }, () => 0.35 + rand() * 0.6);
  }, [sounds, currentIndex]);

  return (
    <div className="w-full font-founders text-[13px] leading-tight tracking-wide">
      {/* Hidden but non-zero sized iframe engine */}
      <iframe
        ref={iframeRef}
        id={iframeId}
        title={iframeId}
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
          scUrl
        )}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&show_artwork=false&color=000000`}
        allow="autoplay; encrypted-media; clipboard-write"
        scrolling="no"
        style={{
          border: 0,
          position: "absolute",
          width: 1,
          height: 1,
          left: -9999,
          top: 0,
          opacity: 0,
        }}
        aria-hidden
        tabIndex={-1}
      />

      {/* Waveform scrubber */}
      <div
        className="relative h-14 rounded-md border border-black/10 bg-black/[0.02] overflow-hidden mb-2 cursor-pointer select-none"
        onClick={onScrub}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={durationMs}
        aria-valuenow={positionMs}
        aria-label="Seek"
        title="Click to seek"
      >
        {realBars ? (
          <div className="absolute inset-0 px-2 flex items-end gap-[2px]">
            {realBars.map((h, i) => {
              const pct = (i / realBars.length) * 100;
              const filled = pct <= progressPct;
              return (
                <div
                  key={i}
                  className={`w-[calc(100%/160-2px)] rounded-sm ${
                    filled ? "bg-black/80" : "bg-black/25"
                  }`}
                  style={{ height: `${Math.max(0.08, Math.min(0.98, h)) * 100}%` }}
                />
              );
            })}
          </div>
        ) : wavePng ? (
          <>
            {/* Base (unplayed) */}
            <img
              src={wavePng}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
              draggable={false}
            />
            {/* Played overlay */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
              style={{ width: `${progressPct}%` }}
            >
              <img
                src={wavePng}
                alt=""
                className="h-full w-full object-cover opacity-80"
                draggable={false}
              />
            </div>
          </>
        ) : (
          // Seeded fallback (only used if JSON & PNG both unavailable)
          <div className="absolute inset-0 px-2 flex items-end gap-[2px]">
            {fallbackBars.map((h, i) => {
              const pct = (i / fallbackBars.length) * 100;
              const filled = pct <= progressPct;
              return (
                <div
                  key={i}
                  className={`w-[calc(100%/64-2px)] rounded-sm ${
                    filled ? "bg-black/70" : "bg-black/20"
                  }`}
                  style={{ height: `${h * 100}%` }}
                />
              );
            })}
          </div>
        )}

        {/* Playhead */}
        <div className="absolute inset-y-0" style={{ left: `${progressPct}%` }}>
          <div className="h-full w-px bg-black/60" />
        </div>

        {/* Time readout */}
        <div className="absolute right-1 bottom-1 text-[11px] tabular-nums px-1.5 py-0.5 rounded bg-white/70 backdrop-blur">
          {formatMs(positionMs)} / {formatMs(durationMs)}
        </div>
      </div>

      {/* Track list */}
      <div className="rounded-xl border border-black/10 bg-black/[0.035]">
        <ul className="divide-y divide-black/5">
          {sounds.length === 0 ? (
            <li className="flex items-center gap-3 px-3 py-2 opacity-60">Loading…</li>
          ) : (
            sounds.map((s, i) => {
              const isCurrent = currentIndex === i;
              const label = isCurrent && isPlaying ? "Pause" : "Play";
              return (
                <li key={s.id} className="flex items-center gap-3 px-3 py-2">
                  <button
                    type="button"
                    aria-label={label}
                    aria-pressed={isCurrent && isPlaying}
                    onClick={() => toggleRow(i)}
                    disabled={!isReady}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-black/20 hover:bg-black/10 transition disabled:opacity-40"
                    title={label}
                  >
                    {isCurrent && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 6h3v12H7zM14 6h3v12h-3z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5l11 7-11 7V5z" fill="currentColor" />
                      </svg>
                    )}
                  </button>

                  <span className="text-[11px] leading-none px-1.5 py-1 rounded bg-black/5 select-none">
                    {i + 1}
                  </span>

                  <span
                    className={`truncate ${isCurrent ? "font-medium" : "opacity-80 hover:opacity-100"}`}
                    title={s.title}
                  >
                    {s.title}
                  </span>

                  <span className="ml-auto tabular-nums opacity-60 text-[11px]">
                    {formatMs(s.duration)}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
