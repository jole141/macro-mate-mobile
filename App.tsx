import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import AuthProvider from './context/authContext';
import UserProvider from './context/userContext';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <UserProvider>
            <Navigation />
            <StatusBar />
          </UserProvider>
        </AuthProvider>
      </SafeAreaProvider>
    );
  }
}
