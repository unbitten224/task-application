import User from '../models/User';
import store from '../store/InMemoryStore';

/**
 * Controlador de Autenticación
 * Maneja toda la lógica de negocio relacionada con autenticación
 */
class AuthController {
  /**
   * Registra un nuevo usuario
   */
  register(userData) {
    // Verificar si el email ya existe
    const existingUser = store.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Crear instancia del modelo
    const user = new User(userData);

    // Validar
    const errors = user.validate();
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Guardar en el store (necesitamos guardar el objeto completo con password)
    // pero necesitamos convertirlo a un objeto plano primero
    const userObject = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,  // Guardamos la contraseña para poder validarla después
      created_at: user.created_at
    };
    const savedUser = store.createUser(userObject);

    // Iniciar sesión automáticamente
    store.setCurrentUser(savedUser);

    // Generar token simulado (en memoria)
    const token = this.generateToken(savedUser.id);

    // Devolver solo los datos sin contraseña
    return {
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        created_at: savedUser.created_at
      },
      token
    };
  }

  /**
   * Inicia sesión de un usuario
   */
  login(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Correo electrónico y contraseña son obligatorios');
    }

    // Buscar usuario por email
    const user = store.getUserByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const userInstance = User.fromJSON(user);
    if (!userInstance.checkPassword(password)) {
      throw new Error('Credenciales inválidas');
    }

    // Establecer usuario actual
    store.setCurrentUser(user);

    // Generar token simulado (en memoria)
    const token = this.generateToken(user.id);

    // Devolver solo los datos sin contraseña
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      },
      token
    };
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout() {
    store.logout();
    return true;
  }

  /**
   * Obtiene el usuario actual autenticado
   */
  getCurrentUser() {
    return store.getCurrentUser();
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  isAuthenticated() {
    return !!store.getCurrentUser();
  }

  /**
   * Genera un token simulado (solo para mantener compatibilidad con localStorage)
   * En una app real, esto vendría del servidor
   */
  generateToken(userId) {
    // Token simple en base64 (solo para demo, no es seguro)
    return btoa(JSON.stringify({ userId, timestamp: Date.now() }));
  }

  /**
   * Verifica un token (simulado)
   */
  verifyToken(token) {
    try {
      const decoded = JSON.parse(atob(token));
      const user = store.getUserById(decoded.userId);
      if (user) {
        store.setCurrentUser(user);
        return user;
      }
    } catch (error) {
      // Token inválido
    }
    return null;
  }
}

export default new AuthController();



