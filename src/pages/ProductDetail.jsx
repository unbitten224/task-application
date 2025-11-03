import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, deleteProduct } from '../api/products';
import { Loading, ErrorMessage } from '../components/common/LoadingStates';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        setError(error.message || 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteProduct(id);
        navigate('/');
      } catch (error) {
        setError(error.message || 'Error al eliminar el producto');
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Producto no encontrado" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-96 w-full object-cover md:w-96"
              src={product.image_url || 'https://via.placeholder.com/400'}
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400';
              }}
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-blue-600 mb-4">
                  {product.category_name}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/products/edit/${id}`)}
                  className="px-4 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.description || 'Sin descripción disponible'}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">ID</h4>
                    <p className="mt-1 text-sm text-gray-900">{product.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha de creación</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Volver a la lista
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;