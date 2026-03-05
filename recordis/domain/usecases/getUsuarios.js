// domain/usecases/getUsuarios.js
import { getUsuarios } from '../../data/repositories/usuarioRepository';
import { crearEntidadUsuario } from '../entities/Usuario';

export const fetchUsuarios = async () => {
  const response = await getUsuarios();
  return response.data.map(crearEntidadUsuario);
};
