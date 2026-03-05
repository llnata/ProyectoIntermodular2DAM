// presentation/screens/Ajustes.js
// Pantalla simple de ajustes (por ahora solo muestra título y botón para volver)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Ajustes({ navigation }) {
  return (
    // Contenedor principal centrado verticalmente
    <View style={styles.container}>
      {/* Título de la pantalla de ajustes */}
      <Text style={styles.titulo}>Ajustes</Text>

      {/* Botón para volver a la pantalla anterior */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.volver}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Fondo azul claro y contenido centrado
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
  },
  // Estilo del título
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 32,
  },
  // Estilo del texto del botón de volver
  volver: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
  },
});
