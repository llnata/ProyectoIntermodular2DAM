// presentation/components/TarjetaUsuario.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TarjetaUsuario({ usuario, onPress }) {
  return (
    <TouchableOpacity style={styles.tarjeta} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>{usuario.nombre.charAt(0).toUpperCase()}</Text>
      </View>
      <View>
        <Text style={styles.nombre}>{usuario.nombre}</Text>
        <Text style={styles.edad}>{usuario.edad} años</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 3, flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  avatarTexto: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  nombre: { fontSize: 20, fontWeight: '600', color: '#1E3A8A' },
  edad: { fontSize: 15, color: '#64748B', marginTop: 2 },
});
