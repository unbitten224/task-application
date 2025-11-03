import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';
import { Loading, ErrorMessage } from '../components/common/LoadingStates';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError(error.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('El nombre de la categoría no puede estar vacío');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Enviando petición para crear categoría:', newCategoryName);
      const result = await createCategory({ name: newCategoryName.trim() });
      console.log('Categoría creada:', result);
      setNewCategoryName('');
      await fetchCategories();
    } catch (error) {
      console.error('Error al crear categoría:', error);
      setError(error.response?.data?.message || error.message || 'Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    try {
      setLoading(true);
      await updateCategory(id, { name: newName });
      setEditingCategory(null);
      await fetchCategories();
    } catch (error) {
      setError(error.message || 'Error al actualizar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

    try {
      setLoading(true);
      await deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      setError(error.message || 'Error al eliminar la categoría');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !categories.length) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Categorías</h1>
        
        {/* Formulario para nueva categoría */}
        <form onSubmit={handleCreateCategory} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nueva categoría"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Agregar Categoría
            </button>
          </div>
        </form>

        {/* Lista de categorías */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category.id} className="p-4">
                {editingCategory === category.id ? (
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      defaultValue={category.name}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateCategory(category.id, e.target.value);
                        } else if (e.key === 'Escape') {
                          setEditingCategory(null);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{category.name}</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setEditingCategory(category.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Categories;