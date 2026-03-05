// presentation/components/RecordatorioGlobal.js
// Componente que lanza recordatorios periódicos de actividades pendientes
import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useAjustes } from '../context/AjustesContext';
import { fetchActividades } from '../../domain/usecases/getActividades';

// Función helper para obtener la fecha de hoy en formato YYYY-MM-DD
function hoyISO() {
  const d = new Date();
  const año = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

export default function RecordatorioGlobal({ usuarioId }) {
  // intervalo y tick vienen del contexto de ajustes
  const { intervalo, tick } = useAjustes();

  // Ref para controlar cuándo se lanzó la última alerta
  const ultimaAlertaRef = useRef(0);

  useEffect(() => {
    if (!usuarioId) return;

    // Función que comprueba si hay que mostrar un recordatorio
    const comprobar = async () => {
      try {
        // Cargamos solo actividades del día actual
        const actividadesHoy = await fetchActividades(usuarioId, hoyISO());
        if (!actividadesHoy || actividadesHoy.length === 0) return;

        const ahora = Date.now();
        const ultima = ultimaAlertaRef.current ?? 0;

        // Usa el intervalo configurado en el perfil (en minutos)
        if (ahora - ultima < intervalo * 60 * 1000) return;

        // Mensaje emergente para recordar actividades pendientes
        Alert.alert(
          'Recordatorio',
          'Tienes actividades pendientes para hoy. Revisa tu lista.',
          [{ text: 'OK' }]
        );

        // Guardamos el momento en que se lanzó la última alerta
        ultimaAlertaRef.current = ahora;
      } catch (e) {
        // Log de errores al comprobar recordatorios
        console.log('Error comprobando recordatorios', e);
      }
    };

    comprobar();
    // Se ejecuta cuando cambia tick, intervalo o usuarioId
  }, [tick, intervalo, usuarioId]);

  return null;
}
