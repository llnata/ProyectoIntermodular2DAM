// App.js
import React from 'react';
import AppNavigator from './presentation/navigation/AppNavigator';
import { AjustesProvider } from './presentation/context/AjustesContext';
import RecordatorioGlobal from './presentation/components/RecordatorioGlobal';

export default function App() {
  const usuarioIdActual = 1; // usa un id que SEPAS que tiene actividades hoy

  return (
    <AjustesProvider>
      <RecordatorioGlobal usuarioId={usuarioIdActual} />
      <AppNavigator />
    </AjustesProvider>
  );
}
