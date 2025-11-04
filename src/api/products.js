import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Obtener lista de productos con filtros y paginación
export const getProducts = async ({ search = '', categoryId = '', page = 1, limit = 10, signal } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryId) params.append('categoryId', categoryId);
    params.append('page', page);
    params.append('limit', limit);

    const { data } = await axios.get(`${API_URL}/products?${params}`, { signal });
    return data;
  } catch (error) {
    if (error.name === 'CanceledError') {
      throw error;
    }
    throw error.response?.data || { message: 'Error al obtener productos' };
  }
};

// Obtener un producto por ID
export const getProduct = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/products/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener el producto' };
  }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const { data } = await axios.post(`${API_URL}/products`, productData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear el producto' };
  }
};

// Actualizar un producto existente
export const updateProduct = async (id, productData) => {
  try {
    const { data } = await axios.put(`${API_URL}/products/${id}`, productData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar el producto' };
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/products/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar el producto' };
  }
};