// presentation/screens/VistaSemanal.js
// Pantalla que muestra la semana actual y las actividades de cada día
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchActividades } from '../../domain/usecases/getActividades';
import { useAjustes } from '../context/AjustesContext';

// Etiquetas cortas para los días de la semana
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Convierte un objeto Date a cadena YYYY-MM-DD (zona local)
const dateToLocalISO = (date) => {
  const año = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
};

// Devuelve un array con las 7 fechas (YYYY-MM-DD) de la semana del lunes actual
const getFechasSemana = () => {
  const hoy = new Date();
  const lunes = new Date(hoy);
  // Retrocedemos hasta el lunes de esta semana
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

  // Fechas que componen la semana actual
  const fechas = getFechasSemana();

  // Día seleccionado inicialmente: el día de hoy dentro de la semana
  const [diaSeleccionado, setDiaSeleccionado] = useState(
    fechas[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  );
  // Lista de actividades del día seleccionado
  const [actividades, setActividades] = useState([]);

  // Cada vez que cambia el día seleccionado o el usuario, recargamos actividades
  useFocusEffect(
    useCallback(() => {
      fetchActividades(usuarioId, diaSeleccionado)
        .then((lista) => setActividades(lista))
        .catch(console.error);
    }, [diaSeleccionado, usuarioId])
  );

  // Cálculo de etiquetas legibles para el encabezado del día seleccionado
  const indiceDia = fechas.indexOf(diaSeleccionado);
  const etiquetaDia = DIAS[indiceDia] ?? '';
  const fechaLegible = (() => {
    const [y, m, d] = diaSeleccionado.split('-');
    return `${d}/${m}/${y}`;
  })();

  return (
    <View style={styles.container}>
      {/* Cabecera con saludo y acceso rápido al perfil */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.saludo, { fontSize: fs(24) }]}>
            Hola, {nombre} 👋
          </Text>
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

      {/* Franja que muestra el día seleccionado en grande */}
      <View style={styles.diaSeleccionadoBox}>
        <Text
          style={[
            styles.diaSeleccionadoEtiqueta,
            { fontSize: fs(18) },
          ]}
        >
          {etiquetaDia}
        </Text>
        <Text
          style={[
            styles.diaSeleccionadoFecha,
            { fontSize: fs(20) },
          ]}
        >
          {fechaLegible}
        </Text>
      </View>

      {/* Selector de días de la semana */}
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

      {/* Lista de actividades del día seleccionado */}
      <FlatList
        data={actividades}
        keyExtractor={(item, index) =>
          item.id ? String(item.id) : String(index)
        }
        style={styles.lista}
        contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.vacioBox}>
            <Text style={styles.vacioEmoji}>🌿</Text>
            <Text
              style={[styles.vacioTexto, { fontSize: fs(17) }]}
            >
              No hay actividades este día
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tarjeta,
              // Fondo verde solo si la actividad está completada
              item.completada && { backgroundColor: '#DCFCE7' },
            ]}
            onPress={() =>
              navigation.navigate('DetalleActividad', {
                actividad: { ...item },
                usuarioId,
              })
            }
          >
            {/* Hora de la actividad dentro de una pastilla azul */}
            <View style={styles.horaBox}>
              <Text style={[styles.hora, { fontSize: fs(18) }]}>
                {item.hora ?? '—'}
              </Text>
            </View>

            {/* Título y descripción de la actividad */}
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.tituloActividad,
                  { fontSize: fs(18) },
                ]}
                numberOfLines={1}
              >
                {item.esCitaSalud ? '🏥 ' : ''}
                {item.titulo}
              </Text>
              {item.descripcion?.trim() ? (
                <Text
                  style={[
                    styles.descripcionActividad,
                    { fontSize: fs(14) },
                  ]}
                  numberOfLines={1}
                >
                  {item.descripcion}
                </Text>
              ) : null}
            </View>

            {/* Flecha decorativa al final de la tarjeta */}
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón para añadir nueva actividad en el día seleccionado */}
      <TouchableOpacity
        style={styles.botonAdd}
        onPress={() =>
          navigation.navigate('CrearActividad', {
            usuarioId,
            fecha: diaSeleccionado,
          })
        }
      >
        <Text
          style={[styles.botonAddTexto, { fontSize: fs(18) }]}
        >
          + Añadir actividad
        </Text>
      </TouchableOpacity>

      {/* Botón para volver al dashboard principal */}
      <TouchableOpacity
        style={styles.botonMenu}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text
          style={[styles.botonMenuTexto, { fontSize: fs(16) }]}
        >
          ← Volver al dashboard
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Fondo general y padding de la pantalla
  container: { flex: 1, padding: 24, backgroundColor: '#EFF6FF' },

  // Cabecera con saludo y botón de perfil
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 16,
  },
  saludo: { fontWeight: 'bold', color: '#1E3A8A' },
  subtitulo: { color: '#64748B', marginTop: 4 },
  perfilBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    elevation: 3,
  },
  perfilEmoji: { fontSize: 26 },

  // Caja con el día seleccionado
  diaSeleccionadoBox: {
    backgroundColor: '#1E3A8A',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  diaSeleccionadoEtiqueta: { color: '#BFDBFE', fontWeight: '600' },
  diaSeleccionadoFecha: {
    color: '#fff',
    fontWeight: '800',
    marginTop: 2,
  },

  // Selector horizontal de días de la semana
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

  // Lista de actividades
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

  // Pastilla de hora
  horaBox: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 64,
    alignItems: 'center',
  },
  hora: { color: '#1D4ED8', fontWeight: '800' },

  // Título y descripción
  tituloActividad: { color: '#1E3A8A', fontWeight: '700' },
  descripcionActividad: { color: '#94A3B8', marginTop: 2 },

  // Flecha al final de la tarjeta
  flecha: { fontSize: 26, color: '#CBD5E1', fontWeight: 'bold' },

  // Vista vacía cuando no hay actividades
  vacioBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  vacioEmoji: { fontSize: 40, marginBottom: 8 },
  vacioTexto: { color: '#94A3B8', fontWeight: '600' },

  // Botón para añadir actividad
  botonAdd: {
    backgroundColor: '#3B82F6',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
  },
  botonAddTexto: { color: '#fff', fontWeight: '700' },

  // Botón para volver al dashboard
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
