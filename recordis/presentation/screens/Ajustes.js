// presentation/screens/Ajustes.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Ajustes({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ajustes</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.volver}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#EFF6FF', justifyContent: 'center' },
  titulo: { fontSize: 32, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 32 },
  volver: { textAlign: 'center', color: '#64748B', fontSize: 16 },
});
