import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchActividades } from '../../domain/usecases/getActividades';
import { useAjustes } from '../context/AjustesContext';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Fecha local en formato YYYY-MM-DD
const dateToLocalISO = (date) => {
  const año = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
};

const getFechasSemana = () => {
  const hoy = new Date();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return dateToLocalISO(d);
  });
};

export default function VistaSemanal({ route, navigation }) {
  const { usuarioId, nombre } = route.params;
  const { fs } = useAjustes();

  const fechas = getFechasSemana();
  const [diaSeleccionado, setDiaSeleccionado] = useState(
    fechas[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  );
  const [actividades, setActividades] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchActividades(usuarioId, diaSeleccionado)
        .then(lista => setActividades(lista))
        .catch(console.error);
    }, [diaSeleccionado, usuarioId])
  );

  const indiceDia = fechas.indexOf(diaSeleccionado);
  const etiquetaDia = DIAS[indiceDia] ?? '';
  const fechaLegible = (() => {
    const [y, m, d] = diaSeleccionado.split('-');
    return `${d}/${m}/${y}`;
  })();

  return (
    <View style={styles.container}>

      {/* Cabecera superior */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.saludo, { fontSize: fs(24) }]}>Hola, {nombre} 👋</Text>
          <Text style={[styles.subtitulo, { fontSize: fs(16) }]}>
            Esta es tu semana de actividades
          </Text>
        </View>
        <TouchableOpacity
          style={styles.perfilBtn}
          onPress={() => navigation.navigate('PerfilUsuario')}
        >
          <Text style={styles.perfilEmoji}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Franja día seleccionado */}
      <View style={styles.diaSeleccionadoBox}>
        <Text style={[styles.diaSeleccionadoEtiqueta, { fontSize: fs(18) }]}>{etiquetaDia}</Text>
        <Text style={[styles.diaSeleccionadoFecha, { fontSize: fs(20) }]}>{fechaLegible}</Text>
      </View>

      {/* Selector de días */}
      <View style={styles.semana}>
        {fechas.map((fecha, i) => {
          const activo = diaSeleccionado === fecha;
          return (
            <TouchableOpacity
              key={fecha}
              style={[styles.dia, activo && styles.diaActivo]}
              onPress={() => setDiaSeleccionado(fecha)}
            >
              <Text
                style={[
                  styles.diaTexto,
                  { fontSize: fs(14) },
                  activo && styles.diaTextoActivo,
                ]}
              >
                {DIAS[i]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista de actividades */}
      <FlatList
        data={actividades}
        keyExtractor={(item, index) => (item.id ? String(item.id) : String(index))}
        style={styles.lista}
        contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.vacioBox}>
            <Text style={styles.vacioEmoji}>🌿</Text>
            <Text style={[styles.vacioTexto, { fontSize: fs(17) }]}>
              No hay actividades este día
            </Text>
          </View>
        }
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
            <View style={styles.horaBox}>
              <Text style={[styles.hora, { fontSize: fs(18) }]}>
                {item.hora ?? '—'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tituloActividad, { fontSize: fs(18) }]} numberOfLines={1}>
                {item.esCitaSalud ? '🏥 ' : ''}{item.titulo}
              </Text>
              {item.descripcion?.trim() ? (
                <Text
                  style={[styles.descripcionActividad, { fontSize: fs(14) }]}
                  numberOfLines={1}
                >
                  {item.descripcion}
                </Text>
              ) : null}
            </View>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón añadir */}
      <TouchableOpacity
        style={styles.botonAdd}
        onPress={() =>
          navigation.navigate('CrearActividad', { usuarioId, fecha: diaSeleccionado })
        }
      >
        <Text style={[styles.botonAddTexto, { fontSize: fs(18) }]}>+ Añadir actividad</Text>
      </TouchableOpacity>

      {/* Botón volver al dashboard */}
      <TouchableOpacity
        style={styles.botonMenu}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={[styles.botonMenuTexto, { fontSize: fs(16) }]}>
          ← Volver al dashboard
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#EFF6FF' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 16,
  },
  saludo: { fontWeight: 'bold', color: '#1E3A8A' },
  subtitulo: { color: '#64748B', marginTop: 4 },
  perfilBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 50, elevation: 3 },
  perfilEmoji: { fontSize: 26 },

  diaSeleccionadoBox: {
    backgroundColor: '#1E3A8A',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  diaSeleccionadoEtiqueta: { color: '#BFDBFE', fontWeight: '600' },
  diaSeleccionadoFecha: { color: '#fff', fontWeight: '800', marginTop: 2 },

  semana: {
    flexDirection: 'row',
    justifyContent: 'space_between',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    elevation: 2,
  },
  dia: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  diaActivo: { backgroundColor: '#3B82F6' },
  diaTexto: { color: '#64748B', fontWeight: '700' },
  diaTextoActivo: { color: '#fff' },

  lista: { flex: 1, marginTop: 4 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 2,
  },
  horaBox: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 64,
    alignItems: 'center',
  },
  hora: { color: '#1D4ED8', fontWeight: '800' },
  tituloActividad: { color: '#1E3A8A', fontWeight: '700' },
  descripcionActividad: { color: '#94A3B8', marginTop: 2 },
  flecha: { fontSize: 26, color: '#CBD5E1', fontWeight: 'bold' },

  vacioBox: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  vacioEmoji: { fontSize: 40, marginBottom: 8 },
  vacioTexto: { color: '#94A3B8', fontWeight: '600' },

  botonAdd: {
    backgroundColor: '#3B82F6',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
  },
  botonAddTexto: { color: '#fff', fontWeight: '700' },

  botonMenu: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonMenuTexto: {
    color: '#64748B',
    fontWeight: '600',
  },
});
