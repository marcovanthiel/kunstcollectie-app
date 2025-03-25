// Bijgewerkte App.jsx met routing en authenticatie integratie
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import KunstwerkenOverzicht from './components/kunstwerken/KunstwerkenOverzicht';
import KunstwerkFormulier from './components/kunstwerken/KunstwerkFormulier';
import KunstenaarsOverzicht from './components/kunstenaars/KunstenaarsOverzicht';
import KunstenaarFormulier from './components/kunstenaars/KunstenaarFormulier';
import LocatiesOverzicht from './components/locaties/LocatiesOverzicht';
import LocatieFormulier from './components/locaties/LocatieFormulier';
import Rapportages from './components/rapportages/Rapportages';
import Dashboard from './components/dashboard/Dashboard';

// Aangepast thema met de gewenste kleuren
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f2ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005cb3',
      700: '#004480',
      800: '#002d4d',
      900: '#00171a',
    },
    accent1: {
      // Paars
      50: '#f2e6ff',
      100: '#d9b3ff',
      200: '#bf80ff',
      300: '#a64dff',
      400: '#8c1aff',
      500: '#7300e6',
      600: '#5900b3',
      700: '#400080',
      800: '#26004d',
      900: '#0d001a',
    },
    accent2: {
      // Groen
      50: '#e6fff2',
      100: '#b3ffd9',
      200: '#80ffbf',
      300: '#4dffa6',
      400: '#1aff8c',
      500: '#00e673',
      600: '#00b359',
      700: '#008040',
      800: '#004d26',
      900: '#001a0d',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Publieke routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Beveiligde routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Kunstwerken routes */}
            <Route path="/kunstwerken" element={
              <PrivateRoute>
                <Layout>
                  <KunstwerkenOverzicht />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/kunstwerken/nieuw" element={
              <PrivateRoute>
                <Layout>
                  <KunstwerkFormulier />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/kunstwerken/:id" element={
              <PrivateRoute>
                <Layout>
                  <KunstwerkFormulier />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Kunstenaars routes */}
            <Route path="/kunstenaars" element={
              <PrivateRoute>
                <Layout>
                  <KunstenaarsOverzicht />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/kunstenaars/nieuw" element={
              <PrivateRoute>
                <Layout>
                  <KunstenaarFormulier />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/kunstenaars/:id" element={
              <PrivateRoute>
                <Layout>
                  <KunstenaarFormulier />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Locaties routes */}
            <Route path="/locaties" element={
              <PrivateRoute>
                <Layout>
                  <LocatiesOverzicht />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/locaties/nieuw" element={
              <PrivateRoute>
                <Layout>
                  <LocatieFormulier />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/locaties/:id" element={
              <PrivateRoute>
                <Layout>
                  <LocatieFormulier />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Rapportages route */}
            <Route path="/rapportages" element={
              <PrivateRoute>
                <Layout>
                  <Rapportages />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Admin routes - alleen toegankelijk voor admins */}
            <Route path="/admin/*" element={
              <PrivateRoute adminOnly={true}>
                <Layout>
                  {/* Admin componenten hier */}
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Redirect voor onbekende routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
