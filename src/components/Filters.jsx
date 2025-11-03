import React from 'react';
import { useDebounce } from '../hooks/useDebounce';

const Filters = ({ onFilterChange, categories }) => {
  const [filters, setFilters] = React.useState({
    search: '',
    categoryId: ''
  });

  const debouncedSearch = useDebounce(filters.search);

  React.useEffect(() => {
    onFilterChange({ 
      search: debouncedSearch,
      categoryId: filters.categoryId 
    });
  }, [debouncedSearch, filters.categoryId, onFilterChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Buscar por nombre
          </label>
          <input
            type="text"
            name="search"
            id="search"
            value={filters.search}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Buscar productos..."
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={filters.categoryId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;