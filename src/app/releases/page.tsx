'use client';

import Image from 'next/image'; 

type Release = {
  id: string;
  title: string;
  image: string;
};

const releases: Release[] = [
  {
    id: 'release3',
    title: 'ZERO9003',
    image: '/releases/zero9003.png',
  },
  {
    id: 'release2',
    title: 'ZERO9002',
    image: '/releases/zero9002.png',
  },
  {
    id: 'release1',
    title: 'ZERO9001',
    image: '/releases/zero9001.png',
  },
];

export default function ReleasesPage() {
  return (
    <div className="pt-[80px] px-6 pb-12 bg-white min-h-screen text-black">
      <div
        className="grid gap-8 w-full mx-auto justify-center items-start"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gridAutoRows: 'minmax(300px, 1fr)',
          justifyItems: 'center',
          width: '100%',
        }}
      >
        {releases.length === 1 ? (          
          <div
            key={releases[0].id}
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
          </div>
        ) : (
          releases.map((release) => (
            <div
              key={release.id}
              className="relative bg-[#f7f7f7] p-[3px] aspect-square w-full"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <Image
                src={release.image}
                alt={release.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
