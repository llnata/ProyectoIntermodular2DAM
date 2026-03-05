// presentation/screens/CentrosSaludScreen.js
// Pantalla informativa que lista los centros de salud obtenidos desde la API de Open Data
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchCentrosSalud } from '../../domain/usecases/getCentrosSalud';

export default function CentrosSaludScreen() {
  // Lista de centros y estado de carga
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al montar la pantalla, pedimos los centros de salud a la API externa
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

  // Mientras se cargan los datos mostramos un indicador de actividad
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
      {/* Título de la pantalla */}
      <Text style={styles.titulo}>Centros de salud en València</Text>

      {/* Listado de centros en forma de tarjetas */}
      <FlatList
        data={centros}
        keyExtractor={(item, index) =>
          item.recordid ? String(item.recordid) : String(index)
        }
        renderItem={({ item }) => {
          // Cada item representa un centro: usamos nombre, dirección y barrio si existen
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
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#EFF6FF',
  },
  // Estilo del título
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1E3A8A',
  },
  // Vista de carga centrada
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tarjeta de cada centro
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  // Nombre del centro
  nombre: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1E3A8A',
  },
  // Texto secundario (dirección, barrio, mensajes varios)
  texto: {
    color: '#64748B',
  },
});
