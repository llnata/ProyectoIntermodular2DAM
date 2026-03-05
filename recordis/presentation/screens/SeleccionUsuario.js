// presentation/screens/SeleccionUsuario.js
import React, { useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUsuarios } from '../../domain/usecases/getUsuarios';

export default function SeleccionUsuario({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      fetchUsuarios()
        .then((usuarios) => {
          if (usuarios.length === 0) {
            navigation.replace('CrearPerfil');
          } else {
            navigation.replace('Dashboard');
          }
        })
        .catch(() => navigation.replace('CrearPerfil'));
    }, [])
  );

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFF6FF' },
});
