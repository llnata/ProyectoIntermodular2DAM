// presentation/screens/EditarPerfil.js
// Pantalla para editar un perfil de usuario existente
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
import api from '../../data/api';

// Paleta de colores disponibles para el perfil
const COLORES = ['#3B82F6', '#22C55E', '#F97316', '#A855F7', '#EF4444', '#EAB308'];

// Avatares disponibles para género masculino
const AVATARES_HOMBRE = [
  ['👦🏻', '👨🏻', '🧔🏻', '👴🏻'],
  ['👦🏿', '👨🏿', '🧔🏿', '👴🏿'],
];

// Avatares disponibles para género femenino
const AVATARES_MUJER = [
  ['👧🏻', '👩🏻', '👩🏻‍🦱', '👵🏻'],
  ['👧🏿', '👩🏿', '👩🏿‍🦱', '👵🏿'],
];

export default function EditarPerfil({ route, navigation }) {
  // Usuario recibido desde la navegación
  const { usuario } = route.params;

  // Estado local con los datos que se pueden editar
  const [nombre, setNombre] = useState(usuario.nombre);
  const [edad, setEdad] = useState(String(usuario.edad));
  const [genero, setGenero] = useState(usuario.genero ?? 'Hombre');
  const [color, setColor] = useState(usuario.color ?? '#3B82F6');

  // Elegimos la matriz de avatares según el género actual
  const avataresGrid = genero === 'Hombre' ? AVATARES_HOMBRE : AVATARES_MUJER;
  const avataresFlat = avataresGrid.flat();
  // Buscamos la posición del avatar actual del usuario
  const indexInicial = avataresFlat.indexOf(usuario.avatar);
  const [avatarIndex, setAvatarIndex] = useState(
    indexInicial >= 0 ? indexInicial : 0
  );

  // Guardar los cambios del perfil llamando a la API
  const handleGuardar = async () => {
    if (!nombre || !edad) {
      return Alert.alert('Error', 'Rellena nombre y edad');
    }
    try {
      await api.put(`/usuarios/${usuario.id}`, {
        nombre,
        edad: parseInt(edad),
        avatar: avataresFlat[avatarIndex],
        color,
        genero,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Botón volver */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Text style={styles.backTexto}>← Editar perfil</Text>
      </TouchableOpacity>

      {/* Selección de género */}
      <Text style={styles.seccion}>Género</Text>
      <View style={styles.generoRow}>
        {['Hombre', 'Mujer'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.generoBtn, genero === g && styles.generoBtnActivo]}
            onPress={() => {
              setGenero(g);
              setAvatarIndex(0); // reiniciamos avatar al cambiar de género
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
              return (
                <TouchableOpacity
                  key={`${genero}-${index}`}
                  style={[
                    styles.avatarBtn,
                    avatarIndex === index && styles.avatarBtnActivo,
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
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Campo de edad */}
      <Text style={styles.seccion}>Edad</Text>
      <View style={styles.edadRow}>
        <TextInput
          style={styles.inputEdad}
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />
        <Text style={styles.años}>años</Text>
      </View>

      {/* Selección de color de perfil */}
      <Text style={styles.seccion}>Color de perfil</Text>
      <View style={styles.coloresRow}>
        {COLORES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorCirculo,
              { backgroundColor: c },
              color === c && styles.colorActivo,
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      {/* Botón guardar cambios */}
      <TouchableOpacity
        style={[styles.boton, { backgroundColor: color }]}
        onPress={handleGuardar}
      >
        <Text style={styles.botonTexto}>💾 Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Fondo y padding general
  scroll: { backgroundColor: '#EFF6FF' },
  container: { padding: 24, paddingBottom: 48 },

  // Botón de volver
  backBtn: { marginTop: 32, marginBottom: 16 },
  backTexto: { fontSize: 18, color: '#3B82F6', fontWeight: '600' },

  // Título de secciones
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  generoBtnActivo: { borderColor: '#3B82F6' },
  generoEmoji: { fontSize: 36, marginBottom: 4 },
  generoTexto: { fontSize: 16, color: '#64748B', fontWeight: '600' },
  generoTextoActivo: { color: '#1E3A8A' },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: '#3B82F6',
    fontWeight: 'bold',
  },

  // Grid de avatares
  avatarGrid: { gap: 10 },
  avatarFila: { flexDirection: 'row', justifyContent: 'space-between' },
  avatarBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  avatarBtnActivo: { borderColor: '#3B82F6' },
  avatarEmoji: { fontSize: 34 },

  // Input de nombre
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    elevation: 2,
  },

  // Fila para la edad
  edadRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inputEdad: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    elevation: 2,
    width: 90,
  },
  años: { fontSize: 16, color: '#64748B' },

  // Colores de perfil
  coloresRow: { flexDirection: 'row', gap: 12 },
  colorCirculo: { width: 44, height: 44, borderRadius: 22 },
  colorActivo: { borderWidth: 3, borderColor: '#1E3A8A' },

  // Botón principal
  boton: { marginTop: 32, padding: 18, borderRadius: 14, alignItems: 'center' },
  botonTexto: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
