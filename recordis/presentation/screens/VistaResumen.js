// presentation/screens/VistaResumen.js
// Pantalla de resumen mensual: muestra calendario y listado de actividades por día
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAjustes } from '../context/AjustesContext';
import api from '../../data/api';

// Nombres de meses y cabecera de días de la semana
const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Calcula el offset (día de la semana del 1) y el número de días de un mes
const getDiasDelMes = (anyo, mes) => {
  const primerDia = new Date(anyo, mes, 1).getDay(); // 0=Domingo
  const offset = (primerDia + 6) % 7;                // convertimos a 0=Lunes
  const totalDias = new Date(anyo, mes + 1, 0).getDate();
  return { offset, totalDias };
};

// Formatea una fecha como YYYY-MM-DD
const formatFecha = (anyo, mes, dia) => {
  const m = String(mes + 1).padStart(2, '0');
  const d = String(dia).padStart(2, '0');
  return `${anyo}-${m}-${d}`;
};

export default function VistaResumen({ route, navigation }) {
  const { usuarioId } = route.params;
  const { fs } = useAjustes();

  // Estado del mes y año seleccionados
  const hoy = new Date();
  const [anyo, setAnyo] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth());

  // Mapa fecha -> lista de actividades
  const [actividadesPorDia, setActividadesPorDia] = useState({});
  // Estado del modal con las actividades de un día concreto
  const [modalVisible, setModalVisible] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [actividadesDia, setActividadesDia] = useState([]);

  // Cargar datos cada vez que cambien mes o año
  useFocusEffect(
    useCallback(() => {
      cargarMes();
    }, [mes, anyo])
  );

  // Carga todas las actividades del usuario y filtra las del mes actual
  const cargarMes = async () => {
    try {
      const { data } = await api.get(`/actividades?usuarioId=${usuarioId}`);
      const mesStr = String(mes + 1).padStart(2, '0');
      const filtradas = data.filter((a) =>
        a.fecha?.startsWith(`${anyo}-${mesStr}`)
      );

      const mapa = {};
      filtradas.forEach((a) => {
        if (!mapa[a.fecha]) mapa[a.fecha] = [];
        mapa[a.fecha].push(a);
      });
      setActividadesPorDia(mapa);
    } catch (e) {
      console.error(e);
    }
  };

  // Cuando se pulsa un día del calendario
  const handleDia = (dia) => {
    const fecha = formatFecha(anyo, mes, dia);
    const acts = actividadesPorDia[fecha] ?? [];
    setDiaSeleccionado(fecha);
    setActividadesDia(acts);
    setModalVisible(true);
  };

  // Navegar al mes anterior
  const anteriorMes = () => {
    if (mes === 0) {
      setMes(11);
      setAnyo(anyo - 1);
    } else {
      setMes(mes - 1);
    }
  };

  // Navegar al mes siguiente
  const siguienteMes = () => {
    if (mes === 11) {
      setMes(0);
      setAnyo(anyo + 1);
    } else {
      setMes(mes + 1);
    }
  };

  // Cálculos de resumen
  const totalActividades = Object.values(actividadesPorDia).flat().length;
  const diasConActividad = Object.keys(actividadesPorDia).length;

  // Celdas del calendario
  const { offset, totalDias } = getDiasDelMes(anyo, mes);
  const celdas = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];
  const hoyStr = formatFecha(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Botón volver */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Text style={[styles.backTexto, { fontSize: fs(18) }]}>← Volver</Text>
      </TouchableOpacity>

      {/* Título principal */}
      <Text style={[styles.tituloPagina, { fontSize: fs(28) }]}>
        📅 Resumen del mes
      </Text>

      {/* Navegación de mes/año */}
      <View style={styles.navMes}>
        <TouchableOpacity style={styles.navBtn} onPress={anteriorMes}>
          <Text style={styles.navBtnTexto}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.mesTitulo, { fontSize: fs(22) }]}>
          {MESES[mes]} {anyo}
        </Text>
        <TouchableOpacity style={styles.navBtn} onPress={siguienteMes}>
          <Text style={styles.navBtnTexto}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Tarjetas de resumen rápido */}
      <View style={styles.resumenRow}>
        <View style={[styles.resumenCard, { backgroundColor: '#DBEAFE' }]}>
          <Text style={[styles.resumenNum, { fontSize: fs(32) }]}>
            {totalActividades}
          </Text>
          <Text style={[styles.resumenLabel, { fontSize: fs(14) }]}>
            Actividades
          </Text>
        </View>
        <View style={[styles.resumenCard, { backgroundColor: '#DCFCE7' }]}>
          <Text style={[styles.resumenNum, { fontSize: fs(32) }]}>
            {diasConActividad}
          </Text>
          <Text style={[styles.resumenLabel, { fontSize: fs(14) }]}>
            Días activos
          </Text>
        </View>
      </View>

      {/* Cabecera de días de la semana */}
      <View style={styles.semanaHeader}>
        {DIAS_SEMANA.map((d) => (
          <Text
            key={d}
            style={[styles.diaSemanaTexto, { fontSize: fs(15) }]}
          >
            {d}
          </Text>
        ))}
      </View>

      {/* Calendario mensual */}
      <View style={styles.grid}>
        {celdas.map((dia, i) => {
          if (!dia) return <View key={`v-${i}`} style={styles.celda} />;

          const fecha = formatFecha(anyo, mes, dia);
          const actividades = actividadesPorDia[fecha] ?? [];
          const tieneActividades = actividades.length > 0;
          const esHoy = fecha === hoyStr;

          return (
            <TouchableOpacity
              key={fecha}
              style={[
                styles.celda,
                esHoy && styles.celdaHoy,
                tieneActividades && !esHoy && styles.celdaConActividad,
              ]}
              onPress={() => handleDia(dia)}
            >
              <Text
                style={[
                  styles.celdaTexto,
                  { fontSize: fs(16) },
                  esHoy && styles.celdaHoyTexto,
                  tieneActividades &&
                    !esHoy &&
                    styles.celdaConActividadTexto,
                ]}
              >
                {dia}
              </Text>
              {tieneActividades && (
                <View
                  style={[
                    styles.punto,
                    esHoy && { backgroundColor: '#fff' },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Leyenda de colores del calendario */}
      <View style={styles.leyenda}>
        <View style={styles.leyendaItem}>
          <View
            style={[
              styles.leyendaMuestra,
              {
                backgroundColor: '#DBEAFE',
                borderWidth: 2,
                borderColor: '#3B82F6',
              },
            ]}
          />
          <Text style={[styles.leyendaTexto, { fontSize: fs(14) }]}>
            Con actividades
          </Text>
        </View>
        <View style={styles.leyendaItem}>
          <View
            style={[styles.leyendaMuestra, { backgroundColor: '#1E3A8A' }]}
          />
          <Text style={[styles.leyendaTexto, { fontSize: fs(14) }]}>
            Hoy
          </Text>
        </View>
      </View>

      {/* Modal con actividades de un día concreto */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Cabecera del modal */}
            <Text style={[styles.modalTitulo, { fontSize: fs(20) }]}>
              📅 {diaSeleccionado}
            </Text>
            <Text style={[styles.modalSubtitulo, { fontSize: fs(15) }]}>
              {actividadesDia.length === 0
                ? 'No hay actividades este día'
                : `${actividadesDia.length} actividad${
                    actividadesDia.length > 1 ? 'es' : ''
                  }`}
            </Text>

            {/* Contenido del modal: lista o mensaje vacío */}
            {actividadesDia.length === 0 ? (
              <View style={styles.vacioCont}>
                <Text style={styles.vacioEmoji}>🌿</Text>
                <Text
                  style={[styles.vacioTexto, { fontSize: fs(16) }]}
                >
                  Día sin actividades
                </Text>
              </View>
            ) : (
              <FlatList
                data={actividadesDia}
                keyExtractor={(item, index) =>
                  item.id?.toString() ?? index.toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.actividadItem,
                      item.completada && { backgroundColor: '#DCFCE7' },
                    ]}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate('DetalleActividad', {
                        actividad: { ...item },
                        usuarioId,
                      });
                    }}
                  >
                    <View style={styles.actividadHoraCont}>
                      <Text
                        style={[
                          styles.actividadHora,
                          { fontSize: fs(15) },
                        ]}
                      >
                        {item.hora ?? '—'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.actividadTitulo,
                          { fontSize: fs(17) },
                        ]}
                      >
                        {item.esCitaSalud ? '🏥 ' : ''}
                        {item.titulo}
                      </Text>
                      {item.descripcion?.trim() ? (
                        <Text
                          style={[
                            styles.actividadDesc,
                            { fontSize: fs(14) },
                          ]}
                          numberOfLines={1}
                        >
                          {item.descripcion}
                        </Text>
                      ) : null}
                    </View>
                    <Text style={styles.actividadArrow}>›</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* Botón cerrar modal */}
            <TouchableOpacity
              style={styles.modalCerrar}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={[styles.modalCerrarTexto, { fontSize: fs(17) }]}
              >
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Estilos generales de la pantalla
  scroll: { backgroundColor: '#EFF6FF' },
  container: { padding: 24, paddingBottom: 48 },
  backBtn: { marginTop: 52, marginBottom: 8 },
  backTexto: { color: '#3B82F6', fontWeight: '600' },
  tituloPagina: { fontWeight: 'bold', color: '#1E3A8A', marginBottom: 20 },

  // Navegación de meses
  navMes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    elevation: 3,
  },
  navBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnTexto: {
    fontSize: 36,
    color: '#3B82F6',
    fontWeight: 'bold',
    lineHeight: 42,
  },
  mesTitulo: { fontWeight: 'bold', color: '#1E3A8A' },

  // Resumen rápido (actividades y días activos)
  resumenRow: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  resumenCard: {
    flex: 1,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    elevation: 2,
  },
  resumenNum: { fontWeight: 'bold', color: '#1E3A8A' },
  resumenLabel: { color: '#475569', fontWeight: '600', marginTop: 4 },

  // Cabecera de días de la semana
  semanaHeader: { flexDirection: 'row', marginBottom: 6 },
  diaSemanaTexto: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    color: '#94A3B8',
  },

  // Calendario (grid de días)
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 3,
  },
  celda: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celdaHoy: { backgroundColor: '#1E3A8A', borderRadius: 50 },
  celdaConActividad: {
    backgroundColor: '#DBEAFE',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  celdaTexto: { color: '#1E3A8A', fontWeight: '600' },
  celdaHoyTexto: { color: '#fff', fontWeight: 'bold' },
  celdaConActividadTexto: { color: '#1E40AF', fontWeight: '800' },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 2,
  },

  // Leyenda del calendario
  leyenda: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
    justifyContent: 'center',
  },
  leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  leyendaMuestra: { width: 20, height: 20, borderRadius: 10 },
  leyendaTexto: { color: '#475569', fontWeight: '600' },

  // Modal inferior con actividades del día
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    maxHeight: '65%',
  },
  modalTitulo: { fontWeight: 'bold', color: '#1E3A8A', marginBottom: 4 },
  modalSubtitulo: { color: '#64748B', marginBottom: 20 },

  // Vista cuando no hay actividades ese día
  vacioCont: { alignItems: 'center', paddingVertical: 32 },
  vacioEmoji: { fontSize: 48, marginBottom: 12 },
  vacioTexto: { color: '#94A3B8', fontWeight: '600' },

  // Tarjeta de actividad dentro del modal
  actividadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  actividadHoraCont: {
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 52,
  },
  actividadHora: { color: '#1E40AF', fontWeight: '800' },
  actividadTitulo: { color: '#1E3A8A', fontWeight: '700' },
  actividadDesc: { color: '#94A3B8', marginTop: 2 },
  actividadArrow: { fontSize: 26, color: '#CBD5E1', fontWeight: 'bold' },

  // Botón cerrar modal
  modalCerrar: {
    marginTop: 12,
    backgroundColor: '#1E3A8A',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCerrarTexto: { color: '#fff', fontWeight: '700' },
});
