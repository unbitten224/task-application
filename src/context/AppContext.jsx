import React, { createContext, useContext, useState, useEffect } from 'react';
import authController from '../controllers/AuthController';
import taskController from '../controllers/TaskController';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar (si existe token)
  useEffect(() => {
    // Leer usuario actual directamente desde el store en memoria.
    // Nota: la aplicación mantiene usuarios y tareas en memoria y se perderán
    // cuando se recargue la página o se reinicie la app.
    try {
      const user = authController.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (err) {
      // no-op
    }
    setLoading(false);
  }, []);

  // Funciones de autenticación
  const login = async (credentials) => {
    try {
      const result = await authController.login(credentials);
      // Mantener solo en memoria: no usar localStorage para persistir token
      setCurrentUser(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authController.register(userData);
      // Mantener solo en memoria: no usar localStorage para persistir token
      setCurrentUser(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authController.logout();
    // No hay persistencia fuera de la memoria, solo limpiar estado
    setCurrentUser(null);
  };

  // Funciones de tareas
  const getTasks = (filters = {}, page = 1, limit = 10) => {
    return taskController.getTasks(filters, page, limit);
  };

  const getTaskById = (id) => {
    return taskController.getTaskById(id);
  };

  const createTask = (taskData) => {
    return taskController.createTask(taskData);
  };

  const updateTask = (id, updates) => {
    return taskController.updateTask(id, updates);
  };

  const deleteTask = (id) => {
    return taskController.deleteTask(id);
  };

  const completeTask = (id) => {
    return taskController.completeTask(id);
  };

  const updateTaskStatus = (id, status) => {
    return taskController.updateTaskStatus(id, status);
  };

  const getTasksByStatus = (filters = {}) => {
    return taskController.getTasksByStatus(filters);
  };

  const value = {
    // Usuario
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    
    // Autenticación
    login,
    register,
    logout,
    
    // Tareas
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    updateTaskStatus,
    getTasksByStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


