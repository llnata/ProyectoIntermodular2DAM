// presentation/components/TarjetaActividad.js
// Componente reutilizable para mostrar una actividad en forma de tarjeta
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TarjetaActividad({ actividad, onPress }) {
  return (
    // Contenedor pulsable: al tocar se ejecuta onPress (por ejemplo, navegar al detalle)
    <TouchableOpacity style={styles.tarjeta} onPress={onPress}>
      {/* Indicador lateral de estado (color distinto si está completada) */}
      <View
        style={[
          styles.indicador,
          actividad.completada && styles.indicadorCompletado,
        ]}
      />

      {/* Contenido principal de la tarjeta: hora, título y descripción */}
      <View style={styles.contenido}>
        <Text style={styles.hora}>{actividad.hora}</Text>
        <Text style={styles.titulo}>{actividad.titulo}</Text>
        {/* Descripción opcional: solo se muestra si existe */}
        {actividad.descripcion ? (
          <Text style={styles.descripcion}>{actividad.descripcion}</Text>
        ) : null}
      </View>

      {/* Icono de estado rápido: reloj si está pendiente, check si está completada */}
      <Text style={styles.estado}>
        {actividad.completada ? '✅' : '⏳'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilo base de la tarjeta: fondo blanco, sombra y layout en fila
  tarjeta: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  // Barra vertical a la izquierda de la tarjeta
  indicador: {
    width: 6,
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  // Color del indicador cuando la actividad está completada
  indicadorCompletado: {
    backgroundColor: '#22C55E',
  },
  // Contenedor para la hora, título y descripción
  contenido: {
    flex: 1,
  },
  // Estilo de la hora de la actividad
  hora: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '700',
    marginBottom: 4,
  },
  // Estilo del título de la actividad
  titulo: {
    fontSize: 18,
    color: '#1E3A8A',
    fontWeight: '500',
  },
  // Estilo de la descripción (texto secundario)
  descripcion: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  // Icono grande de estado al final de la tarjeta
  estado: {
    fontSize: 20,
  },
});
