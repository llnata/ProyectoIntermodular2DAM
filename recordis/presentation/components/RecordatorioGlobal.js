// presentation/components/RecordatorioGlobal.js
import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useAjustes } from '../context/AjustesContext';
import { fetchActividades } from '../../domain/usecases/getActividades';

function hoyISO() {
  const d = new Date();
  const año = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

export default function RecordatorioGlobal({ usuarioId }) {
  const { intervalo, tick } = useAjustes();
  const ultimaAlertaRef = useRef(0);

  useEffect(() => {
    if (!usuarioId) return;

    const comprobar = async () => {
      try {
        const actividadesHoy = await fetchActividades(usuarioId, hoyISO());
        if (!actividadesHoy || actividadesHoy.length === 0) return;

        const ahora = Date.now();
        const ultima = ultimaAlertaRef.current ?? 0;

        // usa el intervalo configurado en el perfil (minutos)
        if (ahora - ultima < intervalo * 60 * 1000) return;

        Alert.alert(
          'Recordatorio',
          'Tienes actividades pendientes para hoy. Revisa tu lista.',
          [{ text: 'OK' }]
        );

        ultimaAlertaRef.current = ahora;
      } catch (e) {
        console.log('Error comprobando recordatorios', e);
      }
    };

    comprobar();
  }, [tick, intervalo, usuarioId]);

  return null;
}
