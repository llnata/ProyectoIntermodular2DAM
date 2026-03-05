// presentation/screens/Dashboard.js
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUsuarios } from '../../domain/usecases/getUsuarios';
import { useAjustes } from '../context/AjustesContext';

const getDiaFecha = () => {
  const ahora = new Date();
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${dias[ahora.getDay()]}, ${ahora.getDate()} de ${meses[ahora.getMonth()]}`;
};

const getFechaHoy = () => new Date().toISOString().split('T')[0];

export default function Dashboard({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const { fs } = useAjustes();

  useFocusEffect(
    useCallback(() => {
      fetchUsuarios()
        .then((lista) => {
          if (lista.length === 0) {
            navigation.replace('CrearPerfil');
          } else {
            setUsuario(lista[0]);
          }
        })
        .catch(() => navigation.replace('CrearPerfil'));
    }, [])
  );

  if (!usuario) return null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      {/* Cabecera */}
      <View style={[styles.cabecera, { backgroundColor: usuario.color ?? '#3B82F6' }]}>
        <Text style={styles.avatarGrande}>{usuario.avatar ?? '👤'}</Text>
        <Text style={[styles.saludo, { fontSize: fs(28) }]}>Hola, {usuario.nombre} 👋</Text>
        <Text style={[styles.fecha, { fontSize: fs(16) }]}>{getDiaFecha()}</Text>
      </View>

      {/* Botones principales */}
      <View style={styles.grid}>

        <TouchableOpacity
          style={[styles.tarjeta, styles.tarjetaGrande, { backgroundColor: usuario.color ?? '#3B82F6' }]}
          onPress={() => navigation.navigate('VistaSemanal', { usuarioId: usuario.id, nombre: usuario.nombre })}
        >
          <Text style={styles.tarjetaEmoji}>📅</Text>
          <Text style={[styles.tarjetaTexto, { fontSize: fs(20) }]}>Ver semana</Text>
          <Text style={[styles.tarjetaDesc, { fontSize: fs(14) }]}>Consulta tus actividades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tarjeta, styles.tarjetaGrande, { backgroundColor: '#22C55E' }]}
          onPress={() => navigation.navigate('CrearActividad', { usuarioId: usuario.id, fecha: getFechaHoy() })}
        >
          <Text style={styles.tarjetaEmoji}>➕</Text>
          <Text style={[styles.tarjetaTexto, { fontSize: fs(20) }]}>Nueva actividad</Text>
          <Text style={[styles.tarjetaDesc, { fontSize: fs(14) }]}>Añade algo para hoy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tarjeta, styles.tarjetaMediana, { backgroundColor: '#F97316' }]}
          onPress={() => navigation.navigate('PerfilUsuario')}
        >
          <Text style={styles.tarjetaEmoji}>👤</Text>
          <Text style={[styles.tarjetaTexto, { fontSize: fs(18) }]}>Mi perfil</Text>
        </TouchableOpacity>

        {/* Resumen */}
        <TouchableOpacity
          style={[styles.tarjeta, styles.tarjetaMediana, { backgroundColor: '#A855F7' }]}
          onPress={() => navigation.navigate('VistaResumen', { usuarioId: usuario.id })}
        >
          <Text style={styles.tarjetaEmoji}>📊</Text>
          <Text style={[styles.tarjetaTexto, { fontSize: fs(18) }]}>Resumen</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#EFF6FF' },
  container: { paddingBottom: 48 },
  cabecera: { padding: 36, paddingTop: 64, alignItems: 'center' },
  avatarGrande: { fontSize: 72, marginBottom: 12 },
  saludo: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  fecha: { color: 'rgba(255,255,255,0.85)', marginTop: 6, textAlign: 'center' },
  grid: { padding: 20, gap: 16 },
  tarjeta: { borderRadius: 20, padding: 24, elevation: 4 },
  tarjetaGrande: { minHeight: 130, justifyContent: 'center' },
  tarjetaMediana: { minHeight: 100, justifyContent: 'center' },
  tarjetaEmoji: { fontSize: 40, marginBottom: 8 },
  tarjetaTexto: { color: '#fff', fontWeight: 'bold' },
  tarjetaDesc: { color: 'rgba(255,255,255,0.85)', marginTop: 4 },
});
