const API_URL = 'http://localhost:5000/api';

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
    const response = await fetch(`${API_URL}/correos`);
    return response.json();
  },

  async obtenerCorreosPorProductor(productor) {
    const response = await fetch(`${API_URL}/correos/${productor}`);
    return response.json();
  },
};

export default apiService;
