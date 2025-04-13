'use client';

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
    <div className="pt-[80px] px-6 pb-12 bg-white min-h-screen text-black flex justify-center">
      <div
        className={`grid gap-8 w-full max-w-[1400px] ${
          releases.length === 1
            ? 'grid-cols-1'
            : releases.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
        }`}
      >
        {releases.map((release) => (
          <div key={release.id} className="flex flex-col items-center w-full">
            <div className="relative bg-[#f7f7f7] p-[3px] aspect-square w-full">
              <img
                src={release.image}
                alt={release.title}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
