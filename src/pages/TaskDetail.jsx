import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Loading, ErrorMessage } from '../components/common/LoadingStates';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, deleteTask, completeTask, updateTaskStatus } = useApp();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadTask = () => {
      try {
        const data = getTaskById(id);
        setTask(data);
      } catch (error) {
        setError(error.message || 'Error al cargar la tarea');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, getTaskById]);

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        deleteTask(id);
        navigate('/');
      } catch (error) {
        setError(error.message || 'Error al eliminar la tarea');
      }
    }
  };

  const handleComplete = () => {
    try {
      setUpdating(true);
      completeTask(id);
      const updatedTask = getTaskById(id);
      setTask(updatedTask);
    } catch (error) {
      setError(error.message || 'Error al completar la tarea');
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    try {
      setUpdating(true);
      updateTaskStatus(id, newStatus);
      const updatedTask = getTaskById(id);
      setTask(updatedTask);
    } catch (error) {
      setError(error.message || 'Error al actualizar el estado de la tarea');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!task) return <ErrorMessage message="Tarea no encontrada" />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'en_progreso':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completada':
        return 'Completada';
      case 'en_progreso':
        return 'En Progreso';
      case 'pendiente':
      default:
        return 'Pendiente';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
      default:
        return 'Baja';
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completada';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {task.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
                {isOverdue && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Vencida
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              {task.status !== 'completada' && (
                <button
                  onClick={handleComplete}
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
                >
                  {updating ? 'Actualizando...' : 'Marcar como Completada'}
                </button>
              )}
              <button
                onClick={() => navigate(`/tasks/edit/${id}`)}
                className="px-4 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {task.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {task.description}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {task.due_date && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha de Vencimiento</h4>
                    <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(task.due_date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {isOverdue && ' (Vencida)'}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Estado</h4>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">ID</h4>
                  <p className="text-sm text-gray-900">{task.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha de creación</h4>
                  <p className="text-sm text-gray-900">
                    {new Date(task.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Volver a la lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
