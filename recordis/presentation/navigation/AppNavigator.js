// presentation/navigation/AppNavigator.js
// Navegador principal de la app: define todas las pantallas y la navegación tipo Stack
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SeleccionUsuario from '../screens/SeleccionUsuario';
import CrearPerfil from '../screens/CrearPerfil';
import VistaSemanal from '../screens/VistaSemanal';
import VistaDia from '../screens/VistaDia';
import DetalleActividad from '../screens/DetalleActividad';
import CrearActividad from '../screens/CrearActividad';
import Ajustes from '../screens/Ajustes';
import PerfilUsuario from '../screens/PerfilUsuario';
import EditarPerfil from '../screens/EditarPerfil';
import Dashboard from '../screens/Dashboard';
import VistaResumen from '../screens/VistaResumen';
import EditarActividad from '../screens/EditarActividad';
import CentrosSaludScreen from '../screens/CentrosSaludScreen';

// Creamos el stack navigator de React Navigation
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    // Contenedor de navegación que envuelve toda la app
    <NavigationContainer>
      {/* Definición de la pila de pantallas */}
      <Stack.Navigator
        initialRouteName="SeleccionUsuario"   // Pantalla inicial al abrir la app
        screenOptions={{ headerShown: false }} // Ocultamos el header por defecto
      >
        {/* Pantallas principales de la app */}
        <Stack.Screen name="SeleccionUsuario" component={SeleccionUsuario} />
        <Stack.Screen name="CrearPerfil" component={CrearPerfil} />
        <Stack.Screen name="VistaSemanal" component={VistaSemanal} />
        <Stack.Screen name="VistaDia" component={VistaDia} />
        <Stack.Screen name="DetalleActividad" component={DetalleActividad} />
        <Stack.Screen name="CrearActividad" component={CrearActividad} />
        <Stack.Screen name="Ajustes" component={Ajustes} />
        <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="VistaResumen" component={VistaResumen} />
        <Stack.Screen name="EditarActividad" component={EditarActividad} />

        {/* Pantalla específica para listar centros de salud */}
        <Stack.Screen
          name="CentrosSalud"
          component={CentrosSaludScreen}
          options={{ title: 'Centros de salud' }} // Título si se mostrara el header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
