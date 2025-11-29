const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5000/api';

export const apiService = {
  async enviarCorreo(datos) {
    const response = await fetch(`${API_URL}/enviar-correo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return response.json();
  },

  async obtenerCorreos() {
    const response = await fetch(`${API_URL}/correos-enviados`);
    return response.json();
  },

  async obtenerOpciones() {
    const response = await fetch(`${API_URL}/opciones`);
    return response.json();
  },

  async agregarOpcion(categoria, opcion) {
    const response = await fetch(`${API_URL}/opciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria, opcion }),
    });
    return response.json();
  },

  async eliminarOpcion(categoria, opcion) {
    const response = await fetch(`${API_URL}/opciones`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria, opcion }),
    });
    return response.json();
  },

  async crearEvento(datos) {
    const response = await fetch(`${API_URL}/eventos-inspecciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return response.json();
  },

  async obtenerEventos() {
    const response = await fetch(`${API_URL}/eventos-inspecciones`);
    return response.json();
  },
};

export default apiService;
