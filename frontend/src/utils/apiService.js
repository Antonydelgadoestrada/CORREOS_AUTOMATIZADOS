const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5000/api';

/**
 * Procesa la respuesta HTTP y lanza error descriptivo si el status no es OK
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg = data?.error || data?.mensaje || `Error en la solicitud (${response.status}: ${response.statusText})`;
    throw new Error(errorMsg);
  }
  return data;
};

export const apiService = {
  async enviarCorreo(datos) {
    const response = await fetch(`${API_URL}/enviar-correo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return handleResponse(response);
  },

  async enviarCorreoAutomaticamente(datos) {
    const response = await fetch(`${API_URL}/enviar-correo-automatico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return handleResponse(response);
  },

  async obtenerCorreos() {
    const response = await fetch(`${API_URL}/correos-enviados`);
    return handleResponse(response);
  },

  async obtenerOpciones() {
    const response = await fetch(`${API_URL}/opciones`);
    return handleResponse(response);
  },

  async agregarOpcion(categoria, opcion) {
    const response = await fetch(`${API_URL}/opciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria, opcion }),
    });
    return handleResponse(response);
  },

  async eliminarOpcion(categoria, opcion) {
    const response = await fetch(`${API_URL}/opciones`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria, opcion }),
    });
    return handleResponse(response);
  },

  async crearEvento(datos) {
    const response = await fetch(`${API_URL}/eventos-inspecciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return handleResponse(response);
  },

  async obtenerEventos() {
    const response = await fetch(`${API_URL}/eventos-inspecciones`);
    return handleResponse(response);
  },

  async obtenerInspeccionesPorMes(anio, mes) {
    const response = await fetch(`${API_URL}/inspecciones-por-mes?anio=${anio}&mes=${mes}`);
    return handleResponse(response);
  },

  async reprogramarInspeccion(id, fecha_inicio, fecha_fin) {
    const response = await fetch(`${API_URL}/eventos-inspecciones/${id}/reprogramar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, fecha_inicio, fecha_fin }),
    });
    return handleResponse(response);
  },

  async obtenerFirma() {
    const response = await fetch(`${API_URL}/firma`);
    return handleResponse(response);
  },

  async actualizarFirma(datos) {
    const response = await fetch(`${API_URL}/firma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return handleResponse(response);
  },
};

export default apiService;
