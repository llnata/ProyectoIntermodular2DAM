// presentation/context/AjustesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AjustesContext = createContext();

export function AjustesProvider({ children }) {
  const [letraGrande, setLetraGrande] = useState(false);
  const [intervalo, setIntervalo] = useState(120); // minutos desde perfil
  const [tick, setTick] = useState(Date.now());

useEffect(() => {
  const id = setInterval(() => {
    // console.log('TICK');
    setTick(Date.now());
  }, 60 * 1000); // aquí puedes volver a 60s
  return () => clearInterval(id);
}, []);

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

export const useAjustes = () => useContext(AjustesContext);
