// presentation/utils/notificaciones.js
import * as Notifications from 'expo-notifications';

// Cómo se muestran cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function pedirPermisosNotificaciones() {
  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    const res = await Notifications.requestPermissionsAsync();
    return res.granted;
  }
  return true;
}

/**
 * Programa una notificación a la hora de la actividad y otra repetida
 * cada intervaloMin minutos. No se ofrece opción en la app para desactivarlas.
 */
export async function programarNotificacionesActividad(
  titulo,
  cuerpo,
  fechaHoraDate,
  intervaloMin
) {
  const ok = await pedirPermisosNotificaciones();
  if (!ok) return;

  // Notificación en la hora exacta de la actividad
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo || 'Tienes una actividad pendiente',
      sound: true,
    },
    trigger: fechaHoraDate,
  });

  // Notificaciones periódicas cada intervaloMin minutos
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo || 'Recuerda tu actividad pendiente',
      sound: true,
    },
    trigger: {
      seconds: intervaloMin * 60,
      repeats: true,
    },
  });
}
