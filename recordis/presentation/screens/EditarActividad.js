// presentation/screens/EditarActividad.js
// Pantalla para editar o eliminar una actividad existente
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAjustes } from '../context/AjustesContext';
import api from '../../data/api';
import { fetchCentrosSalud } from '../../domain/usecases/getCentrosSalud';

export default function EditarActividad({ route, navigation }) {
  // Recibimos la actividad, el usuario y el nombre del usuario desde la navegación
  const { actividad, usuarioId, nombre } = route.params || {};
  const { fs } = useAjustes();

  // Id de la actividad (puede venir como id o _id)
  const actividadId = actividad.id ?? actividad._id;

  // Estado del formulario (inicializado con los datos de la actividad)
  const [titulo, setTitulo] = useState(actividad.titulo ?? '');
  const [descripcion, setDescripcion] = useState(actividad.descripcion ?? '');
  const [hora, setHora] = useState(actividad.hora ?? '');
  const [completada, setCompletada] = useState(actividad.completada ?? false);
  const [guardando, setGuardando] = useState(false);

  // Estado para el selector de hora
  const [mostrarPickerHora, setMostrarPickerHora] = useState(false);
  const [horaDate, setHoraDate] = useState(() => {
    // Si la actividad ya tiene hora, la usamos para inicializar el Date
    const d = new Date();
    if (actividad.hora) {
      const [hh, mm] = actividad.hora.split(':');
      d.setHours(Number(hh) || 0);
      d.setMinutes(Number(mm) || 0);
    }
    return d;
  });

  // Marca si la actividad es una cita de salud
  const [esCitaSalud, setEsCitaSalud] = useState(actividad.esCitaSalud ?? false);

  // Centro de salud asociado a la actividad
  const [centroSaludId, setCentroSaludId] = useState(actividad.centroSaludId ?? null);
  const [centroSaludNombre, setCentroSaludNombre] = useState(actividad.centroSaludNombre ?? '');

  // Lista de centros y estado del selector (modal)
  const [centros, setCentros] = useState([]);
  const [selectorVisible, setSelectorVisible] = useState(false);

  // Si la actividad no tenía hora, ponemos la hora actual por defecto
  useEffect(() => {
    if (!hora) {
      const ahora = new Date();
      const hh = String(ahora.getHours()).padStart(2, '0');
      const mm = String(ahora.getMinutes()).padStart(2, '0');
      setHora(`${hh}:${mm}`);
      setHoraDate(ahora);
    }
  }, []);

  // Cargar una vez la lista de centros de salud
  useEffect(() => {
    fetchCentrosSalud()
      .then(setCentros)
      .catch(console.error);
  }, []);

  // Volver a la vista semanal del usuario
  const volverASemana = () => {
    navigation.navigate('VistaSemanal', {
      usuarioId,
      nombre: nombre || 'Usuario',
    });
  };

  // Guardar cambios de la actividad
  const handleGuardar = async () => {
    // Validaciones mínimas
    if (!titulo.trim() || !hora.trim()) {
      Alert.alert('Error', 'El título y la hora son obligatorios');
      return;
    }
    if (!actividadId) {
      Alert.alert('Error', 'La actividad no tiene id, no se puede guardar');
      console.log('ERROR: actividad sin id', actividad);
      return;
    }

    setGuardando(true);
    try {
      await api.put(`/actividades/${actividadId}`, {
        id: actividadId,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        hora: hora.trim(),
        completada,
        usuarioId,
        fecha: actividad.fecha,
        esCitaSalud,
        centroSaludId,
        centroSaludNombre,
      });

      volverASemana();
    } catch (e) {
      console.error('Error al guardar actividad', e.response?.data || e.message);
      Alert.alert('Error', 'No se pudo guardar la actividad');
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar la actividad actual (con confirmación)
  const handleBorrar = () => {
    if (!actividadId) {
      Alert.alert('Error', 'La actividad no tiene id, no se puede borrar');
      console.log('ERROR: actividad sin id al borrar', actividad);
      return;
    }

    Alert.alert(
      'Eliminar actividad',
      '¿Seguro que quieres eliminar esta actividad?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/actividades/${actividadId}`);
              volverASemana();
            } catch (e) {
              console.error('Error al borrar actividad', e.response?.data || e.message);
              Alert.alert('Error', 'No se pudo eliminar la actividad');
            }
          },
        },
      ]
    );
  };

  // Cuando el usuario elige un centro en el modal
  const seleccionarCentro = (c) => {
    const nombreCentro =
      c.nombre ?? c.name ?? c.nom_centro ?? 'Centro de salud';
    const idCentro = c.id ?? c.recordid ?? null;

    setCentroSaludNombre(nombreCentro);
    setCentroSaludId(idCentro);
    setEsCitaSalud(true); // si eliges centro, marcas cita de salud
    setSelectorVisible(false);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Botón para volver atrás */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[styles.backTexto, { fontSize: fs(17) }]}>← Volver</Text>
      </TouchableOpacity>

      {/* Título de pantalla y fecha de la actividad */}
      <Text style={[styles.tituloPagina, { fontSize: fs(26) }]}>
        ✏️ Editar actividad
      </Text>
      <Text style={[styles.subtitulo, { fontSize: fs(15) }]}>
        Para el día {actividad.fecha}
      </Text>

      {/* TÍTULO */}
      <View style={styles.bloque}>
        <Text style={[styles.label, { fontSize: fs(13) }]}>TÍTULO</Text>
        <TextInput
          style={[styles.input, { fontSize: fs(18) }]}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Escribe el nombre de la actividad"
          placeholderTextColor="#CBD5E1"
        />
      </View>

      {/* HORA */}
      <View style={styles.bloque}>
        <Text style={[styles.label, { fontSize: fs(13) }]}>HORA</Text>
        <View style={styles.horaRow}>
          {/* Campo de texto donde se puede escribir la hora */}
          <TextInput
            style={[styles.inputHora, { fontSize: fs(20) }]}
            value={hora}
            onChangeText={setHora}
            placeholder="09:30"
            placeholderTextColor="#CBD5E1"
            keyboardType="numeric"
            maxLength={5}
          />
          {/* Botón que abre el selector nativo de hora */}
          <TouchableOpacity
            style={styles.horaIcon}
            onPress={() => setMostrarPickerHora(true)}
          >
            <Text style={styles.horaIconTexto}>🕒</Text>
          </TouchableOpacity>
        </View>

        {/* Selector de hora (DateTimePicker) */}
        {mostrarPickerHora && (
          <DateTimePicker
            value={horaDate}
            mode="time"
            is24Hour
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === 'dismissed') {
                setMostrarPickerHora(false);
                return;
              }
              const currentDate = selectedDate || horaDate;
              setMostrarPickerHora(false);
              setHoraDate(currentDate);
              const hh = String(currentDate.getHours()).padStart(2, '0');
              const mm = String(currentDate.getMinutes()).padStart(2, '0');
              setHora(`${hh}:${mm}`);
            }}
          />
        )}
      </View>

      {/* DESCRIPCIÓN */}
      <View style={styles.bloque}>
        <Text style={[styles.label, { fontSize: fs(13) }]}>DESCRIPCIÓN</Text>
        <TextInput
          style={[styles.inputMultilinea, { fontSize: fs(17) }]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Añade detalles si quieres"
          placeholderTextColor="#CBD5E1"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* TIPO DE ACTIVIDAD: Cita de salud */}
      <View style={styles.bloque}>
        <Text style={[styles.label, { fontSize: fs(13) }]}>TIPO DE ACTIVIDAD</Text>
        {/* Checkbox que marca si es cita de salud */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setEsCitaSalud((v) => !v)}
        >
          <View style={[styles.checkbox, esCitaSalud && styles.checkboxActivo]}>
            {esCitaSalud && <Text style={styles.checkboxMarca}>✓</Text>}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.checkboxTexto, { fontSize: fs(16) }]}>
              Es cita de salud (hospital, centro de salud…)
            </Text>
            <Text style={[styles.checkboxHelp, { fontSize: fs(13) }]}>
              Si no lo marcas, se considerará una actividad normal.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botón para abrir el selector de centros de salud */}
        <TouchableOpacity
          style={[
            styles.centroBtn,
            !esCitaSalud && styles.centroBtnDisabled,
          ]}
          disabled={!esCitaSalud}
          onPress={() => setSelectorVisible(true)}
        >
          <Text style={styles.centroBtnTexto}>
            {centroSaludNombre
              ? centroSaludNombre
              : 'Seleccionar centro de salud'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ESTADO (pendiente/completada) */}
      <View style={styles.bloque}>
        <Text style={[styles.label, { fontSize: fs(13) }]}>ESTADO</Text>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            completada ? styles.toggleCompleta : styles.togglePendiente,
          ]}
          onPress={() => setCompletada(!completada)}
        >
          <Text style={[styles.toggleTexto, { fontSize: fs(16) }]}>
            {completada ? '✅ Marcada como completada' : '⏳ Marcada como pendiente'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* BOTÓN GUARDAR */}
      <TouchableOpacity
        style={[styles.botonGuardar, guardando && { opacity: 0.7 }]}
        onPress={handleGuardar}
        disabled={guardando}
      >
        <Text style={[styles.botonGuardarTexto, { fontSize: fs(18) }]}>
          {guardando ? 'Guardando…' : '💾 Guardar cambios'}
        </Text>
      </TouchableOpacity>

      {/* BOTÓN BORRAR */}
      <TouchableOpacity
        style={styles.botonBorrar}
        onPress={handleBorrar}
      >
        <Text style={[styles.botonBorrarTexto, { fontSize: fs(16) }]}>
          🗑️ Eliminar actividad
        </Text>
      </TouchableOpacity>

      {/* MODAL SELECTOR CENTROS SALUD */}
      <Modal visible={selectorVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Elige un centro de salud</Text>
            <FlatList
              data={centros}
              keyExtractor={(item, index) =>
                item.id?.toString() ?? item.recordid ?? String(index)
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemCentro}
                  onPress={() => seleccionarCentro(item)}
                >
                  <Text style={styles.itemCentroNombre}>
                    {item.nombre ?? item.name ?? item.nom_centro ?? 'Centro'}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {/* Botón para cerrar el modal sin seleccionar nada */}
            <TouchableOpacity
              style={styles.modalCerrar}
              onPress={() => setSelectorVisible(false)}
            >
              <Text style={styles.modalCerrarTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Fondo general de la pantalla
  scroll: { backgroundColor: '#EFF6FF' },
  container: { padding: 24, paddingBottom: 48 },
  backBtn: { marginTop: 52, marginBottom: 16 },
  backTexto: { color: '#3B82F6', fontWeight: '600' },

  tituloPagina: { fontWeight: 'bold', color: '#000000' },
  subtitulo: { color: '#64748B', marginTop: 4, marginBottom: 20 },

  // Bloques blancos del formulario
  bloque: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  label: { color: '#94A3B8', fontWeight: '700', letterSpacing: 1 },

  // Inputs genéricos
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#000000',
    marginTop: 8,
  },
  // Fila de hora (input + icono)
  horaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  inputHora: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 2,
  },
  horaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horaIconTexto: { fontSize: 24 },

  // Input multilinea para descripción
  inputMultilinea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#000000',
    marginTop: 8,
    minHeight: 110,
  },

  // Checkbox tipo de actividad
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActivo: {
    backgroundColor: '#22C55E',
    borderColor: '#16A34A',
  },
  checkboxMarca: { color: '#fff', fontWeight: '700', fontSize: 16 },
  checkboxTexto: { color: '#1E3A8A', fontWeight: '600' },
  checkboxHelp: { color: '#94A3B8', marginTop: 2 },

  // Botón para abrir el selector de centro de salud
  centroBtn: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
  },
  centroBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  centroBtnTexto: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Botón de estado completada/pendiente
  toggleBtn: {
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  toggleCompleta: { backgroundColor: '#DCFCE7' },
  togglePendiente: { backgroundColor: '#FEF9C3' },
  toggleTexto: { fontWeight: '700', color: '#000000' },

  // Botón guardar cambios
  botonGuardar: {
    backgroundColor: '#3B82F6',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 12,
    elevation: 3,
  },
  botonGuardarTexto: { color: '#fff', fontWeight: '700' },

  // Botón eliminar actividad
  botonBorrar: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  botonBorrarTexto: {
    color: '#B91C1C',
    fontWeight: '700',
  },

  // Estilos del modal de centros de salud
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E3A8A',
  },
  itemCentro: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  itemCentroNombre: {
    fontSize: 16,
    color: '#111827',
  },
  modalCerrar: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  modalCerrarTexto: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
});
