import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Agregar interceptor para debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

// Obtener todas las categorías
export const getCategories = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/categories`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener categorías' };
  }
};

// Crear una nueva categoría
export const createCategory = async (categoryData) => {
  try {
    const { data } = await axios.post(`${API_URL}/categories`, categoryData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear la categoría' };
  }
};

// Actualizar una categoría existente
export const updateCategory = async (id, categoryData) => {
  try {
    const { data } = await axios.put(`${API_URL}/categories/${id}`, categoryData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar la categoría' };
  }
};

// Eliminar una categoría
export const deleteCategory = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/categories/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar la categoría' };
  }
};