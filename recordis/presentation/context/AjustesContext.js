// presentation/context/AjustesContext.js
// Contexto global para gestionar ajustes de la app (tamaño de letra, intervalos de recordatorio, etc.)
import React, { createContext, useContext, useState, useEffect } from 'react';

// Creamos el contexto sin valor inicial concreto
const AjustesContext = createContext();

export function AjustesProvider({ children }) {
  // Indica si el usuario ha activado letras grandes
  const [letraGrande, setLetraGrande] = useState(false);

  // Intervalo en minutos para los recordatorios (se puede cambiar desde el perfil/ajustes)
  const [intervalo, setIntervalo] = useState(120);

  // Valor que se actualiza cada cierto tiempo para forzar comprobaciones periódicas (recordatorios)
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    // Temporizador que actualiza "tick" cada minuto
    const id = setInterval(() => {
      // console.log('TICK');
      setTick(Date.now());
    }, 60 * 1000); // cada 60 segundos

    // Limpiamos el intervalo cuando se desmonta el provider
    return () => clearInterval(id);
  }, []);

  // Función helper para calcular tamaño de fuente según si la letra es grande o no
  const fs = (base) => (letraGrande ? base * 1.2 : base);

  return (
    <AjustesContext.Provider
      value={{
        letraGrande,
        setLetraGrande,
        intervalo,
        setIntervalo,
        tick,
        fs,
      }}
    >
      {children}
    </AjustesContext.Provider>
  );
}

// Hook de conveniencia para consumir el contexto de ajustes en cualquier componente
export const useAjustes = () => useContext(AjustesContext);
