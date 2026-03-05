// presentation/screens/CrearPerfil.js
// Pantalla para crear un nuevo perfil de usuario (nombre, edad, género, avatar y color)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { registrarUsuario } from '../../domain/usecases/crearUsuario';
import { useAjustes } from '../context/AjustesContext';

// Paleta de colores disponibles para el perfil
const COLORES = ['#3B82F6', '#22C55E', '#F97316', '#A855F7', '#EF4444', '#EAB308'];

// Avatares disponibles para género masculino (dos filas)
const AVATARES_HOMBRE = [
  ['👦🏻', '👨🏻', '🧔🏻', '👴🏻'],
  ['👦🏿', '👨🏿', '🧔🏿', '👴🏿'],
];

// Avatares disponibles para género femenino (dos filas)
const AVATARES_MUJER = [
  ['👧🏻', '👩🏻', '👩🏻‍🦱', '👵🏻'],
  ['👧🏿', '👩🏿', '👩🏿‍🦱', '👵🏿'],
];

export default function CrearPerfil({ navigation }) {
  // Datos básicos del usuario
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('Hombre');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [color, setColor] = useState(COLORES[0]);

  // Intervalo global de recordatorios elegido en Ajustes (minutos)
  const { intervalo } = useAjustes();

  // Seleccionamos el grid de avatares según el género actual
  const avataresGrid = genero === 'Hombre' ? AVATARES_HOMBRE : AVATARES_MUJER;
  // Lo convertimos en un array plano para poder indexar fácilmente
  const avataresFlat = avataresGrid.flat();

  // Handler para crear el usuario en la API
  const handleCrear = async () => {
    // Validación mínima de campos obligatorios
    if (!nombre.trim() || !edad.trim()) {
      return Alert.alert('Error', 'Rellena nombre y edad');
    }
    try {
      // Llamada al caso de uso que registra al usuario en el backend
      await registrarUsuario(
        nombre.trim(),
        parseInt(edad, 10),
        avataresFlat[avatarIndex],
        color,
        genero,
        intervalo // se guarda como frecuenciaRecordatoriosMin
      );

      // Navegamos al dashboard una vez creado el perfil
      navigation.navigate('Dashboard');
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el usuario');
      console.error(e);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Cabecera con título y explicación breve */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitulo}>Crear perfil</Text>
        <Text style={styles.headerSubtitulo}>
          Configura tu usuario para guardar tus actividades
        </Text>
      </View>

      {/* Selección de género */}
      <Text style={styles.seccion}>Género</Text>
      <View style={styles.generoRow}>
        {['Hombre', 'Mujer'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.generoBtn, genero === g && styles.generoBtnActivo]}
            onPress={() => {
              setGenero(g);
              setAvatarIndex(0); // reiniciamos la selección de avatar al cambiar de género
            }}
          >
            <Text style={styles.generoEmoji}>{g === 'Hombre' ? '👨' : '👩'}</Text>
            <Text
              style={[
                styles.generoTexto,
                genero === g && styles.generoTextoActivo,
              ]}
            >
              {g}
            </Text>
            {genero === g && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Selección de avatar */}
      <Text style={styles.seccion}>Elige tu avatar</Text>
      <View style={styles.avatarGrid}>
        {avataresGrid.map((fila, filaIndex) => (
          <View key={`fila-${filaIndex}`} style={styles.avatarFila}>
            {fila.map((av, colIndex) => {
              const index = filaIndex * 4 + colIndex;
              const activo = avatarIndex === index;
              return (
                <TouchableOpacity
                  key={`${genero}-${index}`}
                  style={[
                    styles.avatarBtn,
                    activo && styles.avatarBtnActivo,
                  ]}
                  onPress={() => setAvatarIndex(index)}
                >
                  <Text style={styles.avatarEmoji}>{av}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Campo de nombre */}
      <Text style={styles.seccion}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#94A3B8"
      />

      {/* Campo de edad */}
      <Text style={styles.seccion}>Edad</Text>
      <View style={styles.edadRow}>
        <TextInput
          style={styles.inputEdad}
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
          placeholder="8"
          placeholderTextColor="#94A3B8"
        />
        <Text style={styles.años}>años</Text>
      </View>

      {/* Selección de color de perfil */}
      <Text style={styles.seccion}>Color de perfil</Text>
      <View style={styles.coloresRow}>
        {COLORES.map((c) => {
          const activo = color === c;
          return (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorCirculo,
                { backgroundColor: c },
                activo && styles.colorActivo,
              ]}
              onPress={() => setColor(c)}
            />
          );
        })}
      </View>

      {/* Botón para guardar el perfil */}
      <TouchableOpacity
        style={[styles.boton, { backgroundColor: color }]}
        onPress={handleCrear}
      >
        <Text style={styles.botonTexto}>✅ Guardar perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Fondo general de la pantalla
  scroll: { backgroundColor: '#EFF6FF' },
  container: { padding: 24, paddingBottom: 48 },

  // Cabecera con título y subtítulo
  headerBox: {
    marginTop: 40,
    marginBottom: 16,
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitulo: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },

  // Título de cada sección
  seccion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginTop: 20,
    marginBottom: 10,
  },

  // Fila de botones de género
  generoRow: { flexDirection: 'row', gap: 12 },
  generoBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  generoBtnActivo: { borderColor: '#3B82F6' },
  generoEmoji: { fontSize: 32, marginBottom: 4 },
  generoTexto: { fontSize: 16, color: '#64748B', fontWeight: '600' },
  generoTextoActivo: { color: '#1E3A8A' },
  check: {
    position: 'absolute',
    top: 8,
    right: 10,
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Grid de avatares
  avatarGrid: { gap: 12 },
  avatarFila: { flexDirection: 'row', justifyContent: 'space-between' },
  avatarBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  avatarBtnActivo: { borderColor: '#3B82F6' },
  avatarEmoji: { fontSize: 34 },

  // Input para el nombre
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 18,
    elevation: 2,
    color: '#111827',
  },

  // Fila para la edad (input + texto "años")
  edadRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inputEdad: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 18,
    elevation: 2,
    width: 90,
    color: '#111827',
  },
  años: { fontSize: 16, color: '#64748B' },

  // Circulitos de color disponibles
  coloresRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  colorCirculo: { width: 44, height: 44, borderRadius: 22 },
  colorActivo: {
    borderWidth: 3,
    borderColor: '#111827',
  },

  // Botón principal de guardar perfil
  boton: {
    marginTop: 32,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
