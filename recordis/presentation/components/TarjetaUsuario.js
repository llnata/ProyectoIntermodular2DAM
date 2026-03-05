// presentation/components/TarjetaUsuario.js
// Componente reutilizable para mostrar un usuario en forma de tarjeta seleccionable
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TarjetaUsuario({ usuario, onPress }) {
  return (
    // Contenedor pulsable: al tocar se ejecuta onPress (por ejemplo, seleccionar usuario)
    <TouchableOpacity style={styles.tarjeta} onPress={onPress}>
      {/* Avatar circular con la inicial del nombre del usuario */}
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>
          {usuario.nombre.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Datos principales del usuario: nombre y edad */}
      <View>
        <Text style={styles.nombre}>{usuario.nombre}</Text>
        <Text style={styles.edad}>{usuario.edad} años</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilo base de la tarjeta de usuario
  tarjeta: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  // Círculo de color que actúa como avatar
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto dentro del avatar (inicial del nombre)
  avatarTexto: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Nombre del usuario en la tarjeta
  nombre: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  // Edad del usuario, texto secundario
  edad: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 2,
  },
});
