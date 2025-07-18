export type Product = {
  slug: string;
  title: string;
  image: string;
  description: string;
  isService: boolean;
  price: number | string;
  pdf?: string;
  payhipUrl?: string;
};

export const products: Product[] = [
  {
    slug: 'studio-services',
    title: 'Production Services',
    image: '/shop/studio-services.png',
    description: 'View full rate card.',
	isService: true, // Optional flag if needed
    price: 'from £25 p/h',
	pdf: '/shop/ratecard2025.pdf'
  },
  {
    slug: 'z9001-looppack',
    title: 'Z9001 Loop Pack',
    image: '/shop/Z9001-loop-pack.jpg',
    description: 'Buy Now.',
	isService: false, // Optional flag if needed
    price: '£5',
	payhipUrl: 'https://payhip.com/b/eLKf6' // <- Replace this with your real link

  },
  // {
    // slug: 'zero9-tshirt',
    // title: 'ZERO9 T-Shirt',
    // image: '/shop/zero9-tshirt.png',
    // description: 'Premium quality branded T-shirt.',
    // price: 30.0,
  // },
  // {
    // slug: 'vinyl-zero9001',
    // title: 'Vinyl - ZERO9001',
    // image: '/shop/zero9001-vinyl.png',
    // description: 'Limited edition vinyl release.',
    // price: 15.0,
  // },
];
