import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="ml-2 text-white font-semibold text-xl">Gestión de Productos</span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 ${isActive('/')}`}
            >
              Productos
            </Link>
            <Link
              to="/products/new"
              className={`px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 ${isActive('/products/new')}`}
            >
              Nuevo Producto
            </Link>
            <Link
              to="/categories"
              className={`px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 ${isActive('/categories')}`}
            >
              Categorías
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;