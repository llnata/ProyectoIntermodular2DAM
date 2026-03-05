// presentation/components/TarjetaActividad.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TarjetaActividad({ actividad, onPress }) {
  return (
    <TouchableOpacity style={styles.tarjeta} onPress={onPress}>
      <View style={[styles.indicador, actividad.completada && styles.indicadorCompletado]} />
      <View style={styles.contenido}>
        <Text style={styles.hora}>{actividad.hora}</Text>
        <Text style={styles.titulo}>{actividad.titulo}</Text>
        {actividad.descripcion ? <Text style={styles.descripcion}>{actividad.descripcion}</Text> : null}
      </View>
      <Text style={styles.estado}>{actividad.completada ? '✅' : '⏳'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 10, elevation: 2, flexDirection: 'row', alignItems: 'center', gap: 12 },
  indicador: { width: 6, height: '100%', borderRadius: 3, backgroundColor: '#94A3B8' },
  indicadorCompletado: { backgroundColor: '#22C55E' },
  contenido: { flex: 1 },
  hora: { fontSize: 14, color: '#3B82F6', fontWeight: '700', marginBottom: 4 },
  titulo: { fontSize: 18, color: '#1E3A8A', fontWeight: '500' },
  descripcion: { fontSize: 14, color: '#64748B', marginTop: 2 },
  estado: { fontSize: 20 },
});
