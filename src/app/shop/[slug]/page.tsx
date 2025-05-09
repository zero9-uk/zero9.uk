import { notFound } from 'next/navigation';
import { products } from '../products';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  const isPdfOnly = Boolean(product.pdf);

  return (
    <div className="pt-[80px] px-6 pb-12 text-black bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-600 mb-6">{product.description}</p>

        {product.price && (
          <p className="text-lg font-semibold mb-6">
            {typeof product.price === 'number'
              ? `£${product.price.toFixed(2)}`
              : product.price}
          </p>
        )}

        {!isPdfOnly && (
          <img
            src={product.image}
            alt={product.title}
            className="w-full object-cover mb-8"
          />
        )}

        {product.pdf && (
          <iframe
            src={product.pdf}
            title="PDF Viewer"
            className="w-full h-[80vh] border"
          />
        )}
      </div>
    </div>
  );
}
