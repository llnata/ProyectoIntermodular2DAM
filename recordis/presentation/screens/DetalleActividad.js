import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAjustes } from '../context/AjustesContext';

export default function DetalleActividad({ route, navigation }) {
  const { actividad, usuarioId } = route.params;
  const { fs } = useAjustes();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      {/* Botón volver */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[styles.backTexto, { fontSize: fs(17) }]}>← Volver</Text>
      </TouchableOpacity>

      {/* Tarjeta principal */}
      <View style={styles.tarjeta}>

        {/* Estado badge */}
        <View style={[styles.badge, actividad.completada ? styles.badgeOk : styles.badgePendiente]}>
          <Text style={[styles.badgeTexto, { fontSize: fs(13) }]}>
            {actividad.completada ? '✅ Completada' : '⏳ Pendiente'}
          </Text>
        </View>

        {/* Hora */}
        <Text style={[styles.hora, { fontSize: fs(16) }]}>{actividad.hora ?? '—'}</Text>

        {/* Título */}
        <Text style={[styles.titulo, { fontSize: fs(28) }]}>{actividad.titulo}</Text>

        {/* Separador */}
        <View style={styles.separador} />

        {/* Descripción */}
        <Text style={[styles.labelCampo, { fontSize: fs(13) }]}>DESCRIPCIÓN</Text>
        <Text style={[styles.descripcion, { fontSize: fs(17) }]}>
          {actividad.descripcion?.trim() ? actividad.descripcion : 'Sin descripción'}
        </Text>

        {/* Fecha */}
        <View style={styles.fila}>
          <Text style={styles.filaEmoji}>📅</Text>
          <Text style={[styles.filaTexto, { fontSize: fs(16) }]}>{actividad.fecha ?? '—'}</Text>
        </View>

      </View>

      {/* Botón editar -> EditarActividad (pasamos COPIA del objeto) */}
      <TouchableOpacity
        style={styles.botonEditar}
        onPress={() =>
          navigation.navigate('EditarActividad', {
            actividad: { ...actividad }, // copia
            usuarioId,
          })
        }
      >
        <Text style={[styles.botonEditarTexto, { fontSize: fs(18) }]}>✏️ Editar actividad</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#EFF6FF' },
  container: { padding: 24, paddingBottom: 48 },
  backBtn: { marginTop: 52, marginBottom: 20 },
  backTexto: { color: '#3B82F6', fontWeight: '600' },
  tarjeta: { backgroundColor: '#fff', borderRadius: 24, padding: 24, elevation: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  badgeOk: { backgroundColor: '#DCFCE7' },
  badgePendiente: { backgroundColor: '#FEF9C3' },
  badgeTexto: { fontWeight: '700', color: '#1E3A8A' },
  hora: { color: '#3B82F6', fontWeight: '700', marginBottom: 6 },
  titulo: { fontWeight: 'bold', color: '#1E3A8A', marginBottom: 20 },
  separador: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 20 },
  labelCampo: { color: '#94A3B8', fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  descripcion: { color: '#475569', marginBottom: 24, lineHeight: 24 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  filaEmoji: { fontSize: 20 },
  filaTexto: { color: '#475569', fontWeight: '500' },
  botonEditar: { backgroundColor: '#3B82F6', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 24, elevation: 3 },
  botonEditarTexto: { color: '#fff', fontWeight: '700' },
});
