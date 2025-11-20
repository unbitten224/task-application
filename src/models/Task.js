/**
 * Modelo de Tarea
 * Representa la estructura de datos de una tarea
 */
class Task {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'pendiente'; // pendiente, en_progreso, completada
    this.priority = data.priority || 'media'; // baja, media, alta
    this.due_date = data.due_date || null;
    this.user_id = data.user_id || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  /**
   * Genera un ID único para la tarea
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Valida los datos de la tarea
   */
  validate() {
    const errors = [];

    if (!this.title || !this.title.trim()) {
      errors.push('El título es obligatorio');
    }

    if (this.due_date) {
      const selectedDate = new Date(this.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.push('La fecha de vencimiento no puede ser anterior a hoy');
      }
    }

    if (!['pendiente', 'en_progreso', 'completada'].includes(this.status)) {
      errors.push('Estado inválido');
    }

    if (!['baja', 'media', 'alta'].includes(this.priority)) {
      errors.push('Prioridad inválida');
    }

    return errors;
  }

  /**
   * Verifica si la tarea está vencida
   */
  isOverdue() {
    if (!this.due_date || this.status === 'completada') {
      return false;
    }
    return new Date(this.due_date) < new Date();
  }

  /**
   * Marca la tarea como completada
   */
  complete() {
    this.status = 'completada';
    this.updated_at = new Date().toISOString();
    return this;
  }

  /**
   * Actualiza el estado de la tarea
   */
  updateStatus(newStatus) {
    if (['pendiente', 'en_progreso', 'completada'].includes(newStatus)) {
      this.status = newStatus;
      this.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * Convierte el modelo a objeto plano
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      due_date: this.due_date,
      user_id: this.user_id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON(data) {
    return new Task(data);
  }
}

export default Task;



