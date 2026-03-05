// presentation/screens/CrearActividad.js
// Pantalla para crear una nueva actividad para un usuario y una fecha concreta
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

export default function CrearActividad({ route, navigation }) {
  // Recibimos el usuario y la fecha desde la navegación
  const { usuarioId, fecha } = route.params || {};
  const { fs } = useAjustes();

  // Estado del formulario de actividad
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [hora, setHora] = useState('');
  const [completada, setCompletada] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Estado para el selector de hora
  const [mostrarPickerHora, setMostrarPickerHora] = useState(false);
  const [horaDate, setHoraDate] = useState(() => {
    // Inicializamos con la hora actual
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    setHora(`${hh}:${mm}`);
    return d;
  });

  // Indica si la actividad es una cita de salud
  const [esCitaSalud, setEsCitaSalud] = useState(false);

  // Datos del centro de salud seleccionado
  const [centroSaludId, setCentroSaludId] = useState(null);
  const [centroSaludNombre, setCentroSaludNombre] = useState('');

  // Lista y estado del modal de centros de salud
  const [centros, setCentros] = useState([]);
  const [selectorVisible, setSelectorVisible] = useState(false);

  // Al montar la pantalla, cargamos los centros desde la API externa
  useEffect(() => {
    fetchCentrosSalud()
      .then(setCentros)
      .catch(console.error);
  }, []);

  // Cuando el usuario elige un centro, guardamos sus datos y marcamos como cita de salud
  const seleccionarCentro = (c) => {
    const nombreCentro =
      c.nombre ?? c.name ?? c.nom_centro ?? 'Centro de salud';
    const idCentro = c.id ?? c.recordid ?? null;

    setCentroSaludNombre(nombreCentro);
    setCentroSaludId(idCentro);
    setEsCitaSalud(true);        // si seleccionas centro, marcas cita
    setSelectorVisible(false);
  };

  // Enviar el formulario y crear la actividad en la API
  const handleGuardar = async () => {
    // Validaciones mínimas
    if (!titulo.trim() || !hora.trim()) {
      Alert.alert('Error', 'El título y la hora son obligatorios');
      return;
    }
    if (!usuarioId || !fecha) {
      Alert.alert('Error', 'Faltan datos de usuario o fecha');
      return;
    }

    setGuardando(true);
    try {
      await api.post('/actividades', {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        hora: hora.trim(),
        completada,
        usuarioId,
        fecha,
        esCitaSalud,
        centroSaludId,
        centroSaludNombre,
      });

      // Volvemos a la pantalla anterior (por ejemplo, vista semanal)
      navigation.goBack();
    } catch (e) {
      console.error('Error al crear actividad', e.response?.data || e.message);
      Alert.alert('Error', 'No se pudo crear la actividad');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Botón de volver arriba de la pantalla */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[styles.backTexto, { fontSize: fs(17) }]}>← Volver</Text>
      </TouchableOpacity>

      {/* Título y fecha para la que se está creando la actividad */}
      <Text style={[styles.tituloPagina, { fontSize: fs(26) }]}>➕ Nueva actividad</Text>
      <Text style={[styles.subtitulo, { fontSize: fs(15) }]}>
        Para el día {fecha}
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
          {/* Campo de texto para escribir la hora manualmente */}
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

        {/* Selector nativo de hora (DateTimePicker) */}
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

      {/* TIPO DE ACTIVIDAD + CENTRO SALUD */}
      <View style={styles.bloque}>
        <Text style={[styles.label, { fontSize: fs(13) }]}>TIPO DE ACTIVIDAD</Text>

        {/* Checkbox para marcar la actividad como cita de salud */}
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

      {/* ESTADO (pendiente / completada) */}
      <View style={styles.bloque}>
        <Text style={[styles.label, { fontSize: fs(13) }]}>ESTADO</Text>
        <TouchableOpacity
          style={[styles.toggleBtn, completada ? styles.toggleCompleta : styles.togglePendiente]}
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
          {guardando ? 'Guardando…' : '💾 Crear actividad'}
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

  // Bloques blancos que contienen cada sección del formulario
  bloque: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  label: { color: '#94A3B8', fontWeight: '700', letterSpacing: 1 },

  // Input de una sola línea
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#000000',
    marginTop: 8,
  },
  // Fila que contiene el input de hora y el icono de reloj
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

  // Input de varias líneas para la descripción
  inputMultilinea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#000000',
    marginTop: 8,
    minHeight: 110,
  },

  // Línea con el checkbox de tipo de actividad
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

  // Botón para abrir el selector de centros
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

  // Botón principal para guardar la actividad
  botonGuardar: {
    backgroundColor: '#3B82F6',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 12,
    elevation: 3,
  },
  botonGuardarTexto: { color: '#fff', fontWeight: '700' },

  // Estilos del modal de selección de centros de salud
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
