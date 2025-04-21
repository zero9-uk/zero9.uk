import { notFound } from 'next/navigation';
import { products } from '../products';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  const isPDF = !!product.pdf;

  return (
    <div className="pt-[80px] px-6 pb-12 text-black bg-white min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        {isPDF ? (
          <iframe
            src={product.pdf}
            className="w-full h-[90vh] border"
            title={product.title}
          />
        ) : (
          <>
            <img
              src={product.image}
              alt={product.title}
              className="w-full object-cover"
            />
            <h1 className="mt-6 text-2xl font-bold">{product.title}</h1>
            <p className="mt-2 text-gray-600">{product.description}</p>
            {product.price && (
              <p className="mt-4 text-lg font-semibold">
                {typeof product.price === 'number' ? `£${product.price.toFixed(2)}` : product.price}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
