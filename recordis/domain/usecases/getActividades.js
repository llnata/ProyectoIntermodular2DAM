// domain/usecases/getActividades.js
import { getActividades } from '../../data/repositories/actividadRepository';
import { crearEntidadActividad } from '../entities/Actividad';

export const fetchActividades = async (usuarioId, fecha) => {
  const response = await getActividades(usuarioId, fecha);
  return response.data.map(crearEntidadActividad);
};
