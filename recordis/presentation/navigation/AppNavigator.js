// presentation/navigation/AppNavigator.js
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

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SeleccionUsuario" screenOptions={{ headerShown: false }}>
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
        <Stack.Screen name="CentrosSalud" component={CentrosSaludScreen} options={{ title: 'Centros de salud' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
