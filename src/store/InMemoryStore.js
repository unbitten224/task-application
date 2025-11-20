/**
 * Store en memoria para almacenar datos
 * Los datos se pierden al recargar la página
 */
class InMemoryStore {
  constructor() {
    this.tasks = [];
    this.users = [];
    this.currentUser = null;
  }

  // ==================== TAREAS ====================

  /**
   * Obtiene todas las tareas
   */
  getAllTasks(userId = null) {
    if (userId) {
      return this.tasks.filter(task => task.user_id === userId);
    }
    return [...this.tasks];
  }

  /**
   * Obtiene una tarea por ID
   */
  getTaskById(id) {
    return this.tasks.find(task => task.id === id) || null;
  }

  /**
   * Crea una nueva tarea
   */
  createTask(taskData) {
    const task = { ...taskData };
    this.tasks.push(task);
    return task;
  }

  /**
   * Actualiza una tarea existente
   */
  updateTask(id, updates) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      return this.tasks[index];
    }
    return null;
  }

  /**
   * Elimina una tarea
   */
  deleteTask(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      return this.tasks.splice(index, 1)[0];
    }
    return null;
  }

  /**
   * Filtra tareas según criterios
   */
  filterTasks(filters, userId = null) {
    let filtered = this.getAllTasks(userId);

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    return filtered;
  }

  /**
   * Pagina los resultados
   */
  paginate(items, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = items.slice(start, end);
    
    return {
      items: paginatedItems,
      pagination: {
        total: items.length,
        totalPages: Math.ceil(items.length / limit),
        currentPage: page,
        limit
      }
    };
  }

  // ==================== USUARIOS ====================

  /**
   * Obtiene todos los usuarios
   */
  getAllUsers() {
    return [...this.users];
  }

  /**
   * Obtiene un usuario por ID
   */
  getUserById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  /**
   * Obtiene un usuario por email
   */
  getUserByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  /**
   * Crea un nuevo usuario
   */
  createUser(userData) {
    const user = { ...userData };
    this.users.push(user);
    return user;
  }

  /**
   * Establece el usuario actual
   */
  setCurrentUser(user) {
    this.currentUser = user;
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout() {
    this.currentUser = null;
  }

  /**
   * Limpia todos los datos (útil para testing)
   */
  clear() {
    this.tasks = [];
    this.users = [];
    this.currentUser = null;
  }
}

// Exportar una instancia única (singleton)
export default new InMemoryStore();



