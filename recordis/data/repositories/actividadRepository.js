// data/repositories/actividadRepository.js
import api from '../api';

export const getActividades = (usuarioId, fecha) =>
  api.get(`/actividades?usuarioId=${usuarioId}&fecha=${fecha}`);
export const crearActividad = (datos) => api.post('/actividades', datos);
export const eliminarActividad = (id) => api.delete(`/actividades/${id}`);
export const actualizarActividad = (id, datos) => api.put(`/actividades/${id}`, datos);
