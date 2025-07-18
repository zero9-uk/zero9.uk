'use client';

import Link from 'next/link';
import { products } from './products';

function isExternalLink(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://');
}

export default function ShopPage() {
  const hasProducts = products.length > 0;
  const centerGrid = products.length < 3;

  return (
    <div className="pt-[80px] px-6 pb-12 bg-white min-h-screen text-black">
      {hasProducts ? (
        <div
          className={`grid gap-8 mx-auto w-full ${
            centerGrid ? 'place-items-center' : ''
          } grid-cols-1 ${products.length >= 2 ? 'sm:grid-cols-2' : ''} ${
            products.length >= 3 ? 'md:grid-cols-3' : ''
          }`}
        >
          {products.map((product) => {
            const href = product.payhipUrl || `/shop/${product.slug}`;
            const external = isExternalLink(href);

            return (
              <Link key={product.slug} href={href} passHref>
                <a
                  className="flex flex-col items-center max-w-[400px] w-full"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <div className="relative bg-[#f7f7f7] aspect-square w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      onError={(e) => {
                        e.currentTarget.src = '/shop/placeholder.png';
                      }}
                      className="object-contain w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="w-full mt-2 text-sm sm:text-base font-founders tracking-wide flex justify-between items-center">
                    <span>{product.title}</span>
                    <span>
                      {typeof product.price === 'number'
                        ? `£${product.price.toFixed(2)}`
                        : product.price}
                    </span>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-lg font-founders tracking-wide text-gray-600 mt-20">
          No products available right now — check back soon!
        </div>
      )}
    </div>
  );
}
