'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/* Minimal embed types */
type SpotifyEmbed = {
  type: 'spotify';
  src: string;          // FULL Spotify EMBED URL (contains /embed/)
  height?: number;      // ~152 for track, ~352 for playlist/album
};

type SoundCloudEmbed = {
  type: 'soundcloud';
  trackUrl: string;     // Public SC track OR playlist/set URL
  height?: number;      // ~166 for mini (visual=false)
};

type Release = {
  id: string;
  title: string;
  image: string;
  url: string;          // distributor / linktree
  embed?: SpotifyEmbed | SoundCloudEmbed;
};

/* Your releases */
const releases: Release[] = [
  {
    id: 'release1',
    title: 'ZERO9001',
    image: '/releases/zero9001.jpg',
    url: 'https://ffm.to/xejekv3',
    // Enable ONE of these with your real URL if you want the Preview toggle visible:
	embed: { type: 'soundcloud', trackUrl: 'https://soundcloud.com/zero9-uk/sets/james-harcourt-aesthesis-ep-z9001' },   
  },
  {
    id: 'release2',
    title: 'ZERO9002',
    image: '/releases/zero9002.jpg',
    url: 'https://ffm.to/4xbqkn4',
    // embed: { type: 'soundcloud', trackUrl: 'https://soundcloud.com/zero9-uk/<track-or-set>' },
	embed: { type: 'soundcloud', trackUrl: 'https://soundcloud.com/zero9-uk/sets/gabriel-atlas-true-neptune-ep-z9002' },   
  },
];

