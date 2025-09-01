import { useState, useEffect } from 'react';
import './App.css';

// Google Fonts para un look moderno y llamativo
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Poppins:wght@400;600;700&display=swap';
document.head.appendChild(fontLink);

function App() {
  // Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState(0);

  // Estado para la lista de empleados
  const [registros, setRegistros] = useState([]);

  // Estado para saber si estamos editando
  const [editIndex, setEditIndex] = useState(null);

  // Cargar empleados al iniciar
  useEffect(() => {
    cargarEmpleados();
  }, []);

  // Función para cargar empleados desde el backend
  const cargarEmpleados = async () => {
    try {
      const response = await fetch('http://localhost:3001/empleados');
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      alert('Error al cargar los empleados');
    }
  };

  // Función para guardar o actualizar empleado
  const registrarDatos = async (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Actualizar empleado existente
      try {
        const empleado = registros[editIndex];
        const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, edad, pais, cargo, anios })
        });

        if (response.ok) {
          const nuevosRegistros = [...registros];
          nuevosRegistros[editIndex] = { ...empleado, nombre, edad, pais, cargo, anios };
          setRegistros(nuevosRegistros);
          setEditIndex(null);
          alert('Empleado actualizado correctamente');
        } else {
          alert('Error al actualizar el empleado');
        }
      } catch (error) {
        alert('Error de conexión al actualizar');
      }
    } else {
      // Crear nuevo empleado
      try {
        const response = await fetch('http://localhost:3001/empleados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, edad, pais, cargo, anios })
        });
        const data = await response.json();
        if (response.ok) {
          setRegistros([...registros, data]);
          alert('Empleado guardado correctamente');
        } else {
          alert('Error al guardar el empleado');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }

    // Limpiar formulario
    setNombre("");
    setEdad(0);
    setPais("");
    setCargo("");
    setAnios(0);
  };

  //funcion que se ejecuta cuando el usuario hace clic en el boton eliminar
  const eliminarRegistro = async (idx) => {
    const empleado = registros[idx]; // obtenemos el empleado al eliminar por el indice
    try {
      const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
        method: 'DELETE' //metodo http para eliminar
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));//quitamos el elemento con ese indice
        if (editIndex === idx) {
          setEditIndex(null);
          setNombre("");
          setEdad(0);
          setPais("");
          setCargo("");
          setAnios(0);
        }
        alert('empleado eliminado correctamente');
      } else {
        alert('error al eliminar el empleado');
      }
    } catch (error) {
      alert('error al de conexion al eliminar');

    }

  };


  //funcion que se ejecuta cuando se quiere editar un registro
  const editarRegistro = (idx) => {
    const reg = registros[idx]; //obtenemos el empleado por el indice
    setNombre(reg.nombre);
    setEdad(reg.edad);
    setPais(reg.pais);
    setCargo(reg.cargo);
    setAnios(reg.anios);
    setEditIndex(idx);

  };

  // Aquí empieza la parte visual que ve el usuario
  return (
    <div className="App">
      {/* Header llamativo */}
      <header style={{
        width: '100%',
        padding: '48px 0 24px 0',
        textAlign: 'center',
        background: 'none',
        zIndex: 3,
        position: 'relative',
      }}>
        <h1 style={{
          fontFamily: 'Montserrat, Poppins, Arial, sans-serif',
          fontWeight: 900,
          fontSize: '3.2rem',
          color: 'var(--primary-2)',
          letterSpacing: '3px',
          textShadow: '0 6px 32px #00c6fb55, 0 1px 2px #23283b',
          margin: 0,
          textTransform: 'uppercase',
        }}>
          <span style={{color: 'var(--accent)'}}>Gestión</span> de Empleados
        </h1>
        <p style={{
          color: 'var(--muted)',
          fontFamily: 'Poppins, Arial, sans-serif',
          fontWeight: 600,
          fontSize: '1.25rem',
          marginTop: 12,
          letterSpacing: '1px',
        }}>
          Registra, edita y elimina empleados con una experiencia visual única
        </p>
      </header>

      {/* Formulario centrado y visualmente destacado */}
      <div className="form-modern" style={{boxShadow: '0 16px 48px #6c63ff33, 0 2px 8px #ff61a633'}}>
        <h2 className="form-title">
          {editIndex !== null ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
        </h2>
        <div className="form-fields" style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 18}}>
          <input
            className="form-input"
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />
          <input
            className="form-input"
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(Number(e.target.value))}
            min={0}
          />
          <input
            className="form-input"
            type="text"
            placeholder="País"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          />
          <input
            className="form-input"
            type="text"
            placeholder="Cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
          <input
            className="form-input"
            type="number"
            placeholder="Años de experiencia"
            value={anios}
            onChange={(e) => setAnios(Number(e.target.value))}
            min={0}
          />
        </div>
        <button className="form-btn" onClick={registrarDatos} style={{marginTop: 24, fontSize: '1.25rem'}}>
          {editIndex !== null ? 'Actualizar' : 'Registrar'}
        </button>
      </div>

      {/* Tabla visualmente impactante */}
      {registros.length > 0 && (
        <div className="tabla-formal-container" style={{boxShadow: '0 16px 48px #00c6fb33, 0 2px 8px #ff61a633'}}>
          <table className="tabla-formal" style={{width: '100%', borderCollapse: 'separate', borderSpacing: 0}}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>País</th>
                <th>Cargo</th>
                <th>Años</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((reg, idx) => (
                <tr key={idx} style={{transition: 'box-shadow 0.3s', boxShadow: '0 2px 12px #6c63ff11'}}>
                  <td className="cell-id">{idx + 1}</td>
                  <td className="cell-nombre">{reg.nombre}</td>
                  <td className="cell-edad">{reg.edad}</td>
                  <td className="cell-pais">{reg.pais}</td>
                  <td className="cell-cargo">{reg.cargo}</td>
                  <td className="cell-anios">{reg.anios}</td>
                  <td className="cell-acciones">
                    <button
                      className="btn-formal-editar"
                      onClick={() => editarRegistro(idx)}
                      style={{marginRight: 8}}
                    >
                      <span role="img" aria-label="Editar">✏️</span> Editar
                    </button>
                    <button
                      className="btn-formal-eliminar"
                      onClick={() => eliminarRegistro(idx)}
                    >
                      <span role="img" aria-label="Eliminar">🗑️</span> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Animación decorativa de fondo */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        background: 'radial-gradient(circle at 80% 10%, #6c63ff33 0%, transparent 60%), radial-gradient(circle at 10% 90%, #ff61a633 0%, transparent 60%)',
        animation: 'fadeInApp 1.5s',
      }} />
    </div>
  );
}

export default App;