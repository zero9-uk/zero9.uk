'use client';

import Image from 'next/image';

type Release = {
  id: string;
  title: string;
  image: string;
  url: string;
};

const releases: Release[] = [
  {
    id: 'release1',
    title: 'ZERO9001',
    image: '/releases/zero9001.jpg',
    url: 'https://ffm.to/xejekv3',
  },  
  {
    id: 'release2',
    title: 'ZERO9002',
    image: '/releases/zero9002.jpg',
    url: 'https://ffm.to/4xbqkn4',
  },
  // Future releases:
  // {
  //   id: 'release2',
  //   title: 'ZERO9002',
  //   image: '/releases/zero9002.jpg',
  //   url: 'https://ffm.to/...',
  // },
];

export default function ReleasesPage() {
  return (
    <div className="pt-[80px] px-6 pb-12 bg-white min-h-screen text-black">
		<div
		  className="
			grid gap-8 mx-auto justify-center
			w-[min(90rem,90vw)]  /* don't let the grid get wider than ~1440px or 90vw */
			auto-rows-auto
			[grid-template-columns:repeat(auto-fit,minmax(300px,500px))]
		  "
		>
        {releases.length === 1 ? (
          <a
            key={releases[0].id}
            href={releases[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-[#f7f7f7] p-[3px] aspect-square w-full"
            style={{
              maxWidth: '600px',
              maxHeight: '600px',
            }}
          >
            <Image
              src={releases[0].image}
              alt={releases[0].title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-105"
            />
          </a>
        ) : (
          releases.map((release) => (
			<a
			  key={release.id}
			  href={release.url}
			  target="_blank"
			  rel="noopener noreferrer"
			  className="relative bg-[#f7f7f7] p-[3px] aspect-square w-full"
			>
			  <Image
				src={release.image}
				alt={release.title}
				fill
				className="object-cover transition-transform duration-500 hover:scale-105"
			  />
			</a>
          ))
        )}
      </div>
    </div>
  );
}
