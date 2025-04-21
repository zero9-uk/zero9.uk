export type Product = {
  slug: string;
  title: string;
  image: string;
  description: string;
  isService: boolean;
  price: number | string;
  pdf?: string;
};

export const products: Product[] = [
  {
    slug: 'studio-services',
    title: 'Studio/Production Services',
    image: '/shop/studio-services.png',
    description: 'View full rate card.',
	isService: true, // Optional flag if needed
    price: 'from £25 p/h',
	pdf: '/shop/ratecard2025.pdf'
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
