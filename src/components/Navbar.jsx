import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useApp();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="ml-2 text-white font-semibold text-xl">Gestión de Tareas</span>
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 ${isActive('/')}`}
              >
                Tareas
              </Link>
              <Link
                to="/tasks/new"
                className={`px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 ${isActive('/tasks/new')}`}
              >
                Nueva Tarea
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm">
                  {currentUser?.name || currentUser?.email || 'Usuario'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 ${isActive('/login')}`}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className={`px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 ${isActive('/register')}`}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
