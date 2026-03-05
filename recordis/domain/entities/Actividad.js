// domain/entities/Actividad.js
export const crearEntidadActividad = (raw) => ({
  id: raw.id ?? raw._id ?? raw.idActividad,

  titulo: raw.titulo,
  descripcion: raw.descripcion ?? '',
  hora: raw.hora,
  completada: raw.completada ?? false,
  usuarioId: raw.usuarioId,
  fecha: raw.fecha,

  esCitaSalud: raw.esCitaSalud ?? false,
});
