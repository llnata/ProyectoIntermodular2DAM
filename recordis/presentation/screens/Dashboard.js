// presentation/screens/Dashboard.js
// Pantalla principal de bienvenida: muestra al usuario activo y accesos rápidos
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUsuarios } from '../../domain/usecases/getUsuarios';
import { useAjustes } from '../context/AjustesContext';

// Devuelve la fecha de hoy en formato legible (ej: "Jueves, 5 de marzo")
const getDiaFecha = () => {
  const ahora = new Date();
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  return `${dias[ahora.getDay()]}, ${ahora.getDate()} de ${meses[ahora.getMonth()]}`;
};

// Devuelve la fecha de hoy en formato YYYY-MM-DD
const getFechaHoy = () => new Date().toISOString().split('T')[0];

export default function Dashboard({ navigation }) {
  // Usuario activo cargado desde la API
  const [usuario, setUsuario] = useState(null);
  const { fs } = useAjustes();

  // Cuando la pantalla gana foco, cargamos los usuarios
  useFocusEffect(
    useCallback(() => {
      fetchUsuarios()
        .then((lista) => {
          if (lista.length === 0) {
            // Si no hay usuarios, redirigimos a crear perfil
            navigation.replace('CrearPerfil');
          } else {
            // Por simplicidad usamos el primer usuario como activo
            setUsuario(lista[0]);
          }
        })
        .catch(() => navigation.replace('CrearPerfil'));
    }, [])
  );

  // Mientras no haya usuario, no renderizamos nada
  if (!usuario) return null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Cabecera con avatar, nombre y fecha de hoy */}
      <View
        style={[
          styles.cabecera,
          { backgroundColor: usuario.color ?? '#3B82F6' },
        ]}
      >
        <Text style={styles.avatarGrande}>{usuario.avatar ?? '👤'}</Text>
        <Text style={[styles.saludo, { fontSize: fs(28) }]}>
          Hola, {usuario.nombre} 👋
        </Text>
        <Text style={[styles.fecha, { fontSize: fs(16) }]}>
          {getDiaFecha()}
        </Text>
      </View>

      {/* Grid de tarjetas con accesos rápidos */}
      <View style={styles.grid}>
        {/* Ir a la vista semanal de actividades */}
        <TouchableOpacity
          style={[
            styles.tarjeta,
            styles.tarjetaGrande,
            { backgroundColor: usuario.color ?? '#3B82F6' },
          ]}
          onPress={() =>
            navigation.navigate('VistaSemanal', {
              usuarioId: usuario.id,
              nombre: usuario.nombre,
            })
          }
        >
          <Text style={styles.tarjetaEmoji}>📅</Text>
          <Text style={[styles.tarjetaTexto, { fontSize: fs(20) }]}>
            Ver semana
          </Text>
          <Text style={[styles.tarjetaDesc, { fontSize: fs(14) }]}>
            Consulta tus actividades
          </Text>
        </TouchableOpacity>

        {/* Crear actividad para el día de hoy */}
        <TouchableOpacity
          style={[
            styles.tarjeta,
            styles.tarjetaGrande,
            { backgroundColor: '#22C55E' },
          ]}
          onPress={() =>
            navigation.navigate('CrearActividad', {
              usuarioId: usuario.id,
              fecha: getFechaHoy(),
            })
          }
        >
          <Text style={styles.tarjetaEmoji}>➕</Text>
          <Text style={[styles.tarjetaTexto, { fontSize: fs(20) }]}>
            Nueva actividad
          </Text>
          <Text style={[styles.tarjetaDesc, { fontSize: fs(14) }]}>
            Añade algo para hoy
          </Text>
        </TouchableOpacity>

        {/* Acceso al perfil de usuario */}
        <TouchableOpacity
          style={[
            styles.tarjeta,
            styles.tarjetaMediana,
            { backgroundColor: '#F97316' },
          ]}
          onPress={() => navigation.navigate('PerfilUsuario')}
        >
          <Text style={styles.tarjetaEmoji}>👤</Text>
          <Text style={[styles.tarjetaTexto, { fontSize: fs(18) }]}>
            Mi perfil
          </Text>
        </TouchableOpacity>

        {/* Resumen mensual de actividades */}
        <TouchableOpacity
          style={[
            styles.tarjeta,
            styles.tarjetaMediana,
            { backgroundColor: '#A855F7' },
          ]}
          onPress={() =>
            navigation.navigate('VistaResumen', { usuarioId: usuario.id })
          }
        >
          <Text style={styles.tarjetaEmoji}>📊</Text>
          <Text style={[styles.tarjetaTexto, { fontSize: fs(18) }]}>
            Resumen
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Fondo general del dashboard
  scroll: { backgroundColor: '#EFF6FF' },
  container: { paddingBottom: 48 },

  // Cabecera con fondo de color y contenido centrado
  cabecera: { padding: 36, paddingTop: 64, alignItems: 'center' },
  avatarGrande: { fontSize: 72, marginBottom: 12 },
  saludo: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  fecha: { color: 'rgba(255,255,255,0.85)', marginTop: 6, textAlign: 'center' },

  // Grid de tarjetas (botones grandes)
  grid: { padding: 20, gap: 16 },
  tarjeta: { borderRadius: 20, padding: 24, elevation: 4 },
  tarjetaGrande: { minHeight: 130, justifyContent: 'center' },
  tarjetaMediana: { minHeight: 100, justifyContent: 'center' },
  tarjetaEmoji: { fontSize: 40, marginBottom: 8 },
  tarjetaTexto: { color: '#fff', fontWeight: 'bold' },
  tarjetaDesc: { color: 'rgba(255,255,255,0.85)', marginTop: 4 },
});
