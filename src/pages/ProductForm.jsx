import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct } from '../api/products';
import { getCategories } from '../api/categories';
import { Loading, ErrorMessage } from '../components/common/LoadingStates';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: ''
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        setError('Error al cargar las categorías');
      }
    };

    const loadProduct = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const data = await getProduct(id);
          setProduct({
            name: data.name,
            description: data.description,
            price: data.price.toString(),
            stock: data.stock.toString(),
            category_id: data.category_id.toString(),
            image_url: data.image_url
          });
        } catch (error) {
          setError('Error al cargar el producto');
        } finally {
          setLoading(false);
        }
      }
    };

    loadCategories();
    loadProduct();
  }, [id, isEditing]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'El nombre es obligatorio' : '';
      case 'price':
        return !value || parseFloat(value) <= 0 ? 'El precio debe ser mayor a 0' : '';
      case 'stock':
        return value === '' || parseInt(value) < 0 ? 'El stock debe ser mayor o igual a 0' : '';
      case 'category_id':
        return !value ? 'La categoría es obligatoria' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar el campo cuando cambia
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(product).forEach(key => {
      const error = validateField(key, product[key]);
      if (error) {
        errors[key] = error;
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError('Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      setLoading(true);
      const formattedProduct = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        category_id: parseInt(product.category_id)
      };

      if (isEditing) {
        await updateProduct(id, formattedProduct);
      } else {
        await createProduct(formattedProduct);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setError(error.response?.data?.message || error.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-blue-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>

        {error && <ErrorMessage message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                fieldErrors.name
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Precio *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className={`pl-7 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                    fieldErrors.price
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  min="0.01"
                  step="0.01"
                  required
                />
                {fieldErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                  fieldErrors.stock
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                min="0"
                required
              />
              {fieldErrors.stock && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.stock}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Categoría *
            </label>
            <select
              id="category_id"
              name="category_id"
              value={product.category_id}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                fieldErrors.category_id
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {fieldErrors.category_id && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.category_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              URL de la imagen
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={product.image_url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;