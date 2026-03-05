// domain/usecases/crearActividad.js
import api from '../../data/api';

export const registrarActividad = async (actividad) => {
  const { data } = await api.post('/actividades', actividad); // <-- OK
  return data;
};
