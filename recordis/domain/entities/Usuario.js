// domain/entities/Usuario.js
export const crearEntidadUsuario = (raw) => ({
  id: raw.id ?? raw._id,
  nombre: raw.nombre,
  edad: raw.edad,
  avatar: raw.avatar ?? '👤',
  color: raw.color ?? '#3B82F6',
  genero: raw.genero ?? 'Hombre',
});
