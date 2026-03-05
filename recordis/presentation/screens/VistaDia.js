// presentation/screens/VistaDia.js
// Pantalla que muestra todas las actividades de un día concreto para un usuario
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { fetchActividades } from '../../domain/usecases/getActividades';

export default function VistaDia({ route, navigation }) {
  // Recibimos usuarioId y fecha desde la navegación
  const { usuarioId, fecha } = route.params;

  // Lista de actividades del día y estado de carga
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Al montar la pantalla, pedimos las actividades del día a la API
  useEffect(() => {
    fetchActividades(usuarioId, fecha)
      .then((lista) => setActividades(lista))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Mientras se cargan las actividades mostramos un spinner
  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color="#3B82F6"
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Título con la fecha seleccionada */}
      <Text style={styles.titulo}>{fecha}</Text>

      {/* Lista de actividades del día */}
      <FlatList
        data={actividades}
        keyExtractor={(item, index) =>
          item.id ? String(item.id) : String(index)
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tarjeta,
              // Si la actividad está completada, la pintamos en verde claro
              item.completada && { backgroundColor: '#DCFCE7' },
            ]}
            onPress={() =>
              navigation.navigate('DetalleActividad', {
                actividad: { ...item },
                usuarioId,
              })
            }
          >
            {/* Hora de la actividad */}
            <Text style={styles.hora}>{item.hora}</Text>

            {/* Título (con icono de hospital si es cita de salud) */}
            <Text style={styles.tituloActividad}>
              {item.esCitaSalud ? '🏥 ' : ''}
              {item.titulo}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>Sin actividades</Text>
        }
      />

      {/* Botón para volver a la pantalla anterior */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.volver}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor general con fondo azul claro
  container: { flex: 1, padding: 24, backgroundColor: '#EFF6FF' },

  // Título con la fecha
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginTop: 48,
    marginBottom: 20,
  },

  // Tarjeta para cada actividad
  tarjeta: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    gap: 12,
  },

  // Estilo de la hora
  hora: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '700',
    width: 50,
  },

  // Estilo del título de la actividad
  tituloActividad: { fontSize: 18, color: '#1E3A8A' },

  // Mensaje cuando no hay actividades
  vacio: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 40,
  },

  // Texto del botón de volver
  volver: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    marginTop: 16,
  },
});
