import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onDelete }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      onDelete(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative">
        <img
          src={product.image_url || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200';
          }}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
          product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.category_name}</p>
        <p className="text-gray-700 font-bold">
          ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
        
        <div className="mt-4 flex justify-between">
          <Link
            to={`/products/${product.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Ver detalles
          </Link>
          <div className="space-x-2">
            <Link
              to={`/products/edit/${product.id}`}
              className="text-yellow-600 hover:text-yellow-800"
            >
              Editar
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;