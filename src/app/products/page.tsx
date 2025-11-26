import { ApiResponse, Category, Product } from '@/types/product';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProducts(categoryId?: string): Promise<Product[]> {
  try {
    const url = categoryId 
      ? `${API_URL}/products?categoryId=${categoryId}`
      : `${API_URL}/products`;
      
    const res = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!res.ok) return [];
    
    const data: ApiResponse<Product[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return [];
    
    const data: ApiResponse<Category[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { categoryId } = await searchParams;
  const products = await getProducts(categoryId);
  const categories = await getCategories();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Productos</h1>
      
      {/* Filtro de Categorías */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !categoryId
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              categoryId === String(category.id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              {product.imageUrl && (
                <div className="relative h-48 w-full bg-gray-200">
                  <img
                    src={product.imageUrl}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {product.nombre}
                  </h2>
                  <span className="text-lg font-bold text-blue-600">
                    ${product.precio}
                  </span>
                </div>
                {product.Category && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2 w-fit">
                    {product.Category.name}
                  </span>
                )}
                {product.descripcion && (
                  <p className="text-gray-600 text-sm line-clamp-2 mt-auto">
                    {product.descripcion}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
