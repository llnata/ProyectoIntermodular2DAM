// presentation/screens/SeleccionUsuario.js
// Pantalla puente: decide si ir a CrearPerfil o al Dashboard según haya usuarios guardados
import React, { useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUsuarios } from '../../domain/usecases/getUsuarios';

export default function SeleccionUsuario({ navigation }) {
  // Cada vez que esta pantalla gana foco, consultamos si existen usuarios
  useFocusEffect(
    useCallback(() => {
      fetchUsuarios()
        .then((usuarios) => {
          if (usuarios.length === 0) {
            // Si no hay usuarios, forzamos a crear el primer perfil
            navigation.replace('CrearPerfil');
          } else {
            // Si ya hay al menos uno, vamos directamente al Dashboard
            navigation.replace('Dashboard');
          }
        })
        .catch(() => navigation.replace('CrearPerfil'));
    }, [])
  );

  // Mientras decide a dónde navegar, mostramos un loader centrado
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor centrado con fondo azul claro
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
  },
});
