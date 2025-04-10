'use client';


const releases = [
  {
    id: 'release1',
    title: 'ZERO9001',
    image: '/releases/zero9001.png',
  },
  {
    id: 'release2',
    title: 'ZERO9002',
    image: '/releases/zero9002.png',
  },
  {
    id: 'release3',
    title: 'ZERO9003',
    image: '/releases/zero9003.png',
  },
];

export default function ReleasesPage() {
  return (
	<div className="pt-[80px] px-6 pb-12 bg-white min-h-screen text-black">
	  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {releases.map((release) => (
          <div
			  key={release.id}
			  className="group relative bg-[#f7f7f7] p-[3px] aspect-square cursor-pointer transition duration-300"
			>
			  <img
				src={release.image}
				alt={release.title}
				className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
			  />
			  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center text-white text-lg tracking-wide font-founders">
				{release.title}
			  </div>
			</div>
        ))}
      </div>
    </div>
  );
}
