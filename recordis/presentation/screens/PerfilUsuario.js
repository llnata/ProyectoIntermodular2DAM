// presentation/screens/PerfilUsuario.js
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUsuarios } from '../../domain/usecases/getUsuarios';
import { eliminarUsuario } from '../../data/repositories/usuarioRepository';
import { useAjustes } from '../context/AjustesContext';

const INTERVALOS = [30, 60, 90, 120, 150, 180, 210, 240];

export default function PerfilUsuario({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const { letraGrande, setLetraGrande, intervalo, setIntervalo, fs } = useAjustes();

  // Estados temporales — no afectan la app hasta pulsar Aplicar
  const [letraTmp, setLetraTmp] = useState(letraGrande);
  const [intervaloTmp, setIntervaloTmp] = useState(intervalo);

  const cambiosPendientes = letraTmp !== letraGrande || intervaloTmp !== intervalo;

  useFocusEffect(
    useCallback(() => {
      fetchUsuarios()
        .then((lista) => setUsuario(lista[0] ?? null))
        .catch(console.error);
    }, [])
  );

  const handleAplicar = () => {
    setLetraGrande(letraTmp);
    setIntervalo(intervaloTmp);
    Alert.alert('✅ Ajustes guardados', `Letra grande: ${letraTmp ? 'Sí' : 'No'}\nRecordatorios cada ${intervaloTmp} min`);
  };

  const handleEliminar = () => {
    Alert.alert(
      'Eliminar perfil',
      '¿Seguro que quieres eliminar tu perfil? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await eliminarUsuario(usuario.id);
            navigation.replace('SeleccionUsuario');
          },
        },
      ]
    );
  };

  if (!usuario) return null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[styles.backTexto, { fontSize: fs(18) }]}>← Volver</Text>
      </TouchableOpacity>

      <View style={[styles.avatarCirculo, { backgroundColor: usuario.color ?? '#3B82F6' }]}>
        <Text style={styles.avatarEmoji}>{usuario.avatar ?? '👤'}</Text>
      </View>
      <Text style={[styles.nombre, { fontSize: fs(22) }]}>{usuario.nombre}</Text>
      <Text style={[styles.edad, { fontSize: fs(15) }]}>{usuario.edad} años · {usuario.genero ?? ''}</Text>

      <TouchableOpacity
        style={[styles.botonEditar, { backgroundColor: usuario.color ?? '#3B82F6' }]}
        onPress={() => navigation.navigate('EditarPerfil', { usuario })}
      >
        <Text style={[styles.botonEditarTexto, { fontSize: fs(15) }]}>✏️ Editar perfil</Text>
      </TouchableOpacity>

      <Text style={[styles.seccionTitulo, { fontSize: fs(18) }]}>⚙️ Ajustes</Text>

      {/* Tamaño de letra */}
      <View style={styles.ajusteBox}>
        <Text style={[styles.ajusteLabel, { fontSize: fs(16) }]}>Tamaño de letra</Text>
        <Text style={[styles.ajusteDesc, { fontSize: fs(13) }]}>Aumenta el texto para facilitar la lectura</Text>
        <View style={styles.opcionesRow}>
          {[false, true].map((val) => (
            <TouchableOpacity
              key={String(val)}
              style={[styles.opcionBtn, letraTmp === val && styles.opcionBtnActivo]}
              onPress={() => setLetraTmp(val)}
            >
              <Text style={[styles.opcionTexto, { fontSize: fs(15) }, letraTmp === val && styles.opcionTextoActivo]}>
                {val ? '🔠 Grande' : '🔡 Normal'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Intervalo recordatorios */}
      <View style={styles.ajusteBox}>
        <Text style={[styles.ajusteLabel, { fontSize: fs(16) }]}>Frecuencia de recordatorios</Text>
        <Text style={[styles.ajusteDesc, { fontSize: fs(13) }]}>Cada cuántos minutos recibir un recordatorio</Text>
        <View style={styles.intervalosGrid}>
          {INTERVALOS.map((min) => (
            <TouchableOpacity
              key={min}
              style={[styles.intervaloBtn, intervaloTmp === min && styles.intervaloBtnActivo]}
              onPress={() => setIntervaloTmp(min)}
            >
              <Text style={[styles.intervaloTexto, { fontSize: fs(15) }, intervaloTmp === min && styles.intervaloTextoActivo]}>
                {min} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Versión */}
      <View style={styles.ajusteBox}>
        <TouchableOpacity
          style={styles.ajusteFila}
          onPress={() => Alert.alert('Versión', 'Recordis v1.0.0')}
        >
          <Text style={[styles.ajusteLabel, { fontSize: fs(16) }]}>Versión de la app</Text>
          <Text style={[styles.ajusteValor, { fontSize: fs(15) }]}>v1.0.0 →</Text>
        </TouchableOpacity>
      </View>

      {/* Botón aplicar — solo visible si hay cambios */}
      {cambiosPendientes && (
        <TouchableOpacity style={styles.botonAplicar} onPress={handleAplicar}>
          <Text style={[styles.botonAplicarTexto, { fontSize: fs(17) }]}>✅ Aplicar cambios</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.botonEliminar} onPress={handleEliminar}>
        <Text style={[styles.botonEliminarTexto, { fontSize: fs(16) }]}>🗑️ Eliminar perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#EFF6FF' },
  container: { padding: 24, alignItems: 'center', paddingBottom: 48 },
  backBtn: { alignSelf: 'flex-start', marginTop: 32, marginBottom: 16 },
  backTexto: { color: '#3B82F6', fontWeight: '600' },
  avatarCirculo: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 10, elevation: 4 },
  avatarEmoji: { fontSize: 44 },
  nombre: { fontWeight: 'bold', color: '#1E3A8A', marginBottom: 2 },
  edad: { color: '#64748B', marginBottom: 16 },
  botonEditar: { paddingVertical: 11, paddingHorizontal: 28, borderRadius: 12, marginBottom: 24, elevation: 2 },
  botonEditarTexto: { color: '#fff', fontWeight: '700' },
  seccionTitulo: { alignSelf: 'flex-start', fontWeight: '700', color: '#1E3A8A', marginBottom: 12 },
  ajusteBox: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  ajusteFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ajusteLabel: { color: '#1E3A8A', fontWeight: '600', marginBottom: 4 },
  ajusteDesc: { color: '#94A3B8', marginBottom: 12 },
  ajusteValor: { color: '#94A3B8' },
  opcionesRow: { flexDirection: 'row', gap: 10 },
  opcionBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  opcionBtnActivo: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  opcionTexto: { color: '#64748B', fontWeight: '600' },
  opcionTextoActivo: { color: '#1E3A8A' },
  intervalosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  intervaloBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#F1F5F9', borderWidth: 2, borderColor: 'transparent' },
  intervaloBtnActivo: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  intervaloTexto: { color: '#64748B', fontWeight: '600' },
  intervaloTextoActivo: { color: '#1E3A8A', fontWeight: '700' },
  botonAplicar: { width: '100%', backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  botonAplicarTexto: { color: '#fff', fontWeight: '700' },
  botonEliminar: { marginTop: 8, backgroundColor: '#FEE2E2', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
  botonEliminarTexto: { color: '#EF4444', fontWeight: '700' },
});
