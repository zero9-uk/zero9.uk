// src/app/releases/page.tsx
import Image from "next/image";
import Script from "next/script";
import { MiniSoundCloud } from "@/components/MiniSoundCloud";

type Release = {
  id: string;
  ffm: string;
  imageSrc: string;
  imageAlt: string;
  scUrl: string; // SC playlist/set URL
  releaseDate: string; // e.g. "2025-02-14"
};

function formatReleaseDate(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(",", "");	
}

const releases: Release[] = [  
  {
    id: "release4",
    ffm: "https://ffm.to/rw6n9ry",
    imageSrc: "/releases/zero9004.jpg",
    imageAlt: "ZERO9004",
    scUrl:"https://soundcloud.com/zero9-uk/sets/blood-moon-z9004",
    releaseDate: "2026-02-06",
  },
  {
    id: "release3",
    ffm: "https://ffm.to/qxm05ea",
    imageSrc: "/releases/zero9003.jpg",
    imageAlt: "ZERO9003",
    scUrl:"https://soundcloud.com/zero9-uk/sets/trinity-z9003",
    releaseDate: "2025-11-07",
  },
  {
    id: "release2",
    ffm: "https://ffm.to/4xbqkn4",
    imageSrc: "/releases/zero9002.jpg",
    imageAlt: "ZERO9002",
    scUrl: "https://soundcloud.com/zero9-uk/sets/true-neptune-z9002",		    
    releaseDate: "2025-09-19",
  },
  {
    id: "release1",
    ffm: "https://ffm.to/xejekv3",
    imageSrc: "/releases/zero9001.jpg",
    imageAlt: "ZERO9001",
    scUrl: "https://soundcloud.com/zero9-uk/sets/aesthesis-z9001",
    releaseDate: "2025-07-11",
  },
];

export default function ReleasesPage() {
  return (
    <div className="pt-[80px] px-6 pb-12 bg-white min-h-screen text-black">
      {/* Load SoundCloud API once (needed for the hidden iframe control) */}
      <Script src="https://w.soundcloud.com/player/api.js" strategy="afterInteractive" />

      <div className="grid gap-8 mx-auto justify-center w-[min(90rem,90vw)] auto-rows-auto [grid-template-columns:repeat(auto-fit,minmax(300px,500px))]">
        {releases.map((r) => (
          <div key={r.id} className="w-full">
            {/* Artwork tile (unchanged) */}
            <a
              href={r.ffm}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <div className="relative w-full aspect-square bg-[#f7f7f7] p-[3px]">
                <Image
                  src={r.imageSrc}
                  alt={r.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, 500px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </a>

            {/* Collapsible minimal player */}
			<details className="group mt-3 w-full text-center">
			  <summary
				className="list-none cursor-pointer mx-auto w-fit inline-flex items-center justify-center gap-2 text-xs tracking-wide text-black/70 hover:text-black"
				aria-label={`Toggle player for ${r.imageAlt}`}
			  >
				<span className="uppercase tracking-widest text-[11px]">
				  {formatReleaseDate(r.releaseDate)}
				</span>
				<svg
				  className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
				  viewBox="0 0 24 24"
				  fill="none"
				  aria-hidden="true"
				>
				  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
				</svg>
			  </summary>

			  <div className="mt-2">
				{r.scUrl && <MiniSoundCloud scUrl={r.scUrl} iframeId={`sc-${r.id}`} />}
			  </div>
			</details>


          </div>
        ))}
      </div>
    </div>
  );
}
