import { notFound } from 'next/navigation';
import { products, Product } from '../products';

export default function ProductPage({ params }: { params: { slug: string } })
  const { slug } = params;

  const product: Product | undefined = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  return (
    <div className="pt-[80px] px-6 pb-12 text-black bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <img src={product.image} alt={product.title} className="w-full object-cover" />
        <h1 className="mt-6 text-2xl font-bold">{product.title}</h1>
        <p className="mt-2 text-gray-600">{product.description}</p>

        {product.price && (
          <p className="mt-4 text-lg font-semibold">
            {typeof product.price === 'number'
              ? `£${product.price.toFixed(2)}`
              : product.price}
          </p>
        )}

        {product.pdf && (
          <iframe
            src={product.pdf}
            title="PDF Viewer"
            className="w-full h-[600px] mt-6 border"
          />
        )}
      </div>
    </div>
  );
}
