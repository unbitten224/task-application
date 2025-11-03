import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/products';
import { getCategories } from '../api/categories';
import Filters from '../components/Filters';
import ProductCard from '../components/ProductCard';
import { Loading, ErrorMessage, EmptyState } from '../components/common/LoadingStates';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProducts(filters);
        if (mounted) {
          if (response && response.products) {
            setProducts(response.products);
            setPagination({
              total: response.pagination?.total || 0,
              totalPages: response.pagination?.totalPages || 0
            });
          } else {
            setError('Formato de respuesta inválido');
          }
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching products:', error);
          setError(error.message || 'Error al cargar los productos');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchProducts();
    
    return () => {
      mounted = false;
    };
  }, [
    filters.search,
    filters.categoryId,
    filters.page,
    filters.limit
  ]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      setError(error.message || 'Error al eliminar el producto');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
          <p className="mt-1 text-gray-600">Gestiona tu inventario de productos</p>
        </div>
        <Link
          to="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Producto
        </Link>
      </div>

      <Filters
        onFilterChange={handleFilterChange}
        categories={categories}
      />

      {products.length === 0 ? (
        <EmptyState message="No se encontraron productos" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`mx-1 px-4 py-2 rounded ${
                    filters.page === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;