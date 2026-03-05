import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchActividades } from '../../domain/usecases/getActividades';

export default function VistaDia({ route, navigation }) {
  const { usuarioId, fecha } = route.params;
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActividades(usuarioId, fecha)
      .then(lista => setActividades(lista))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#3B82F6" />;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{fecha}</Text>
      <FlatList
        data={actividades}
        keyExtractor={(item, index) => (item.id ? String(item.id) : String(index))}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tarjeta,
              item.completada && { backgroundColor: '#DCFCE7' }, // verde solo si completada
            ]}
            onPress={() =>
              navigation.navigate('DetalleActividad', {
                actividad: { ...item },
                usuarioId,
              })
            }
          >
            <Text style={styles.hora}>{item.hora}</Text>
            <Text style={styles.tituloActividad}>
              {item.esCitaSalud ? '🏥 ' : ''}{item.titulo}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.vacio}>Sin actividades</Text>}
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.volver}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#EFF6FF' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#1E3A8A', marginTop: 48, marginBottom: 20 },
  tarjeta: { backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 10, elevation: 2, flexDirection: 'row', gap: 12 },
  hora: { fontSize: 16, color: '#3B82F6', fontWeight: '700', width: 50 },
  tituloActividad: { fontSize: 18, color: '#1E3A8A' },
  vacio: { textAlign: 'center', color: '#94A3B8', fontSize: 16, marginTop: 40 },
  volver: { textAlign: 'center', color: '#64748B', fontSize: 16, marginTop: 16 },
});
