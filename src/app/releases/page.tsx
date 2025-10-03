// src/app/releases/page.tsx
import Image from "next/image";

// --- Types ---------------------------------------------------
type SoundCloudEmbed = {
  type: "soundcloud";
  url: string;        // public SoundCloud track/playlist/set URL
  height?: number;    // optional override
};

type SpotifyEmbed = {
  type: "spotify";
  url: string;        // full Spotify embed URL or open URL
  height?: number;    // optional override
};

type Release = {
  id: string;
  ffm: string;        // your link-in-bio / distributor URL
  imageSrc: string;
  imageAlt: string;
  embed: SoundCloudEmbed | SpotifyEmbed;
};

// --- Data (adjust as you add more releases) -------------------
const releases: Release[] = [
  {
    id: "release1",
    ffm: "https://ffm.to/xejekv3",
    imageSrc: "/releases/zero9001.jpg",
    imageAlt: "ZERO9001",
    embed: {
      type: "soundcloud",
      url: "https://soundcloud.com/zero9-uk/sets/james-harcourt-aesthesis-ep-z9001",
      height: 360, // visual player; tweak between ~300–420
    },
  },
  {
    id: "release2",
    ffm: "https://ffm.to/4xbqkn4",
    imageSrc: "/releases/zero9002.jpg",
    imageAlt: "ZERO9002",
    embed: {
      type: "soundcloud",
      url: "https://soundcloud.com/zero9-uk/sets/gabriel-atlas-true-neptune-ep-z9002",
      height: 360,
    },
  },
];

// --- Helpers --------------------------------------------------
function buildSoundCloudSrc(scUrl: string): string {
  const params = new URLSearchParams({
    url: scUrl,
    visual: "true",          // crucial: gets full transport + playlist
    auto_play: "false",
    show_teaser: "false",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

function buildSpotifySrc(openUrl: string): string {
  // Accept either open or embed URLs; normalize to /embed/
  // Examples:
  //  - https://open.spotify.com/album/xyz -> https://open.spotify.com/embed/album/xyz
  //  - https://open.spotify.com/playlist/xyz -> /embed/playlist/xyz
  const url = new URL(openUrl);
  // insert `/embed` after hostname if missing
  if (!url.pathname.startsWith("/embed/")) {
    url.pathname = `/embed${url.pathname}`;
  }
  return url.toString();
}

// Choose sensible default heights per provider
function defaultHeightFor(embed: Release["embed"]): number {
  if (embed.height) return embed.height;
  return embed.type === "spotify" ? 352 : 360;
}

// --- Page -----------------------------------------------------
export default function ReleasesPage() {
  return (
    <div className="pt-[80px] px-6 pb-12 bg-white min-h-screen text-black">
      <div className="grid gap-8 mx-auto justify-center w-[min(90rem,90vw)] auto-rows-auto [grid-template-columns:repeat(auto-fit,minmax(300px,500px))]">
        {releases.map((release) => {
          const isSpotify = release.embed.type === "spotify";
          const src = isSpotify
            ? buildSpotifySrc(release.embed.url)
            : buildSoundCloudSrc(release.embed.url);
          const height = defaultHeightFor(release.embed);

          return (
            <div key={release.id} className="w-full">
              {/* Artwork tile */}
              <a
                href={release.ffm}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <div className="relative w-full aspect-square bg-[#f7f7f7] p-[3px]">
                  <Image
                    src={release.imageSrc}
                    alt={release.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 500px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority={false}
                  />
                </div>
              </a>

              {/* Collapsible preview */}
              <details className="group mt-3">
                <summary className="list-none cursor-pointer mx-auto flex items-center gap-2 text-xs tracking-wide text-black/70 hover:text-black">
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-open:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Preview
                </summary>

                <div className="mt-2">
                  <iframe
                    title={`${isSpotify ? "Spotify" : "SoundCloud"} ${release.id}`}
                    src={src}
                    width="100%"
                    height={height}
                    loading="lazy"
                    allow={isSpotify ? "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" : "autoplay"}
                    scrolling="no"
                    style={{ border: 0, display: "block" }}
                  />
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
