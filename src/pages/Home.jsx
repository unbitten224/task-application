import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';
import Filters from '../components/Filters';
import TaskCard from '../components/TaskCard';
import { Loading, ErrorMessage, EmptyState } from '../components/common/LoadingStates';
import LoadingOverlay from '../components/common/LoadingOverlay';

const Home = () => {
  const { getTasks, deleteTask, updateTaskStatus } = useApp();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0
  });

  // Organizar tareas por estado
  const tasksByStatus = {
    pendiente: tasks.filter(t => t.status === 'pendiente'),
    en_progreso: tasks.filter(t => t.status === 'en_progreso'),
    completada: tasks.filter(t => t.status === 'completada')
  };

  // Referencia para cancelar operaciones previas
  const timeoutRef = React.useRef(null);

  // Aplicar debounce a los filtros
  const debouncedFilters = useDebounce(filters, 500);

  const isFirstLoad = React.useRef(true);

  useEffect(() => {
    const fetchTasks = () => {
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      try {
        // Solo mostrar loading inicial si es la primera carga
        if (isFirstLoad.current) {
          setLoading(true);
          isFirstLoad.current = false;
        } else {
          setIsSearching(true);
        }

        setError(null);
        
        // Simular pequeña demora para mejor UX
        timeoutRef.current = setTimeout(() => {
          const response = getTasks(
            {
              search: debouncedFilters.search,
              status: debouncedFilters.status,
              priority: debouncedFilters.priority
            },
            debouncedFilters.page,
            debouncedFilters.limit
          );

          setTasks(response.tasks);
          setPagination(response.pagination);
          setLoading(false);
          setIsSearching(false);
        }, 100);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError(error.message || 'Error al cargar las tareas');
        setLoading(false);
        setIsSearching(false);
      }
    };

    fetchTasks();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedFilters, getTasks]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      search: newFilters.search || '',
      status: newFilters.status || '',
      priority: newFilters.priority || '',
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleDeleteTask = (taskId) => {
    try {
      deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      setError(error.message || 'Error al eliminar la tarea');
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    try {
      updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      setError(error.message || 'Error al actualizar el estado de la tarea');
    }
  };

  if (loading && !isSearching) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  // Si hay filtros activos, mostrar todas las tareas filtradas
  const hasActiveFilters = filters.search || filters.status || filters.priority;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h1>
              <p className="mt-2 text-gray-600 max-w-2xl">
                Organiza y gestiona tus tareas diarias de manera eficiente
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/tasks/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Tarea
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <Filters onFilterChange={handleFilterChange} />
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron tareas</h3>
            <p className="mt-1 text-gray-500">Comienza agregando tareas a tu lista</p>
            <div className="mt-6">
              <Link
                to="/tasks/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Tarea
              </Link>
            </div>
          </div>
        ) : hasActiveFilters ? (
          <>
            <div className="relative">
              {isSearching && <LoadingOverlay />}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        filters.page === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, filters.page + 1))}
                    disabled={filters.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="relative">
              {isSearching && <LoadingOverlay />}
              
              {/* Sección Pendiente */}
              {tasksByStatus.pendiente.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Pendiente</h2>
                    <span className="ml-3 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {tasksByStatus.pendiente.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tasksByStatus.pendiente.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sección En Progreso */}
              {tasksByStatus.en_progreso.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">En Progreso</h2>
                    <span className="ml-3 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {tasksByStatus.en_progreso.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tasksByStatus.en_progreso.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sección Completada */}
              {tasksByStatus.completada.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Completada</h2>
                    <span className="ml-3 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {tasksByStatus.completada.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tasksByStatus.completada.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        filters.page === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, filters.page + 1))}
                    disabled={filters.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
