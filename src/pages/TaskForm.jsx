import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Loading, ErrorMessage } from '../components/common/LoadingStates';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { createTask, getTaskById, updateTask } = useApp();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [task, setTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'media',
    status: 'pendiente'
  });

  useEffect(() => {
    const loadTask = () => {
      if (isEditing) {
        try {
          setLoading(true);
          const data = getTaskById(id);
          setTask({
            title: data.title,
            description: data.description || '',
            due_date: data.due_date ? data.due_date.split('T')[0] : '',
            priority: data.priority || 'media',
            status: data.status || 'pendiente'
          });
        } catch (error) {
          setError('Error al cargar la tarea');
        } finally {
          setLoading(false);
        }
      }
    };

    loadTask();
  }, [id, isEditing, getTaskById]);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return !value.trim() ? 'El título es obligatorio' : '';
      case 'due_date':
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            return 'La fecha de vencimiento no puede ser anterior a hoy';
          }
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({
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
    Object.keys(task).forEach(key => {
      const error = validateField(key, task[key]);
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
      const formattedTask = {
        ...task,
        title: task.title.trim(),
        description: task.description.trim(),
        due_date: task.due_date || null
      };

      if (isEditing) {
        updateTask(id, formattedTask);
      } else {
        createTask(formattedTask);
      }

      navigate('/');
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
      setError(error.message || 'Error al guardar la tarea');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !task.title) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-blue-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
          </h1>

          {error && <ErrorMessage message={error} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={task.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                  fieldErrors.title
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              {fieldErrors.title && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={task.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe los detalles de la tarea..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={task.due_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                    fieldErrors.due_date
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {fieldErrors.due_date && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.due_date}</p>
                )}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Prioridad *
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            {isEditing && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Estado *
                </label>
                <select
                  id="status"
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
              </div>
            )}

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

export default TaskForm;
