/**
 * Modelo de Usuario
 * Representa la estructura de datos de un usuario
 */
class User {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.name = data.name || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.created_at = data.created_at || new Date().toISOString();
  }

  /**
   * Genera un ID único para el usuario
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Valida los datos del usuario
   */
  validate() {
    const errors = [];

    if (!this.name || !this.name.trim()) {
      errors.push('El nombre es obligatorio');
    }

    if (!this.email || !this.email.trim()) {
      errors.push('El correo electrónico es obligatorio');
    } else if (!/\S+@\S+\.\S+/.test(this.email)) {
      errors.push('El correo electrónico no es válido');
    }

    if (!this.password || this.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    return errors;
  }

  /**
   * Verifica si la contraseña coincide
   */
  checkPassword(password) {
    return this.password === password;
  }

  /**
   * Convierte el modelo a objeto plano (sin contraseña)
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.created_at
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON(data) {
    return new User(data);
  }
}

export default User;



