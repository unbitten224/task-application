import React from 'react';
import { useDebounce } from '../hooks/useDebounce';

const Filters = ({ onFilterChange }) => {
  const [localFilters, setLocalFilters] = React.useState({
    search: '',
    status: '',
    priority: ''
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, search: value }));
    onFilterChange({ search: value, status: localFilters.status, priority: localFilters.priority });
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, status: value }));
    onFilterChange({ search: localFilters.search, status: value, priority: localFilters.priority });
  };

  const handlePriorityChange = (e) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, priority: value }));
    onFilterChange({ search: localFilters.search, status: localFilters.status, priority: value });
  };

  const clearFilters = () => {
    setLocalFilters({ search: '', status: '', priority: '' });
    onFilterChange({ search: '', status: '', priority: '' });
  };

  const hasActiveFilters = localFilters.search || localFilters.status || localFilters.priority;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar tarea
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={localFilters.search}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
              placeholder="Buscar por título o descripción..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por estado
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              value={localFilters.status}
              onChange={handleStatusChange}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 appearance-none"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por prioridad
          </label>
          <div className="relative">
            <select
              id="priority"
              name="priority"
              value={localFilters.priority}
              onChange={handlePriorityChange}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 appearance-none"
            >
              <option value="">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;
