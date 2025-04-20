'use client';

import Link from 'next/link';
import { products } from './products';

export default function ShopPage() {
  return (
    <div className="pt-[80px] px-6 pb-12 bg-white min-h-screen text-black">
      <div className="grid gap-8 w-full mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <Link key={product.slug} href={`/shop/${product.slug}`} className="flex flex-col items-center">
            <div className="relative bg-[#f7f7f7] aspect-square w-full max-w-[80vmin] max-h-[80vmin] overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.src = '/shop/placeholder.png';
                }}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="w-full mt-2 text-sm sm:text-base font-founders tracking-wide flex justify-between items-center">
              <span>{product.title}</span>
              <span>£{product.price.toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