/* Build SoundCloud mini (visual=false) iframe src */
function buildSoundCloudSrc(trackUrl: string) {
  const params = new URLSearchParams({
    url: trackUrl,
    visual: 'true',
    auto_play: 'false',
    show_teaser: 'false',
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}


/* Tiny control bar for SoundCloud sets (Prev/Next + optional list) */
function SoundCloudControls({ iframeId }: { iframeId: string }) {
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const [idx, setIdx] = useState(0);
  const [showList, setShowList] = useState(false);
  const [titles, setTitles] = useState([] as string[]);

  useEffect(() => {
    let widget: any | null = null;
    let retryTimer: any | null = null;

    const initWidget = () => {
      const SC = (window as any).SC;
      if (!SC || !SC.Widget) return;
      const el = document.getElementById(iframeId) as HTMLIFrameElement | null;
      if (!el) return;

      widget = SC.Widget(el);

      widget.bind('READY', () => {
        setReady(true);
        try {
          widget.getSounds((sounds: any[]) => {
            const list = Array.isArray(sounds) ? sounds : [];
            setCount(list.length || 0);
            setTitles(list.map((s: any) => (s && s.title) || ''));
          });
          widget.getCurrentSoundIndex((i: number) => setIdx(typeof i === 'number' ? i : 0));
        } catch {
          /* noop */
        }
      });

      widget.bind('PLAY', () => {
        try {
          widget.getCurrentSoundIndex((i: number) => setIdx(typeof i === 'number' ? i : 0));
        } catch {
          /* noop */
        }
      });
    };

    const ensureApi = () => {
      const SC = (window as any).SC;
      if (SC && SC.Widget) {
        initWidget();
        return;
      }
      let script = document.querySelector('script[data-sc-api="1"]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://w.soundcloud.com/player/api.js';
        script.async = true;
        script.defer = true;
        script.setAttribute('data-sc-api', '1');
        document.body.appendChild(script);
      }
      script.addEventListener('load', initWidget);
      // Retry a bit in case load event races
      retryTimer = setInterval(() => {
        const SCnow = (window as any).SC;
        if (SCnow && SCnow.Widget) {
          clearInterval(retryTimer as any);
          initWidget();
        }
      }, 200);
    };

    ensureApi();

    return () => {
      if (retryTimer) clearInterval(retryTimer);
      // SC widget has no explicit destroy; removing listeners would require tracking handles
      widget = null;
    };
  }, [iframeId]);

  const call = (fn: 'next' | 'prev' | 'skip', arg?: number) => {
    const SC = (window as any).SC;
    const el = document.getElementById(iframeId) as HTMLIFrameElement | null;
    if (!SC || !SC.Widget || !el) return;
    const w = SC.Widget(el);
    try {
      if (fn === 'skip') w.skip(arg);
      else (w as any)[fn]();
    } catch {
      /* noop */
    }
  };

  if (!ready) return null;

  const hasList = count > 1;

  return (
    <div className="mt-2 text-xs text-black/70">
      {hasList && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => call('prev')}
              className="px-2 py-1 rounded hover:text-black focus:outline-none"
              aria-label="Previous track"
              title="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => call('next')}
              className="px-2 py-1 rounded hover:text-black focus:outline-none"
              aria-label="Next track"
              title="Next"
            >
              ›
            </button>
            <span className="select-none">{idx + 1}/{count}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowList(v => !v)}
            className="px-2 py-1 rounded hover:text-black focus:outline-none"
            aria-expanded={showList}
            aria-controls={`${iframeId}-list`}
            title="Track list"
          >
            •••
          </button>
        </div>
      )}

      {hasList && showList && (
        <div id={`${iframeId}-list`} className="mt-2 w-full">
          <ul className="border border-black/10 rounded-md overflow-hidden">
            {titles.map((t, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => call('skip', i)}
                  className={`w-full text-left px-3 py-2 hover:bg-black/5 ${i === idx ? 'bg-black/5' : ''}`}
                >
                  {i + 1}. {t || 'Untitled'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ReleasesPage() {
  return (
    <div className="pt-[80px] px-6 pb-12 bg-white min-h-screen text-black">
      <div className="grid gap-8 mx-auto justify-center w-[min(90rem,90vw)] auto-rows-auto [grid-template-columns:repeat(auto-fit,minmax(300px,500px))]">
        {releases.map((release) => {
          const isSpotify = release.embed?.type === 'spotify';
          const scSrc = release.embed?.type === 'soundcloud' ? buildSoundCloudSrc(release.embed.trackUrl) : null;
          const height = (release.embed && release.embed.height) ?? (isSpotify ? 352 : 265);
          const scIframeId = `sc-${release.id}`;

          return (
            <div key={release.id} className="w-full">
              {/* Artwork -> distributor (square via padding-top) */}
              <a href={release.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                <div className="relative w-full" style={{ paddingTop: '100%' }}>
                  <div className="absolute inset-0 bg-[#f7f7f7] p-[3px]">
                    <Image
                      src={release.image}
                      alt={release.title}
                      fill
                      sizes="100vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              </a>

              {/* Collapsible preview only if an embed is provided */}
              {release.embed && (
				  <details className="group mt-3">
				  <summary className="list-none cursor-pointer mx-auto flex items-center gap-2 text-xs tracking-wide text-black/70 hover:text-black">
					<svg className="h-5 w-5 transition-transform duration-300 group-open:rotate-180" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
					</svg>
					Preview
				  </summary>

                  <div className="mt-2">
                    {isSpotify ? (
                      <iframe
                        title={`Spotify ${release.id}`}
                        src={(release.embed as SpotifyEmbed).src}
                        width="100%"
                        height={height}
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        style={{ border: 0, display: 'block' }}
                      />
                    ) : (
                      <>
                        <iframe
                          id={scIframeId}
                          title={`SoundCloud ${release.id}`}
                          src={scSrc as string}
                          width="100%"
                          height={height}
                          loading="lazy"
                          allow="autoplay"
                          scrolling="no"
                          style={{ border: 0, display: 'block' }}
                        />
                        {/* Prev/Next + optional list for sets */}
                        <SoundCloudControls iframeId={scIframeId} />
                      </>
                    )}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}