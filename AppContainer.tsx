import React, { useState } from 'react';
// FIX: Corrected import path for App to be relative.
import App from './App';
import LoginScreen from './LoginScreen';

export default function AppContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <App onLogout={handleLogout} />;
}