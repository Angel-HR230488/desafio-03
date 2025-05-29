import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Importar pantallas
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { BookListScreen } from './src/screens/BookListScreen';
import { BookDetailsScreen } from './src/screens/BookDetailsScreen';
import { BookFormScreen } from './src/screens/BookFormScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // O un componente de carga
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!user ? (
        // Rutas públicas (no autenticadas)
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }}
          />
        </>
      ) : (
        // Rutas protegidas (requieren autenticación)
        <>
          <Stack.Screen
            name="BookList"
            component={BookListScreen}
            options={{ 
              title: 'Mis Libros',
              headerShown: false
            }}
          />
          <Stack.Screen
            name="BookDetails"
            component={BookDetailsScreen}
            options={{ title: 'Detalles del Libro' }}
          />
          <Stack.Screen
            name="AddBook"
            component={BookFormScreen}
            options={{ title: 'Agregar Libro' }}
          />
          <Stack.Screen
            name="EditBook"
            component={BookFormScreen}
            options={{ title: 'Editar Libro' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
