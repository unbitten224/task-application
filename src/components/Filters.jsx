import React from 'react';
import { useDebounce } from '../hooks/useDebounce';

const Filters = ({ onFilterChange, categories }) => {
  const [localFilters, setLocalFilters] = React.useState({
    search: '',
    categoryId: ''
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, search: value }));
    onFilterChange({ search: value, categoryId: localFilters.categoryId });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, categoryId: value }));
    onFilterChange({ search: localFilters.search, categoryId: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="relative">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Buscar producto
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
            placeholder="Buscar por nombre..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por categoría
        </label>
        <div className="relative">
          <select
            id="categoryId"
            name="categoryId"
            value={localFilters.categoryId}
            onChange={handleCategoryChange}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 appearance-none"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;