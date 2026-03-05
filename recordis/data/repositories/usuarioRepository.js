// data/repositories/usuarioRepository.js
import api from '../api';

export const getUsuarios = () => api.get('/usuarios');
export const crearUsuario = (datos) => api.post('/usuarios', datos);
export const eliminarUsuario = (id) => api.delete(`/usuarios/${id}`);
