// Context voor authenticatie en gebruikersbeheer
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Creëer de AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controleer bij het laden van de applicatie of er een gebruiker is ingelogd
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getUser();
          setUser(storedUser);
          
          // Verifieer de gebruiker bij de server
          const response = await authService.getCurrentUser();
          setUser(response.data.data);
        }
      } catch (err) {
        console.error('Fout bij het ophalen van de huidige gebruiker:', err);
        // Bij een fout, log de gebruiker uit
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login functie
  const login = async (email, wachtwoord) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(email, wachtwoord);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Er is een fout opgetreden bij het inloggen');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout functie
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Fout bij uitloggen:', err);
    } finally {
      setLoading(false);
    }
  };

  // Waarden die beschikbaar worden gesteld via de context
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook om de AuthContext te gebruiken
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth moet binnen een AuthProvider worden gebruikt');
  }
  return context;
};

export default AuthContext;
