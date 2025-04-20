import { notFound } from 'next/navigation';
import { products } from '../products';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  return (
    <div className="pt-[80px] px-6 pb-12 text-black bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <img src={product.image} alt={product.title} className="w-full object-cover" />
        <h1 className="mt-6 text-2xl font-bold">{product.title}</h1>
        <p className="mt-2 text-gray-600">{product.description}</p>
        <p className="mt-4 text-lg font-semibold">£{product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
