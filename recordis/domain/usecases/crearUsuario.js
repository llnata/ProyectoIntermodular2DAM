// domain/usecases/crearUsuario.js
import api from '../../data/api';

export const registrarUsuario = async (
  nombre,
  edad,
  avatar,
  color,
  genero,
  frecuenciaRecordatoriosMin // nuevo
) => {
  const body = {
    nombre,
    edad,
    avatar,
    color,
    genero,
    foto: null,
    frecuenciaRecordatoriosMin,   // se manda al backend
  };

  const { data } = await api.post('/usuarios', body);
  return data;
};
