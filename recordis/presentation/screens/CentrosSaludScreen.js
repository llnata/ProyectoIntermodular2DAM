// presentation/screens/CentrosSaludScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchCentrosSalud } from '../../domain/usecases/getCentrosSalud';

export default function CentrosSaludScreen() {
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCentrosSalud()
      .then((results) => {
        console.log('PRIMER CENTRO RAW', results?.[0]);
        setCentros(results ?? []);
      })
      .catch((e) => {
        console.log('Error cargando centros', e);
        setCentros([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text>Cargando centros de salud...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Centros de salud en València</Text>

      <FlatList
        data={centros}
        keyExtractor={(item, index) =>
          item.recordid ? String(item.recordid) : String(index)
        }
        renderItem={({ item }) => {
          // item ya es el objeto con nombre, direccion, barrio, etc.
          const nombre = item.nombre || 'Centro sin nombre';
          const direccion = item.direccion || '';
          const barrio = item.barrio || '';

          return (
            <View style={styles.card}>
              <Text style={styles.nombre}>{nombre}</Text>
              {direccion ? <Text style={styles.texto}>{direccion}</Text> : null}
              {barrio ? <Text style={styles.texto}>{barrio}</Text> : null}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.texto}>No se han encontrado centros.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EFF6FF' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#1E3A8A' },
  cargando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  nombre: { fontWeight: '700', fontSize: 16, color: '#1E3A8A' },
  texto: { color: '#64748B' },
});
