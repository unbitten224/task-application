import Task from '../models/Task';
import store from '../store/InMemoryStore';

/**
 * Controlador de Tareas
 * Maneja toda la lógica de negocio relacionada con tareas
 */
class TaskController {
  /**
   * Obtiene todas las tareas con filtros y paginación
   */
  getTasks(filters = {}, page = 1, limit = 10) {
    const currentUser = store.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    // Filtrar tareas
    let tasks = store.filterTasks(filters, currentUser.id);

    // Paginar resultados
    const paginated = store.paginate(tasks, page, limit);

    return {
      tasks: paginated.items,
      pagination: paginated.pagination
    };
  }

  /**
   * Obtiene una tarea por ID
   */
  getTaskById(id) {
    const currentUser = store.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const task = store.getTaskById(id);

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    // Verificar que la tarea pertenece al usuario actual
    if (task.user_id !== currentUser.id) {
      throw new Error('No tienes permiso para acceder a esta tarea');
    }

    return task;
  }

  /**
   * Crea una nueva tarea
   */
  createTask(taskData) {
    const currentUser = store.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    // Crear instancia del modelo
    const task = new Task({
      ...taskData,
      user_id: currentUser.id
    });

    // Validar
    const errors = task.validate();
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Guardar en el store
    const savedTask = store.createTask(task.toJSON());
    
    return savedTask;
  }

  /**
   * Actualiza una tarea existente
   */
  updateTask(id, updates) {
    const currentUser = store.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    // Verificar que la tarea existe y pertenece al usuario
    const existingTask = store.getTaskById(id);
    if (!existingTask) {
      throw new Error('Tarea no encontrada');
    }

    if (existingTask.user_id !== currentUser.id) {
      throw new Error('No tienes permiso para editar esta tarea');
    }

    // Crear instancia del modelo con los datos actualizados
    const task = new Task({
      ...existingTask,
      ...updates
    });

    // Validar
    const errors = task.validate();
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Actualizar en el store
    const updatedTask = store.updateTask(id, updates);
    
    return updatedTask;
  }

  /**
   * Elimina una tarea
   */
  deleteTask(id) {
    const currentUser = store.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    // Verificar que la tarea existe y pertenece al usuario
    const task = store.getTaskById(id);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    if (task.user_id !== currentUser.id) {
      throw new Error('No tienes permiso para eliminar esta tarea');
    }

    // Eliminar del store
    store.deleteTask(id);
    
    return true;
  }

  /**
   * Marca una tarea como completada
   */
  completeTask(id) {
    return this.updateTask(id, { status: 'completada' });
  }

  /**
   * Actualiza el estado de una tarea
   */
  updateTaskStatus(id, status) {
    const validStatuses = ['pendiente', 'en_progreso', 'completada'];
    if (!validStatuses.includes(status)) {
      throw new Error('Estado inválido');
    }

    return this.updateTask(id, { status });
  }

  /**
   * Obtiene tareas organizadas por estado
   */
  getTasksByStatus(filters = {}) {
    const currentUser = store.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    let tasks = store.filterTasks(filters, currentUser.id);

    return {
      pendiente: tasks.filter(t => t.status === 'pendiente'),
      en_progreso: tasks.filter(t => t.status === 'en_progreso'),
      completada: tasks.filter(t => t.status === 'completada')
    };
  }
}

export default new TaskController();



